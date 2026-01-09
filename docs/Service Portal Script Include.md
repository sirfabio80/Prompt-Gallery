# Service Portal Script Includes
*(Focused reference for Service Portal architecture, server-side API design, and avoiding duplicated GlideRecord logic.)*

## Non-negotiable architecture principles

### 1) Script Includes are the single server-side API layer
- **All data access and business logic belongs in Script Includes**, not in widgets, client scripts, catalog client scripts, or UI Policies.
- Widgets (server scripts) may do **orchestration only**: gather inputs, call Script Includes, and shape data for the widget view.
- Client code must **only request data or trigger actions**, never implement business rules.

### 2) Keep “business” Script Includes strictly server-only
Service Portal is often the place where “just one quick GlideRecord” becomes 15 copies. The fix is **two-tier Script Includes**:

- **Tier A: Server-only service layer** (NOT GlideAjax enabled)
  - Contains all business rules and database access (GlideRecord / GlideRecordSecure).
  - Callable from widgets, Business Rules, scheduled jobs, Flow actions, etc.
- **Tier B: Thin GlideAjax wrapper** (GlideAjax enabled)
  - Contains *no* business logic and *no* complex data access.
  - Delegates to Tier A and returns structured responses (usually JSON).

This gives you the Script Include + GlideAjax pattern **without** turning your “real” API layer into a client-callable surface.

### 3) GlideRecord is server-side only
- **Never** attempt GlideRecord from the browser (client scripts, widget client controllers, UI scripts executed in the browser). It is a server API and will fail or behave unpredictably.
- Client-to-server data fetch must be done via **GlideAjax** (or other server-call mechanisms), with server logic in Script Includes.

---

## Script Include fundamentals you must get right

### Script Include form and key fields
ServiceNow Script Includes are created in **System Definition > Script Includes** and contain a name, description, and the server script itself. They also control whether the include is active, which scopes can access it, and whether it can be invoked from client contexts.

Key fields and what they really mean:

- **Name**
  - If defining a class, the *class name, prototype name, and `type` value must match the Name*.
  - If using a classless “on-demand” Script Include, the Name must match the function name.
- **API Name**
  - Internal name used when calling the Script Include from an out-of-scope application (scoped app boundaries).
- **Glide AJAX enabled (Client callable)**
  - Makes the Script Include callable from client contexts, including client scripts and other client-call scenarios (filters, reference qualifiers, URL-driven access).
  - When enabled, an **Access Controls** related list becomes available (you should use it).
- **Mobile callable**
  - Allows client scripts on mobile to call it.
- **Sandbox enabled**
  - Makes it available to scripts invoked from the script sandbox (for example some query conditions).
  - This should be enabled **only when strictly necessary**.
- **Accessible from**
  - Controls whether the Script Include is accessible from **all application scopes** or **this application scope only**.
- **Active**
  - Disables the include when unchecked.
- **Protection policy**
  - **None**: editable when installed or downloaded.
  - **Read-only**: readable but not modifiable on the target instance.
  - **Protected**: hides the script contents and encrypts it in memory to protect IP.
- **Related lists**
  - **Versions**: compare versions, revert to a previous version.
  - **Access Controls**: visible when GlideAjax enabled, used to protect against unauthorized use.

---

## Choosing the right Script Include shape

### Option A: Class-based Script Include (most common)
Use when you want a cohesive service object with private helpers and testable methods.

```js
var MyService = Class.create();
MyService.prototype = {
  initialize: function() {},

  doSomething: function(input) {
    // server-side logic
  },

  _privateHelper: function() {
    // convention: prefix with "_" for private helpers
  },

  type: "MyService"
};
```

### Option B: Classless (on-demand) Script Include
Use when a single global function is appropriate and you truly do not need an object.

```js
function myUtilityFunction() {
  // server-side logic
}
```

Guidance:
- Prefer class-based for anything you expect to evolve.
- Keep classless Script Includes small and obviously “utility-ish”.

---

## Separation patterns for Service Portal

### Pattern 1: Widgets call server-only Script Includes (recommended default)
Widget server script:
- Reads inputs (URL params, widget options, `input`, user context).
- Calls Script Includes for data and actions.
- Sets `data.*` for the widget template.

```js
// Widget Server Script (example)
(function() {
  var svc = new global.MyDomainService();
  data.items = svc.getItemsForUser(gs.getUserID());
})();
```

### Pattern 2: Client controller calls GlideAjax (only when client truly needs fresh server data)
Use when you must fetch data after initial render (typeahead, dependent dropdowns, live validation).

**Important:** the client-callable Script Include should be a wrapper that delegates to a server-only service include.

---

## GlideAjax wrapper pattern (safe, scalable, testable)

### The two-tier model
- `MyDomainService` (server-only): real logic and DB access.
- `MyDomainAjax` (client-callable): minimal parameter parsing, authorization checks, delegates to `MyDomainService`, returns JSON.

### Server-only service include (Tier A)
```js
var MyDomainService = Class.create();
MyDomainService.prototype = {
  initialize: function() {},

  getThing: function(sysId) {
    // Use GlideRecordSecure when user-driven access is involved (recommended for client-facing scenarios)
    var gr = new GlideRecordSecure("x_my_table");
    if (!gr.get(sysId)) return null;

    return {
      sys_id: gr.getUniqueValue(),
      number: gr.getValue("number"),
      short_description: gr.getValue("short_description"),
      display: {
        number: gr.getDisplayValue("number"),
        short_description: gr.getDisplayValue("short_description")
      }
    };
  },

  type: "MyDomainService"
};
```

### Client-callable wrapper include (Tier B)
```js
var MyDomainAjax = Class.create();
MyDomainAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  // Keep methods small. Delegate to Tier A.
  getThing: function() {
    var sysId = (this.getParameter("sysparm_sys_id") || "").trim();
    if (!sysId) return this._json({ ok: false, error: "Missing sysparm_sys_id" });

    // Optional: enforce roles or other checks here
    // if (!gs.hasRole("x_my_role")) return this._json({ ok: false, error: "Not authorized" });

    var svc = new global.MyDomainService();
    var thing = svc.getThing(sysId);

    return this._json({ ok: true, result: thing });
  },

  _json: function(obj) {
    return new global.JSON().encode(obj);
  },

  type: "MyDomainAjax"
});
```

### Client usage (Service Portal widget client controller)
```js
var ga = new GlideAjax("MyDomainAjax");
ga.addParam("sysparm_name", "getThing");
ga.addParam("sysparm_sys_id", c.data.sys_id);
ga.getXMLAnswer(function(answer) {
  var payload = JSON.parse(answer || "{}");
  if (payload.ok) {
    c.data.thing = payload.result;
  } else {
    c.data.error = payload.error || "Unknown error";
  }
});
```

Why this is the “right way”:
- Only the wrapper is client-callable.
- The business logic stays server-only and reusable from any server context (widgets, BRs, scheduled jobs).
- You have a clear boundary for security checks and response shaping.

---

## Security requirements for GlideAjax enabled Script Includes

### Access controls are not optional
When GlideAjax is enabled:
- You must define **Access Controls** for the Script Include unless it is intentionally public.
- You should treat a client-callable Script Include as a public attack surface by default.

### Prefer `GlideRecordSecure` for client-facing data access
When a client-callable Script Include queries the database, use **GlideRecordSecure** rather than GlideRecord for stronger security behavior (especially when returning records that depend on user access).

### “Private by default” authentication behavior
Instances can be configured to require authentication by default for client-callable Script Includes via the system property:

- `glide.script.ccsi.ispublic` (default expected value is `false` in hardened instances)
  - When set to false, GlideAjax-enabled Script Includes are treated as private by default.
  - You can override privacy per Script Include by implementing `isPublic()` in that Script Include.
  - The `isPublic()` function takes precedence over the system property.

```js
// Example inside a GlideAjax enabled Script Include
isPublic: function() {
  return false; // keep private even if system property differs
}
```

### Security recommendation messages
ServiceNow can display security recommendations when creating a GlideAjax enabled Script Include in customer applications, such as:
- Create an Access Control (unless public)
- Use GlideRecordSecure for database queries

Those recommendations can be disabled via:
- `glide.script.ccsi.customer_scoped.security_msgs_enabled` (default `true`)

---

## Performance and maintainability best practices

### Data access rules (do these always)
- **Always limit result sets**. Use `setLimit()` and implement pagination properly.
- Use `orderBy`/`orderByDesc` consistently so paging is deterministic.
- Retrieve only the fields you need. Avoid returning whole records.
- Use `chooseWindow(first, last)` for paging when appropriate.
- Avoid N+1 queries. Batch reads where possible.
- Prefer encoded queries for composition, but validate user-provided filters before using them.
- Never build queries by concatenating untrusted input without validation.

### Response shaping rules (DTOs, not GlideRecords)
Never return raw GlideRecords to the client or to widget templates.
Return plain objects (DTOs) shaped for the UI.

A common pattern for fields:
```js
{
  value: gr.getValue("field"),
  display_value: gr.getDisplayValue("field")
}
```

### Logging and errors
- Use predictable error objects (`{ ok: false, error: "..." }`).
- Don’t leak internal exception messages to end users.
- Log server errors with context (user, sys_id, inputs), but avoid logging sensitive data.

### Versioning
Use the **Versions** related list on Script Includes to:
- compare changes
- revert safely
- support controlled promotion in pipelines

---

## Constants and shared references (your Service Portal example)

### Centralised Constants Script Include
You can keep table names and other shared references in one place to avoid hard-coded strings across the portal.

```js
var Constants = Class.create();
Constants.TABLE_NAME = {
  CMDB_SERVICE:       "cmdb_ci_service",
  CMDB_OUTAGE:        "cmdb_ci_outage",
  ASSET:              "alm_asset",
  ACTIVITY:           "planned_task",
  ACTIVITY_HIGHLIGHT: "x_snc_healthserv_activity",
  REQUEST:            "sc_request",
  REQUEST_ITEM:       "sc_req_item",
  ORDER:              "sn_ind_tmt_orm_order",
  ORDER_LINE_ITEM:    "sn_ind_tmt_orm_order_line_item",
  ORDER_TASK:         "sn_ind_tmt_orm_product_order",
  INCIDENT:           "incident"
};

// Optional: freeze if your JS runtime supports it, otherwise rely on convention
if (typeof Object !== "undefined" && Object.freeze) {
  Object.freeze(Constants);
}

Constants.prototype = { type: "Constants" };
```

Notes:
- In ServiceNow, “constants” are usually just conventions. Freezing is nice-to-have, not required.
- Consider keeping constants in a scoped namespace (for example `x_company.portal.Constants`) to avoid collisions.

---

## Removing GlideRecord duplication from widgets (your Deviation example)

This is the core refactor goal: **widgets do not own record retrieval rules**. They call a Script Include.

### Service include (server-only) that encapsulates queries and DTO shaping
```js
var Deviation = Class.create();

Deviation.TABLE_NAME = Constants.TABLE_NAME.DEVIATION_CASE; // ensure this constant exists

Deviation.prototype = {
  initialize: function(gr) {
    this._gr = gr;
  },

  isValid: function() {
    return this._gr && this._gr.isValidRecord();
  },

  toJSON: function() {
    return {
      sys_id: this._gr.getUniqueValue(),
      number: this._elementToJSON(this._gr.getElement("number")),
      short_description: this._elementToJSON(this._gr.getElement("short_description")),
      sys_class_name: this._elementToJSON(this._gr.getElement("sys_class_name")),
      x_snc_ikea_scd_deviation_report: this._elementToJSON(this._gr.getElement("x_snc_ikea_scd_deviation_report")),
      x_snc_ikea_scd_deviation_image: this._elementToJSON(this._gr.getElement("x_snc_ikea_scd_deviation_image")),
      x_snc_ikea_scd_shipment_no: this._elementToJSON(this._gr.getElement("x_snc_ikea_scd_shipment_no")),
      x_snc_ikea_scd_deviation_rating: this._elementToJSON(this._gr.getElement("x_snc_ikea_scd_deviation_rating")),
      x_snc_ikea_scd_deviation_type: this._elementToJSON(this._gr.getElement("x_snc_ikea_scd_deviation_type")),
      account: this._elementToJSON(this._gr.getElement("account")),
      company: this._elementToJSON(this._gr.getElement("company"))
    };
  },

  _elementToJSON: function(ge) {
    return {
      value: ge.toString(),
      display_value: ge.getDisplayValue()
    };
  },

  type: "Deviation"
};

// --- Static helpers ---

Deviation.fromID = function(sysId) {
  return new Deviation(Deviation.getGr(sysId));
};

Deviation.getGr = function(sysId) {
  var gr = new GlideRecord(Deviation.TABLE_NAME);
  gr.get(sysId);
  return gr;
};

Deviation.getList = function(options) {
  var output = [];
  options = options || {};

  options.limit = options.limit || 20; // consider centralising page size in a DataUtils include
  options.page = options.page || 1;
  options.order_by = options.order_by || "sys_updated_on";
  options.order_direction = (options.order_direction || "desc").toLowerCase();

  var gr = new GlideRecord(Deviation.TABLE_NAME);

  // Pagination
  var first = ((options.page - 1) * options.limit) + 1;
  var last  = (options.page * options.limit) + 1;
  gr.chooseWindow(first, last);

  // Example constraint: restrict to user company scope (adapt to your access model)
  var companyId = gs.getUser().getCompanyID();
  gr.addQuery("account", companyId).addOrCondition("company", companyId);

  // Optional filter (validate if user-provided)
  if (options.filter) gr.addEncodedQuery(options.filter);

  // Deterministic ordering
  if (options.order_direction === "desc") gr.orderByDesc(options.order_by);
  else gr.orderBy(options.order_by);

  gr.setLimit(options.limit);
  gr.query();

  while (gr.next()) {
    output.push(Deviation.fromID(gr.getUniqueValue()).toJSON());
  }

  return output;
};
```

### How widgets should use it (server script)
```js
(function() {
  var opts = {
    page: parseInt($sp.getParameter("page"), 10) || 1,
    limit: 20
  };

  data.deviations = global.Deviation.getList(opts);
})();
```

Why this helps:
- One authoritative query and access rule for deviations.
- Widgets reuse the same API surface and don’t drift over time.
- Refactoring access rules is a single edit, not a portal-wide hunt.

---

## “Similar but different” approaches you can choose from

### Approach 1: Domain model objects (like `Deviation` above)
**Pros**
- Very reusable and readable.
- Keeps DTO shaping close to the record.

**Cons**
- Can become heavy if you over-model everything.
- Requires discipline with static helpers and naming.

Best for: complex domains where you return rich objects consistently.

### Approach 2: Service/DAO style Script Includes
Split responsibilities:
- `DeviationDAO` handles GlideRecord queries and returns GlideRecords or raw data.
- `DeviationMapper` shapes DTOs.
- `DeviationService` orchestrates rules and calls DAO + mapper.

**Pros**
- Very testable and explicit separation.
- Easier to swap implementations and mock layers.

**Cons**
- More files and structure overhead.

Best for: large portals with multiple devs and many domains.

### Approach 3: One “PortalAPI” service Script Include per domain
A single include provides:
- `getList`, `getById`, `search`, `validate`, `performAction`

**Pros**
- Extremely simple mental model.
- Easy for widget authors.

**Cons**
- Can become a “god class” without discipline.

Best for: small-to-medium portals that still want consistency.

Developer rule:
- Pick the approach that matches your team size and expected evolution.
- Whatever you pick, enforce it consistently across widgets.

---

## Checklist for code reviews (Script Include focused)

- [ ] No duplicated GlideRecord logic across widgets
- [ ] Business logic lives in server-only Script Includes
- [ ] If the client calls server logic, it goes through a thin GlideAjax wrapper
- [ ] Client-callable includes have Access Controls and role checks
- [ ] Use GlideRecordSecure where user-driven access is involved
- [ ] Result sets are limited and ordered deterministically
- [ ] Data returned to UI is DTOs, not raw records
- [ ] Inputs are validated (especially filters and sys_ids)
- [ ] Logging exists for failures without leaking sensitive detail
- [ ] Script Include is scoped correctly and “Accessible from” is intentional
- [ ] Script Include has version discipline (use Versions when needed)

---

## Discovery Script Includes (specialised note)
ServiceNow also uses Script Includes for Discovery tasks. Some Discovery-specific utilities exist (for example `GlideRecordUtil`, and exception classes like `DiscoveryException` and `AutomationException`). Treat these as specialised platform components and keep your Service Portal API layer separate from Discovery-specific code.

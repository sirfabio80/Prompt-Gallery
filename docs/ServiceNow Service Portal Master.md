# ServiceNow Service Portal Guide, Merged Master
## Portal Configuration + Widget Architecture + Script Includes + GlideAjax

**Merged from**
- **Master document.md** (ServiceNow Service Portal Complete Guide, v2.0, Dec 2025)
- **ServiceNow Portal Architecture - Custom Widgets + Script Includes + GlideAjax.md** (Zurich-era patterns)

**Primary goals**
- Prevent duplicated GlideRecord logic across widgets and UI scripts
- Enforce strict server–client separation
- Treat Script Includes as the single trusted server API layer
- Provide practical “how we do it” patterns (Constants + Deviation example)
- Offer multiple valid approaches where guidance is similar but different. When approaches diverge, both are documented and it’s up to the developer to choose based on context.

---

## Table of contents
1. Portal overview and configuration model  
2. Portal tables, hierarchy, and creation order  
3. Widget fundamentals: parts, lifecycle, and data flow  
4. Server–client boundaries and data access rules  
5. Script Includes: how to structure the server API layer  
6. Client-to-server patterns: Widget server actions vs GlideAjax vs Scripted REST  
7. Reuse patterns: embed vs clone, directive vs widget, Angular Providers  
8. Performance and scalability guardrails  
9. Styling and theming: CSS hierarchy, SASS strategy, Font Awesome  
10. “How we do it” examples: Constants + Deviation domain API  
11. Validation scripts and operational checklists  

---

# 1) Portal overview and configuration model

## 1.1 What Service Portal is
Service Portal includes:
- A **framework** (APIs, Angular services, directives, tools)
- A **portal** (pages connected by page IDs)

URL resolution:
- The portal is selected by the URL suffix
- The portal loads its configured homepage unless a page ID is specified in the URL

Example URL structure:
```
https://[instance].service-now.com/[url_suffix]?id=[page_id]
```

---

# 2) Portal tables, hierarchy, and creation order

## 2.1 Component hierarchy (canonical)
```
Portal (sp_portal)
├── Theme (sp_theme)
│   ├── Header (sp_header_footer) ─── Widget: Stock Header (widget-stock-header)
│   ├── Footer (sp_header_footer) ─── Widget: custom footer widget
│   └── CSS Includes (sp_css_include) ─── Style Sheet (sp_css)
│
├── Main Menu (sp_instance_menu) ─── Widget: Header Menu (widget-menu)
│   └── Menu Items (sp_rectangle_menu_item)
│
└── Pages (sp_page)
    └── Containers (sp_container)
        └── Rows (sp_row)
            └── Columns (sp_column)
                └── Widget Instances (sp_instance)
                    └── Widget Definition (sp_widget)
```

## 2.2 Critical header vs menu distinction (do not mix them up)

| Component | Table | Widget required | Linked via |
|---|---|---|---|
| Header container | `sp_header_footer` | **Stock Header** (`widget-stock-header`) | `sp_theme.header` |
| Menu definition | `sp_instance_menu` | **Header Menu** (`widget-menu`) | `sp_portal.sp_rectangle_menu` |

The Stock Header renders the portal menu at runtime based on the portal’s `sp_rectangle_menu`.

## 2.3 Mandatory record creation order (foreign key safe)
Create records in this order when scripting portal creation:

1. `sp_widget` (if custom widgets needed)  
2. `sp_css` (if custom CSS needed)  
3. `sp_header_footer` (requires `sp_widget`)  
4. `sp_theme` (requires header/footer)  
5. `sp_css_include` (requires `sp_css` + `sp_theme`)  
6. `sp_instance_menu` (requires `sp_widget`)  
7. `sp_rectangle_menu_item` (requires `sp_instance_menu`)  
8. `sp_page`  
9. `sp_container` (requires `sp_page`)  
10. `sp_row` (requires `sp_container`)  
11. `sp_column` (requires `sp_row`)  
12. `sp_instance` (requires `sp_column` + `sp_widget`)  
13. `sp_portal` (requires theme, menu, homepage page)

## 2.4 Page layout chain rule
Always follow:
```
sp_page → sp_container → sp_row → sp_column → sp_instance
```
Each record must reference its parent in the required reference field.

---

# 3) Widget fundamentals: parts, lifecycle, and data flow

## 3.1 Widget parts
Mandatory:
- HTML template (AngularJS markup)
- Client script (AngularJS controller)
- Server script (server execution)

Optional:
- Link function (DOM manipulation)
- Option schema (instance configuration)
- Angular Providers (services/factories/directives)
- Dependencies (external JS/CSS)

## 3.2 Widget lifecycle: `options`, `data`, `input`
First render:
- Server runs first
- Initializes `data` (empty object), reads `options`, `input` is typically undefined
- Sends `data` to client as JSON

Client:
- Accesses server model via `c.data`
- Can post changes back to the server

Key semantics:
- `c.options` is read-only config
- `c.data` is the live model
- `input` is what the client posts back to the server

## 3.3 Widget server calls available to the client
- `c.server.update()`  
  Posts the data model back, reruns server script, replaces `c.data` with server response.
- `c.server.get(payload)`  
  Posts explicit payload (commonly `{action: "..."}`) and returns updated data.
- `c.server.refresh()`  
  Rebuilds the model from the server response.

---

# 4) Server–client boundaries and data access rules

## 4.1 Non-negotiable separation of concerns
**Client side**
- UI state and rendering
- Collect input
- Call server APIs
- Transform for display only

**Server side**
- Business logic
- Permissions and validation
- GlideRecord/GlideAggregate access
- Data shaping

## 4.2 GlideRecord rule
- Treat GlideRecord as **server-side only** in your architecture.
- Do not implement table queries in widget client scripts.
- Do not duplicate GlideRecord blocks inside widget server scripts across multiple widgets.

---

# 5) Script Includes: structure the server API layer

## 5.1 Script Includes are your server API layer
Use Script Includes to centralize:
- GlideRecord queries and updates
- Validation and permission checks
- Data shaping into UI-ready objects
- Reusable domain operations across widgets, flows, and server automation

## 5.2 Strict visibility rule (recommended default)
- **Domain Script Includes: server-only**
- If the client must call server logic directly: create a **thin client-callable facade** that delegates to server-only domain APIs

This avoids “UI-driven data access” and prevents duplication.

## 5.3 Naming and class structure
If a Script Include defines a class:
- Name must match the class name and `type`
- Use `Class.create()` and `prototype`

---

# 6) Client-to-server patterns
Guidance can vary slightly across teams and platform patterns. All approaches below are valid, and the developer should choose based on scope, performance, governance, and reuse needs.

## 6.1 Approach A: Widget server actions (`input.action` router)
**Use when**
- The interaction is tightly coupled to the widget
- You want the simplest portal-native implementation
- You are fine with the widget server script being the entry point

**Pattern**
Client calls:
```js
c.server.get({ action: "list", page: 1, limit: 20 });
```

Server routes:
```js
(function() {
  if (!input || !input.action) {
    data.items = [];
    return;
  }

  if (input.action === "list") {
    //global or name of the custom scope
    data.items = new global.DeviationApi().getList({ page: input.page, limit: input.limit });
  }
})();
```

**Tradeoffs**
- Simple to implement
- But repeated calls rerun the widget server script and return a full model payload

## 6.2 Approach B: GlideAjax (structured client-to-server calls)
**Use when**
- Multiple UI surfaces (widgets, catalog, UI scripts) need the same server operation
- You want a stable “API-like” entry point
- You want to avoid rerunning widget server scripts for every interaction

**Pattern**
- Client calls a GlideAjax-enabled Script Include (facade)
- Facade validates input and delegates to server-only domain APIs
- Facade returns JSON

**Tradeoffs**
- Stronger API boundary and better reuse
- Requires careful ACL and parameter hardening

## 6.3 Approach C: Scripted REST APIs (recommended for larger, reusable APIs)
**Use when**
- You want a clean API surface, versioning, and broader reuse
- You want to decouple from portal mechanics
- You need integration-ready endpoints

**Tradeoffs**
- More setup and governance
- Best long-term for complex portals or multi-channel UI

### Choosing between A/B/C
It’s up to the developer. Practical guide:
- **Small widget-only feature** → A
- **Shared portal operations across multiple widgets** → B or C
- **Long-lived API surface and future-proofing** → C

---

# 7) Reuse patterns: embed vs clone, directive vs widget, Angular Providers

## 7.1 Embed instead of clone (preferred)
Cloning multiplies maintenance. Embedding reuses.

**When embedding becomes heavy**
Embedding a complex widget can pull unnecessary scripts and data. Consider a directive for lightweight reuse.

## 7.2 Directive vs Widget (two valid approaches)
**Approach A: Directive**
- Lightweight shared UI fragment
- Minimal overhead
- Best for UI-only reuse

**Approach B: Embedded widget**
- Best when the component needs server + client behavior
- Heavier payload

Developer chooses based on complexity and performance needs.

## 7.3 Angular Providers (services/factories) for shared state
Use when:
- Widgets must stay in sync
- You need state persistence without repeated server calls
- You want to keep controllers small

Maintenance rule:
- Remove unused injected providers to avoid confusion and improve readability.

---

# 8) Performance and scalability guardrails

## 8.1 Avoid large data sets by default
- Always filter
- Always limit
- Avoid loading large attachments/media tables in high-traffic widgets

## 8.2 Always set limits on server queries
Apply one paging approach consistently:
- `setLimit`
- or `chooseWindow` (paging)
Do not mix without a clear reason.

## 8.3 Beware auto-refresh patterns
Repeated calls to:
- `server.update()`
- `server.refresh()`
- `spUtil.update()`
- `spUtil.refresh()`
rerun server scripts frequently and can cause portal-wide performance issues.

## 8.4 Record watchers must be filtered
Use recordWatch filters and refresh intentionally rather than watching whole tables.

---

# 9) Styling and theming

## 9.1 CSS hierarchy (lowest to highest priority)
1. Bootstrap defaults  
2. Branding / Portal CSS  
3. Theme CSS variables (`sp_theme`)  
4. Page CSS (`sp_page`)  
5. Container/Row/Column CSS  
6. Widget CSS (`sp_widget`)  
7. Widget instance CSS (`sp_instance`)  

Rule of thumb:
- Put global branding in theme
- Use widget CSS for widget-specific styling
- Use instance CSS only for true one-off overrides

## 9.2 SASS variables best practice (two approaches)
**Approach A (preferred for governance): Theme-owned variables**
- Define SASS variables only in `sp_theme.css_variables`
- Widgets inherit and do not hardcode

**Approach B (use sparingly): Widget introduces new variables with `!default`**
Widgets can define new variables using `!default` so the theme can override:
```scss
$my-custom-color: #336699 !default;
```

Developer decides based on:
- Branding governance needs
- Reuse requirements
- Whether the variable is truly global or widget-local

## 9.3 Font Awesome usage
Service Portal includes Font Awesome 4.7.0. Use `<i class="fa fa-..."></i>` patterns in templates.

---

# 10) “How we do it” examples (your portal patterns)

This section is intentionally concrete so teams can replicate it.

## 10.1 Constants Script Include (server-only shared constants)
Use constants to centralize:
- table names
- field names
- encoded query fragments
- system properties keys
- domain identifiers

Your example:
```js
var Constants = Class.create();
Constants.TABLE_NAME = {
  CMDB_SERVICE        : "cmdb_ci_service",
  CMDB_OUTAGE         : "cmdb_ci_outage",
  ASSET               : "alm_asset",
  ACTIVITY            : "planned_task",
  ACTIVITY_HIGHLIGHT  : "x_snc_healthserv_activity",
  REQUEST             : "sc_request",
  REQUEST_ITEM        : "sc_req_item",
  ORDER               : "sn_ind_tmt_orm_order",
  ORDER_LINE_ITEM     : "sn_ind_tmt_orm_order_line_item",
  ORDER_TASK          : "sn_ind_tmt_orm_product_order",
  INCIDENT            : "incident"
};
Object.freeze(Constants);
```

Notes:
- Keep it server-only.
- Consider namespacing if you have multiple scoped apps.
- If runtime compatibility is a concern, freezing is optional.

## 10.2 Domain Script Include that owns GlideRecord logic: `Deviation`
This is the right architectural direction: GlideRecord lives here, widgets call this.

Your example (as provided):
```js
var Deviation = Class.create();

Deviation.TABLE_NAME = Constants.TABLE_NAME.DEVIATION_CASE;

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
      number: this._elementToJSON(this._gr.getElement('number')),
      short_description: this._elementToJSON(this._gr.getElement('short_description')),
      sys_class_name: this._elementToJSON(this._gr.getElement('sys_class_name')),
      x_snc_ikea_scd_deviation_report: this._elementToJSON(this._gr.getElement('x_snc_ikea_scd_deviation_report')),
      x_snc_ikea_scd_deviation_image: this._elementToJSON(this._gr.getElement('x_snc_ikea_scd_deviation_image')),
      x_snc_ikea_scd_shipment_no: this._elementToJSON(this._gr.getElement('x_snc_ikea_scd_shipment_no')),
      x_snc_ikea_scd_deviation_rating: this._elementToJSON(this._gr.getElement('x_snc_ikea_scd_deviation_rating')),
      x_snc_ikea_scd_deviation_type: this._elementToJSON(this._gr.getElement('x_snc_ikea_scd_deviation_type')),
      account: this._elementToJSON(this._gr.getElement('account')),
      company: this._elementToJSON(this._gr.getElement('company'))
    };
  },

  _elementToJSON: function(ge) {
    return {
      value: ge.toString(),
      display_value: ge.getDisplayValue()
    };
  },

  type: 'Deviation'
};

Deviation.fromID = function(sysID) {
  return new Deviation(Deviation.get(sysID));
};

Deviation.get = function(sysID) {
  var gr = new GlideRecord(Deviation.TABLE_NAME);
  gr.get(sysID);
  return gr;
};

Deviation.getGr = function(sysID) {
  var gr = new GlideRecord(Deviation.TABLE_NAME);
  gr.get(sysID);
  return gr;
};

Deviation.getList = function(options) {
  var output = [];
  options = options || {};
  options.limit = options.limit || DataUtils.getPageSize();
  options.page = options.page || 1;
  options.order_by = options.order_by || 'sys_updated_on';
  options.order_direction = options.order_direction || 'desc';

  var gr = new GlideRecord(Deviation.TABLE_NAME);

  var windowBounds = DataUtils.getPageWindowBounds(options.page, options.limit);
  gr.chooseWindow(windowBounds.first, windowBounds.last);

  gr.addQuery('account', gs.getUser().getCompanyID()).addOrCondition('company', gs.getUser().getCompanyID());

  if (options.filter)
    gr.addEncodedQuery(options.filter);

  gr.setLimit(options.limit);

  if (options.order_direction.toLowerCase() == 'desc')
    gr.orderByDesc(options.order_by);
  else
    gr.orderBy(options.order_by);

  gr.query();

  while (gr.next()) {
    output.push(new Deviation.fromID(gr.getUniqueValue()).toJSON());
  }

  return output;
};
```

### Key improvement (strongly recommended): avoid N+1 queries
Current loop re-queries each record via `fromID()`.
Preferred:
```js
while (gr.next()) {
  output.push(new Deviation(gr).toJSON());
}
```

### Two valid approaches for access enforcement (developer decides)
**Approach A: Secure querying**
- Use secure patterns (for example `GlideRecordSecure`) so ACLs are applied naturally

**Approach B: Explicit allow-list**
- Keep domain queries strict (account/company constraints)
- Add explicit checks (for example `$sp.canReadRecord`) when shaping data for portal

Choose based on:
- Whether the portal should strictly mirror ACL behavior
- Whether business policy is stricter than ACLs

---

# 11) Validation scripts and operational checklists

## 11.1 Portal configuration validator (Scripts - Background)
Use a validator to detect common configuration mistakes:
- wrong header widget (menu vs stock header)
- missing theme/menu linkage
- broken page hierarchy references

Keep validators admin-only and reusable.

## 11.2 Code review checklist (use this every PR)

### Widget client script
- [ ] No GlideRecord
- [ ] No business rules or permission decisions
- [ ] Calls server via (A) widget actions, (B) GlideAjax, or (C) REST
- [ ] Defensive JSON parsing and stable response contracts
- [ ] Debounce typeahead/search

### Widget server script
- [ ] Only initial model + routing
- [ ] Delegates real work to domain Script Includes
- [ ] Limits/paging always applied
- [ ] No duplicated query blocks across widgets

### Script Includes
- [ ] Domain Script Includes are server-only by default
- [ ] If client-callable exists, it is a thin facade only
- [ ] Input validation is strict
- [ ] No N+1 query patterns
- [ ] Clear method contracts and consistent JSON shaping

---

## Quick reference: the three critical portal rules
1. `sp_header_footer.widget` must be `widget-stock-header` for headers  
2. `sp_instance_menu.widget` must be `widget-menu` for navigation menus  
3. Always build layout using: `sp_page → sp_container → sp_row → sp_column → sp_instance`  

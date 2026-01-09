# Service Portal, GlideRecord + GlideForm (g_form)
**Release context:** Zurich (PDF printouts generated Jan 9, 2026)

This document is a practical guide to using **GlideRecord** and **GlideForm (g_form)** correctly in **Service Portal** and custom widgets, with an emphasis on safe server-client separation and maintainable patterns.

---

## 1) The non-negotiables (server-client boundaries)

### GlideRecord
- **GlideRecord is a server-side API.** In Service Portal widgets, it belongs in:
  - **Widget Server Script** (server runtime), or preferably
  - **Server-only Script Includes** that act as your “data access + business logic” layer.
- **Never attempt to use server GlideRecord directly in browser code.** If you need data in the browser, you fetch it through a server endpoint (most commonly **Script Include + GlideAjax**).
- ServiceNow also exposes a **client-side GlideRecord API** (a proxy that queries the server), but it is easy to misuse and is generally a worse architectural choice than Script Include + GlideAjax. It also requires **asynchronous** usage (details below).【turn14file7†file_00000000bad071f48053190d078ba1d0†L22-L27】

### GlideForm (g_form)
- **GlideForm is a client-side API** to control **forms** (field values, visibility, mandatory, messages, etc.).【turn14file0†file_00000000013c71f4a82ccc08d0be9ad5†L7-L18】  
- You use `g_form` in client scripts such as:
  - **Catalog Client Scripts**, **Wizard Client Scripts**, and similar client contexts (after testing in your target UI).【turn14file0†file_00000000013c71f4a82ccc08d0be9ad5†L9-L12】
- In Service Portal, some DOM-centric GlideForm methods are **not available** (examples below).【turn14file12†file_00000000013c71f4a82ccc08d0be9ad5†L1-L6】

---

## 2) Where these APIs “live” inside Service Portal and widgets

### Widget Server Script (server runtime)
- ✅ Can use **server-side GlideRecord** directly.
- ✅ Best practice: use GlideRecord inside **server-only Script Includes** and call those from the widget server script.
- ✅ Return simple structures via `data` (objects, arrays, primitives) to the widget client controller.

### Widget Client Controller (browser runtime)
- ✅ Use **Angular**, `spUtil`, widget inputs, and **GlideAjax** to request server data.
- ❌ Do **not** use server-only APIs (server GlideRecord, `gs`, etc.).
- ⚠️ Avoid client-side GlideRecord unless you have a narrow reason and you fully accept its trade-offs.

### Catalog / Form contexts in Service Portal
- ✅ `g_form` is available when you are actually on a **form experience** (for example Service Catalog item forms).
- ⚠️ Some GlideForm methods are **not supported** in Service Portal scripts, and you must use the Portal-appropriate variants (example: display value retrieval).【turn14file12†file_00000000013c71f4a82ccc08d0be9ad5†L25-L29】

Also note: Service Portal widgets can be used to replace Service Catalog form scripts or macros in some cases, and ServiceNow provides special mechanisms for accessing form variables in those scenarios.【turn14file11†file_0000000029d8720a90822f1c0384396c†L55-L60】

---

## 3) GlideRecord on the server (Widget Server Script and Script Includes)

### 3.1 A clean “data access layer” pattern for Service Portal
**Goal:** write GlideRecord queries once, reuse everywhere, and keep widgets thin.

Recommended structure:
1. **Script Include (server-only)** = query + business logic + shaping output
2. **Widget Server Script** = calls Script Include methods and assigns `data.*`
3. **Widget Client Script** = renders `data.*` and makes GlideAjax calls for interactions

This avoids:
- repeating encoded queries across multiple widgets
- scattered ACL-sensitive logic in client code
- untestable one-off logic in widget server scripts

### 3.2 GlideRecord query building (server)
A practical server-side pattern:
- Instantiate GR with a table name
- Add conditions with `addQuery()` (and/or `addEncodedQuery()` when appropriate)
- Add ordering
- Limit the record set
- Query and iterate
- Convert to plain JSON-friendly objects (sys_id/value/display_value pattern is a good default)

Example skeleton (server):
```js
function listIncidentsForUser(userSysId, limit) {
  var out = [];
  var gr = new GlideRecord('incident');
  gr.addQuery('caller_id', userSysId);
  gr.orderByDesc('sys_updated_on');
  gr.setLimit(limit || 20);
  gr.query();

  while (gr.next()) {
    out.push({
      sys_id: gr.getUniqueValue(),
      number: gr.getValue('number'),
      short_description: gr.getValue('short_description'),
      state: {
        value: gr.getValue('state'),
        display_value: gr.getDisplayValue('state')
      }
    });
  }
  return out;
}
```

### 3.3 Performance and safety checklist (server)
When using GlideRecord in the widget server script or in Script Includes:
- Prefer **selective field usage** (build the output explicitly) instead of returning whole records.
- Use **indexes** and avoid broad unbounded queries.
- Use **setLimit** and consider pagination. For large lists, implement page windows at the server layer.
- Avoid building dynamic encoded queries from untrusted user input.
- Do not disable security checks. Let **ACLs** work as intended unless you have a very clear reason and compensating controls.

### 3.4 When to avoid server GlideRecord in a widget server script
Avoid directly writing large queries inside multiple widget server scripts when:
- the logic must be reused
- the query is non-trivial (joins via references, multi-condition filters, user context filtering)
- you need consistent output shape across multiple UI surfaces

In those cases, the widget should call a Script Include API method instead.

---

## 4) Client-side GlideRecord (what it is, and why to be careful)

ServiceNow provides a **client-side GlideRecord API** that performs a server query and returns results to a callback. The documentation explicitly warns you not to use synchronous calls because they block UI rendering and degrade user experience.【turn14file7†file_00000000bad071f48053190d078ba1d0†L25-L27】

### 4.1 The async-only rule
`query()` without a response function is synchronous, and is explicitly called out as “DO NOT USE”.【turn14file7†file_00000000bad071f48053190d078ba1d0†L46-L56】

Async pattern:
```js
var gr = new GlideRecord('incident');
gr.addQuery('active', true);
gr.query(function(grResult) {
  while (grResult.next()) {
    // use grResult.<field> or grResult.getValue('<field>')
  }
});
```

### 4.2 Display values in Service Portal
In Service Portal (and Mobile and Agent Workspace), the client-side GlideRecord supports retrieving **display values** for fields.【turn14file7†file_00000000bad071f48053190d078ba1d0†L66-L72】

### 4.3 Why Script Include + GlideAjax is still usually better
Even though client-side GlideRecord “works” in some contexts, Script Include + GlideAjax is typically more:
- predictable (you define the contract)
- secure (you control what’s returned)
- reusable (one server API layer across widgets/forms)
- testable (Script Include methods can be unit-tested more easily)

If you already have a Script Include API layer, prefer **GlideAjax** over client-side GlideRecord.

---

## 5) GlideForm (g_form) essentials for Service Portal forms

### 5.1 What g_form is for
`g_form` is for controlling the **current form** in the browser: reading/writing values, enforcing UI rules, showing messages, and controlling field behavior.

ServiceNow documents GlideForm as **client-side only** and recommends testing methods in non-standard contexts (catalog, wizards) to confirm behavior.【turn14file0†file_00000000013c71f4a82ccc08d0be9ad5†L9-L12】

### 5.2 Service Portal differences you must remember

#### Use `getDisplayValue()` in Service Portal
- `getDisplayBox()` is “core UI” oriented.
- In Service Portal, use `g_form.getDisplayValue('<field>')` to obtain the display value for a field.【turn14file12†file_00000000013c71f4a82ccc08d0be9ad5†L25-L29】

#### Some DOM/element methods are not available in Service Portal scripts
At least `getControl()` is explicitly called out as **not available** in Service Portal scripts.【turn14file12†file_00000000013c71f4a82ccc08d0be9ad5†L1-L6】  
As a general rule, avoid approaches that depend on HTML element handles in Portal.

### 5.3 High-value g_form method categories (what you actually use daily)
Below are the “working set” categories most teams rely on. Always validate availability in your target UI.

#### Read values
- `g_form.getValue(fieldName)` for raw values
- `g_form.getDisplayValue(fieldName)` for display values in Service Portal【turn14file12†file_00000000013c71f4a82ccc08d0be9ad5†L45-L59】

#### Write values
- `g_form.setValue(fieldName, value)` to set a field

#### Control field behavior
- visibility (show/hide)
- mandatory (require input)
- read-only (prevent changes)

#### User feedback
- add info/warning/error messages
- show field-level messages, clear messages

#### Reference fields and async data
- Reference lookups often need **async** patterns (see below)

### 5.4 Reference fields and the async reality
On forms, reference data can be expensive to resolve. The safe approach is to:
- treat reference resolution as **asynchronous**
- do not assume that a display value or reference object is immediately ready
- drive follow-up logic from callbacks (or promises if your environment supports them)

---

## 6) Putting it together: Service Portal patterns that scale

### Pattern A: Widget list view with server-side GlideRecord (preferred)
**When:** display lists, details, aggregations, or “my work” dashboards in widgets.

- Widget server script calls a Script Include method that uses GlideRecord.
- The Script Include returns an array of plain objects.
- Widget client renders it.
- Any filtering/paging interactions call GlideAjax which calls the same Script Include.

### Pattern B: Form-driven experience using g_form + GlideAjax (preferred)
**When:** dynamic form behavior needs server data (validation, computed values, dependent values).

- Client: `g_form` drives UX and captures user input.
- Client: `GlideAjax` requests server computation / data.
- Server: Script Include validates input, queries with GlideRecord, returns JSON.
- Client: apply returned values via `g_form.setValue`, show messages, set mandatory/visibility.

### Pattern C: Client-side GlideRecord (use sparingly)
**When:** you have a narrowly-scoped need, you accept the trade-offs, and you can keep it truly lightweight.

Rules:
- async only
- limit results
- no business logic embedded in the browser
- prefer to migrate to Script Include + GlideAjax if usage grows

---

## 7) Quick “do this, not that” table

| Need | Do | Avoid |
|---|---|---|
| Fetch records for a widget | Script Include (server-only) + GlideRecord, called from widget server script | Copying GlideRecord queries into multiple widgets |
| Fetch server data from browser | GlideAjax -> Script Include -> GlideRecord | Putting business rules in widget client controller |
| Read display values on forms in Portal | `g_form.getDisplayValue('<field>')` | `getDisplayBox()` in Portal contexts【turn14file12†file_00000000013c71f4a82ccc08d0be9ad5†L25-L29】 |
| Run a client-side GR query | Async `query(callback)` only | Synchronous `query()` calls【turn14file7†file_00000000bad071f48053190d078ba1d0†L46-L56】 |
| Manipulate form DOM elements in Portal | Portal-safe g_form methods | `getControl()` and similar element methods in Portal scripts【turn14file12†file_00000000013c71f4a82ccc08d0be9ad5†L1-L6】 |

---

## 8) Minimal reference: “what to remember”

- **Server-side:** GlideRecord is your database workhorse.
- **Client-side:** g_form is your form controller.
- **Service Portal widgets:** server script is server, client script is browser, never blur the line.
- **For data access at scale:** Script Include + GlideAjax beats scattering queries everywhere.
- **If you must use client-side GlideRecord:** always use async callbacks and keep logic minimal.
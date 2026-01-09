# SKILL: Developing Custom Widgets in Service Portal (Zurich)

**Purpose**  
Create, clone, and maintain Service Portal custom widgets in a way that is performant, reusable, easy to debug, and architecturally clean (clear server-client separation, minimal duplication, predictable data flow).

**Primary user**  
An AI agent (and Build Agent in ServiceNow IDE) that needs to implement or refactor Service Portal widgets safely and consistently.

**Scope**  
This skill focuses on **Service Portal widget development**: Widget Editor usage, widget structure (server script, client script, HTML template, CSS, link function), options schema, embedding widgets, Angular Providers, dependencies, performance, and troubleshooting.

---

## What a widget is

A Service Portal widget is a packaged UI component that can be placed on portal pages. Each widget has:
- **HTML Template** (markup + Angular directives)
- **CSS** (styling)
- **Client Script** (AngularJS controller logic)
- **Server Script** (server-side controller logic that prepares `data` for the client, and can react to `input`)
- **Link Function** (optional, AngularJS directive-style post-link hook for DOM-level behavior)

The widget **server script executes on the server** and returns a **`data` object** to the client. The **client script runs in the browser** and reads `c.data` (where `c` is the widget controller).

---

## Skill inputs

Provide as many as possible:
- Widget name + intended behavior
- Target portal and page(s)
- Any required tables/records (catalog items, custom tables)
- Requirements for performance (expected data volume, refresh behavior)
- UI requirements (desktop/mobile/accessibility)
- Any reusable components to share across widgets (services, directives, providers)

---

## Skill outputs

- A new or updated widget (or a cloned widget) with:
  - Implemented server + client + template + CSS (and link function only if needed)
  - Instance configuration via option schema (or an extension table if justified)
  - Clear data flow and minimal duplicated logic
  - Debug-friendly logging
  - Performance-conscious queries and refresh strategy

---

## Core standards you MUST follow

### Server-client separation
- Server script is responsible for **initial state** and server-side preparation of `data`.
- Client script is responsible for **UI behavior** and calling server updates when necessary.
- Do not push business logic into the client, and avoid heavy server re-renders when a lighter call is enough.

### Performance defaults
Avoid common performance killers:
- Large attachments or heavy media/fonts loaded from `sys_attachment`.
- Auto-refresh patterns that repeatedly rerun the server script unnecessarily.
- Unfiltered record watchers that fire too often.
- GlideRecord queries without `setLimit()` (use a limit and design for paging).
- Widgets that pull large datasets on every page load, especially via scripted menu items.

### Maintainability defaults
- Prefer reusable components (Angular Providers, directives, services) rather than repeating bulky controller code in multiple widgets.
- Keep dependencies small and only load them when needed.

---

## Step-by-step process (Build Agent friendly)

### 1) Decide: create new vs clone
**Clone when** you can reuse most behavior from a base widget and accept that you will not automatically benefit from upstream updates to the original base widget.  
**Create new when** you need a clean design and minimal inherited complexity.

**Important note**  
Base system widgets are read-only by design so they can receive future updates. Clones are treated as custom.

### 2) Create or clone in Widget Editor
- Navigate to **Service Portal Configuration → Widget Editor**
- Choose:
  - **Create a new widget**  
  - **Edit an existing widget** (for clone/update)

Use **Create test page** while developing, then **delete test pages** when done to avoid clutter.

### 3) Enable Preview
Use the Widget Editor preview mode (eye icon) to quickly validate layout and client behavior.  
Reminder: demo data can appear in widget editor preview but is not visible in the designer view.

### 4) Implement widget structure
Implement in this order:
1. **Server Script**: build the data model + default state
2. **HTML Template**: bind to `c.data.*`
3. **Client Script**: interactions and controlled calls back to server
4. **CSS**: final styling
5. **Link Function** (only if you truly need DOM post-processing)

---

## Recommended widget skeleton

### Server Script pattern (initial state + targeted actions)
Use the server script to:
- Set an initial `data` shape
- Return default/demo state when inputs are not defined
- Handle updates with `input.action` to avoid rerunning unrelated logic

```javascript
(function() {
  data.items = [];
  data.state = data.state || {};

  // Default state when the widget is first placed or when no input is provided
  if (!input || !input.action) {
    data.state.mode = "default";
    data.items = getDefaultItems();
    return;
  }

  // Targeted server work based on action
  if (input.action === "search" && input.keywords) {
    data.state.mode = "search";
    data.items = searchItems(input.keywords, input.limit || 10);
    return;
  }

  function getDefaultItems() {
    // Keep it small and meaningful so the widget is never "blank"
    return [];
  }

  function searchItems(keywords, limit) {
    var results = [];
    var gr = new GlideRecord("sc_cat_item");
    gr.addActiveQuery();
    gr.addQuery("123TEXTQUERY321", keywords); // keyword search pattern used in docs
    gr.setLimit(limit);
    gr.query();
    while (gr.next()) {
      results.push({
        sys_id: gr.getUniqueValue(),
        name: gr.getValue("name"),
        short_description: gr.getValue("short_description"),
        price: gr.getValue("price")
      });
    }
    return results;
  }
})();
```

**Notes**
- Always constrain queries with `setLimit()`.
- Prefer small initial/default data so the widget has a visible “starting state”.

### Client Script pattern (controller + controlled refresh)
Use client script for:
- UI behavior
- Lightweight state
- Calling the server only when needed

```javascript
function($scope, spUtil) {
  var c = this;

  c.search = function() {
    if (!c.data.keywords) return;

    // Prefer targeted server.get for lighter server calls where possible
    c.server.get({
      action: "search",
      keywords: c.data.keywords,
      limit: c.options.max_results || 10
    }).then(function() {
      // c.data is updated after server.get
    });
  };
}
```

### HTML template pattern (debounce + display)
Use Angular directives (e.g., `ng-change`, `ng-repeat`). Debounce high-frequency inputs.

```html
<div class="panel panel-primary">
  <div class="panel-heading">Request an item</div>
  <div class="panel-body">
    <input class="form-control"
           type="search"
           placeholder="Start typing to search"
           ng-model="c.data.keywords"
           ng-change="c.search()"
           ng-model-options="{debounce: 250}" />

    <ul class="list-group result-container">
      <li class="list-group-item" ng-repeat="item in c.data.items">
        <span class="item-title">{{::item.name}}</span>
        <div class="small text-muted">{{::item.short_description}}</div>
      </li>
    </ul>
  </div>
</div>
```

### Link function usage (only when needed)
Use a link function when you must:
- Interact with the DOM after rendering
- Attach low-level event handlers
- Work with 3rd-party JS that requires direct DOM access

Do not use a link function as a replacement for good widget architecture.

---

## Widget option schema (instance configuration)

Widget instances can be configured per page placement.
- Basic instance options are stored as JSON in the **Additional options, JSON format** field on **`sp_instance`**.
- Supported option field types include:
  - String, Boolean, Integer, Reference, Choice, Field_list, Field_name, Glide_list

### Default options
If an option is not set on an instance, it will evaluate as `undefined`.  
Define defaults in the server script:

```javascript
(function() {
  options.text_color = options.text_color || "blue";
  options.maximum_entry_count = options.maximum_entry_count || 5;
})();
```

### When to use an extension table instead of JSON options
Use an extension table for widget instance options only if you need:
- Field types not supported by option schema
- More complex option structures
- Searchable or filterable instance options

Be aware: it is more complex to maintain and can add additional server calls. Prefer editing the option schema when possible.

### Accessing options
- **Client:** `c.options.some_option`
- **Server:** `options.some_option`

---

## Reuse patterns

### 1) Angular Providers (reusable directives/services)
Angular Providers are reusable components you can inject across multiple widgets.  
Use them to:
- Avoid bloated client controllers
- Persist state for the lifetime of the portal
- Reuse common data objects and UI behaviors

**Provider constraints**
- Provider code must be anonymous and not appended to a specific Angular module.

**Example: directive provider (simplified)**
```javascript
function() {
  return {
    restrict: "E",
    replace: true,
    scope: { category: "=" },
    template: "<span class='fa fa-{{::icon}}'></span>",
    link: function(scope) {
      var map = {
        // category_sys_id: "icon_name"
      };
      scope.icon = map[scope.category] || "shopping-cart";
    }
  };
}
```

**Associate provider with a widget**
- Create provider record (Widget Angular Providers)
- Add it to the widget’s related list (Angular Providers)
- Use the directive inside the widget HTML

### 2) Embedded widgets
Embed existing widgets to reuse complex components (for example, embedding a catalog item widget inside another widget).

**Embed in HTML template (with options from `data`)**
```html
<widget id="widget-cool-clock" options="data.clockOptions"></widget>
```

```javascript
// Server script
(function() {
  data.clockOptions = { zone: "America/Los_Angeles", title: "San Diego, CA" };
})();
```

**Embed a widget model from server script**
```javascript
(function() {
  var opts = { zone: "America/Los_Angeles", title: "San Diego, CA" };
  data.coolClockWidget = $sp.getWidget("widget-cool-clock", opts);
})();
```

```html
<sp-widget widget="data.coolClockWidget"></sp-widget>
```

**Embed in client script**
Use `spUtil.get()` to fetch a widget model and store it on the controller.

```javascript
spUtil.get("widget-sc-cat-item", { sys_id: "your_catalog_item_sys_id" })
  .then(function(response) {
    c.catalogItemWidget = response;
  });
```

### 3) Prefer directives over embedded widgets when the component is lightweight
Embedded widgets add overhead. Use a directive when you need:
- A reusable subsection of UI
- Shared scope behavior
- A small component without server-side functionality

### 4) Share data and state with services/factories
Use data services and factories to keep widgets synchronized and avoid repeated server calls.

---

## Server update strategy: update vs get vs REST

### Avoid unnecessary full widget reloads
Calls that rerun the server script and return the full widget can be expensive:
- `server.update()`, `spUtil.update()`, `server.refresh()`, `spUtil.refresh()`

Use them intentionally.

### Preferred pattern
- Use the server script to initialize state once.
- For subsequent updates:
  - Prefer `server.get()` for targeted server work.
  - For broader, reusable server operations, use **Scripted REST APIs that call Script Includes** so logic is centralized and reusable across widgets and other UI surfaces.

This separation keeps UI code thin and concentrates business logic in one place.

---

## Events and communication between widgets

### Avoid `$broadcast` on `$rootScope`
Broadcasting is expensive and noisy.

### Prefer publish/subscribe
Use a publish/subscribe service so:
- Event relationships are explicit
- Callbacks are controlled
- Widget state remains predictable

---

## Accessibility, localization, and UI quality

### Mobile-first interaction
Avoid desktop-only interactions that do not translate to mobile (like mouse-over dependent UI).

### Styling standards
- Use SCSS variables for reuse
- Use named variables for colors rather than hard-coded values

### Internationalization
Wrap user-visible strings using localization APIs so they can be translated.

---

## Security posture for widgets

- Server script runs with server-side permissions and must enforce access rules.
- Only return the minimum data required by the UI.
- Avoid leaking sensitive record data into `data` without verifying access.

---

## Debugging and troubleshooting checklist

### Quick isolation
- Temporarily deactivate unrelated widgets on the page to isolate the issue (set widget `Active = false`).

### Browser developer tools
Use the browser console to inspect:
- Console errors
- Network calls and request volume
- Slow-loading widgets or long-running requests

### Widget context menu
Use **CTRL + right-click** on a widget to access options to:
- Inspect configuration
- Output the widget scope / scope data object to the console
- Access widget diagnostics

### Scripted debugging methods
Common tools mentioned in docs:
- `console.log()` (client and server, logs to browser console)
- `$sp.log()` (server, logs to Service Portal Log Entries `sp_log`)
- `gs.warn()` (server, warning level output to `syslog`)
- `gs.error()` (server, error level output to `syslog`)
- `gs.addInfoMessage()` (server, shows a green info message at top of browser)

### Widget diagnostics (customization levels)
When diagnosing issues, identify whether you are looking at:
- **Base** widgets (no code modifications, may have instance options)
- **Cloned** widgets
- **New** widgets
- **Customized** widgets (base widget configured via its related records like dependencies, ng-templates, Angular Providers)

On a portal page, “Show Widget Customizations” color-codes widgets. Use this to spot which widgets are most likely impacted.

---

## Widget dependencies (JS/CSS packages)

Widgets can load external JS/CSS via **dependency packages** to integrate:
- Third-party libraries
- External stylesheets
- Angular modules

**Guiding principle**
Dependencies load asynchronously when needed. The more you add, the more the widget must download. Keep them small and only include what’s necessary.

**Create a dependency package**
- Navigate to **Service Portal → Dependencies**
- Create a dependency record (name, application scope, and whether it loads on initial page load)
- Add **JS Includes** and **CSS Includes** in related lists
  - For each include, specify a display name and a source
  - Sources include **URL** or **UI Script / Style Sheet** depending on include type

---

## Known pitfalls and how to avoid them

### 1) “Blank widget” on first load
If a widget depends on instance options or an input variable that is not defined initially, it may render empty.  
Fix: implement a meaningful default state or demo data.

### 2) Excessive server churn
High-frequency `server.update()` calls can lead to repeated server script execution and heavy traffic.  
Fix: debounce inputs, prefer `server.get()` or REST calls for incremental updates, and keep server script branching controlled.

### 3) Cloning widgets with ng-templates
If a base widget uses Angular ng-templates, cloning the widget requires cloning the template as well and updating template references to the new template name.

### 4) Unbounded queries
GlideRecord without `setLimit()` is a frequent cause of slow pages.  
Fix: always use limits and paging, and avoid loading large data sets on pages that are frequently visited.

---

## Completion criteria (definition of done)

A widget change is “done” when:
- The widget has a visible and informative default state
- Data flow is clear: server builds `data`, client renders and triggers targeted server calls
- No large unfiltered queries, and all server queries use `setLimit()` with sensible defaults
- Widget refresh behavior is intentional and does not spam server.update/refresh
- Reuse is implemented where appropriate (Angular Provider, directive, embedded widget)
- Strings are ready for localization and UI works on mobile
- Debugging hooks exist (logs where needed, reproducible test page removed after completion)

---

## Notes for Build Agent execution

When implementing this skill through an agent:
- Prefer safe refactors that preserve existing behavior
- Make changes incrementally (server first, then template, then client)
- Keep widget dependencies minimal and explicit
- Document instance options and defaults in server script comments

# ServiceNow Service Portal Complete Development Guide

## Build Agent Critical Instructions

**IMPORTANT:** This document is the authoritative reference for ServiceNow Service Portal development. When creating portals, pages, widgets, themes, or layouts, follow the patterns and best practices documented here.

### Critical Rules

1. **NEVER place GlideRecord scripts directly in widget Server Script fields** - Always use Script Includes
2. **Columns in a row must sum to 12** - Bootstrap grid requirement
3. **Theme CSS Variables should ONLY contain SCSS variable declarations** - Never include CSS rule sets
4. **Use `!default` flag in all widget SCSS variables** - Ensures theme values take precedence
5. **Use order field increments of 100** - Allows future insertions (100, 200, 300...)
6. **Headers link via Theme, NOT page layout** - Never add header widgets to sp_container/sp_row/sp_column
7. **Menus link via Portal** - sp_portal.sp_rectangle_menu field
8. **Always deregister $rootScope.$on listeners** - Prevent memory leaks

### Framework Versions

- **AngularJS:** 1.5.1 (NOT 1.6+ or 2+)
- **Bootstrap:** 3.3.6 (NOT Bootstrap 4 or 5)

**Access Method:** `https://<instance>.service-now.com/<portal_suffix>?id=<page_id>`

---

## Table of Contents

### Part 1: Foundation
1. [Complete Data Model & Schema](#part-1-complete-data-model--schema)
2. [Schema Relationships Map](#schema-relationships-map)

### Part 2: Page Layout System
3. [Layout Hierarchy](#part-2-page-layout-system)
4. [Bootstrap v3 Grid System](#bootstrap-v3-grid-system)
5. [Creating Page Layouts](#creating-page-layouts-programmatically)
6. [Common Layout Patterns](#common-layout-patterns)

### Part 3: Theme System
7. [Theme Architecture](#part-3-theme-system)
8. [CSS/SCSS Processing Pipeline](#cssscss-processing-pipeline)
9. [SASS Variables Reference](#sass-variables-reference)

### Part 4: Header & Menu System
10. [Header Architecture](#part-4-header--menu-system)
11. [Menu Configuration](#creating-the-menu)
12. [Header vs Menu Distinction](#the-true-header-vs-menu-widget)

### Part 5: Widget Development
13. [Widget Architecture](#part-5-widget-development)
14. [Script Include Pattern](#critical-script-include-pattern)
15. [Client Scripts](#client-scripts)
16. [Server Scripts](#server-scripts)

### Part 6: Widget Communication
17. [Event Broadcasting](#part-6-widget-communication)
18. [Embedded Widgets](#embedded-widgets)
19. [Angular Services](#angular-service-providers)
20. [URL Parameters](#url-parameters)
21. [Session Data](#session-data)

### Part 7: Pagination
22. [Pagination Best Practices](#part-7-pagination)
23. [Multi-Fallback Solution](#the-multi-fallback-solution)

### Part 8: Troubleshooting
24. [Common Issues & Fixes](#part-8-troubleshooting)
25. [Infinite Digest Loop Prevention](#infinite-digest-loop-prevention)
26. [Diagnostic Scripts](#diagnostic-scripts)

### Part 9: Quick Reference
27. [Tables Reference](#part-9-quick-reference)
28. [Common Methods](#common-methods)

---

# Part 1: Complete Data Model & Schema

## Primary Tables

| Table Name | Label | Purpose |
|------------|-------|---------|
| `sp_portal` | Portal | Root configuration record defining URL suffix, theme, homepage, and global settings |
| `sp_page` | Page | Individual portal pages identified by `id` parameter in URL |
| `sp_container` | Container | Divides pages into sections; holds rows |
| `sp_row` | Row | Subdivides containers using Bootstrap 12-column grid |
| `sp_column` | Column | Individual columns within rows; holds widget instances |
| `sp_widget` | Widget | Reusable component containing HTML, CSS, client/server scripts |
| `sp_instance` | Instance | Specific placement of a widget on a page with configuration options |
| `sp_theme` | Theme | Defines portal styling, branding, header/footer widgets |

## Instance Extension Tables

| Table Name | Label | Purpose |
|------------|-------|---------|
| `sp_instance_carousel` | Instance of Carousel | Configuration for carousel widgets |
| `sp_instance_link` | Instance with Link | Configuration for link-based widgets (Icon Link, etc.) |
| `sp_instance_menu` | Instance with Menu | Configuration for menu widgets; has Menu Items related list |
| `sp_instance_table` | Instance with Table | Configuration for Data Table and Count widgets |
| `sp_instance_vlist` | Instance of Simple List | Configuration for Simple List widgets |

## Theme-Related Tables

| Table Name | Label | Purpose |
|------------|-------|---------|
| `sp_header_footer` | Header/Footer | Container record linking a widget to serve as header or footer |
| `sp_css` | SP CSS | Reusable CSS stylesheets |
| `sp_js_include` | JS Include | JavaScript file references (URL or UI Script) |
| `m2m_sp_theme_css` | Theme CSS Include | Many-to-many: Theme ↔ CSS stylesheets |
| `m2m_sp_theme_js` | Theme JS Include | Many-to-many: Theme ↔ JS includes |

## Supporting Tables

| Table Name | Label | Purpose |
|------------|-------|---------|
| `sp_angular_provider` | Angular Provider | Custom Angular directives, services, and factories |
| `sp_dependency` | Widget Dependency | JS/CSS dependency packages for widgets |
| `sp_search_group` | Search Group | Groups search sources for portal search |
| `sp_rectangle_menu_item` | Menu Item | Individual menu entries |
| `sp_carousel_slide` | Carousel Slide | Individual slides for carousel widgets |
| `sn_ng_template` | Angular ng-template | Reusable HTML templates for widgets |

---

## Schema Relationships Map

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE PORTAL COMPLETE SCHEMA MAP                             │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                      ┌──────────────┐
                                      │  sp_portal   │
                                      │   (Portal)   │
                                      └──────┬───────┘
                                             │
              ┌──────────────────────────────┼──────────────────────────────┐
              │                              │                              │
              ▼                              ▼                              ▼
       ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
       │   sp_theme   │              │   sp_page    │              │sp_instance_  │
       │   (Theme)    │              │    (Page)    │              │    menu      │
       └──────┬───────┘              └──────┬───────┘              │ (Main Menu)  │
              │                             │                      └──────────────┘
    ┌─────────┼─────────┐                   ▼
    │         │         │            ┌──────────────┐
    ▼         ▼         ▼            │ sp_container │
┌────────┐ ┌────────┐ ┌────────┐     │ (Container)  │
│header  │ │footer  │ │css/js  │     └──────┬───────┘
│   ↓    │ │   ↓    │ │includes│            │
│sp_hdr_ │ │sp_hdr_ │ │  m2m   │            ▼
│footer  │ │footer  │ └────────┘     ┌──────────────┐
└───┬────┘ └───┬────┘                │   sp_row     │
    │          │                     │    (Row)     │
    ▼          ▼                     └──────┬───────┘
┌──────────────────┐                        │
│    sp_widget     │                        ▼
│  (Header/Footer  │                 ┌──────────────┐
│     Widget)      │                 │  sp_column   │
└──────────────────┘                 │   (Column)   │
                                     └──────┬───────┘
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │ sp_instance  │◄────── extends ────┐
                                     │  (Instance)  │                    │
                                     └──────┬───────┘                    │
                                            │                     ┌──────┴──────────┐
                                            │ references          │ sp_instance_*   │
                                            ▼                     │ extension tables│
                                     ┌──────────────┐             └─────────────────┘
                                     │  sp_widget   │
                                     │   (Widget)   │
                                     └──────┬───────┘
                                            │
              ┌─────────────────────────────┼─────────────────────────────┐
              │                             │                             │
              ▼                             ▼                             ▼
       ┌──────────────┐              ┌──────────────┐             ┌──────────────┐
       │sp_dependency │              │sp_angular_   │             │sn_ng_template│
       │(Dependencies)│              │  provider    │             │ (Templates)  │
       └──────────────┘              └──────────────┘             └──────────────┘


                              RELATIONSHIP LEGEND
    ───────────────────────────────────────────────────────────────
    │ = Contains / Parent-Child (one-to-many)
    ◄── = References / Foreign Key
    extends = Table Extension (inheritance)
    m2m = Many-to-Many Junction Table
```

### Reference Field Mappings

| Child Table | Field Name | Parent Table | Relationship |
|-------------|------------|--------------|--------------|
| sp_portal | theme | sp_theme | Many portals → One theme |
| sp_portal | homepage | sp_page | Many portals → One page |
| sp_portal | sp_rectangle_menu | sp_instance_menu | One portal → One menu |
| sp_theme | header | sp_header_footer | Many themes → One header |
| sp_theme | footer | sp_header_footer | Many themes → One footer |
| sp_header_footer | widget | sp_widget | One header/footer → One widget |
| sp_container | sp_page | sp_page | Many containers → One page |
| sp_row | sp_container | sp_container | Many rows → One container |
| sp_column | sp_row | sp_row | Many columns → One row |
| sp_instance | sp_column | sp_column | Many instances → One column |
| sp_instance | sp_widget | sp_widget | Many instances → One widget |

---

# Part 2: Page Layout System

## Layout Hierarchy

Service Portal pages use a nested hierarchy to create responsive layouts:

```
sp_page (Page)
    └── sp_container (Container)
            └── sp_row (Row)
                    └── sp_column (Column)
                            └── sp_instance (Widget Instance)
```

### Visual Representation

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              sp_page                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                         sp_container                                    │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │                         sp_row                                    │  │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │  │  │
│  │  │  │ sp_column   │  │ sp_column   │  │ sp_column   │               │  │  │
│  │  │  │  (col-4)    │  │  (col-4)    │  │  (col-4)    │               │  │  │
│  │  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │               │  │  │
│  │  │  │ │sp_inst. │ │  │ │sp_inst. │ │  │ │sp_inst. │ │               │  │  │
│  │  │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │               │  │  │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘               │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Important:** Pages are NOT tied to specific portals—any portal can display any page.

---

## Bootstrap v3 Grid System

### The 12-Column Grid

Bootstrap v3 divides each row into **12 equal-width grid columns**. Service Portal columns specify how many of these 12 units to span.

```
|  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  | 10  | 11  | 12  |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
```

**Column Span Examples:**
- `size_md=12` → Full width (12/12 = 100%)
- `size_md=6` → Half width (6/12 = 50%)
- `size_md=4` → One-third width (4/12 = 33.33%)
- `size_md=3` → One-quarter width (3/12 = 25%)

### Breakpoint Definitions

| Breakpoint | Field | Class Prefix | Screen Width | Typical Devices |
|------------|-------|--------------|--------------|-----------------|
| Extra Small | `size_xs` | `col-xs-` | < 768px | Phones |
| Small | `size_sm` | `col-sm-` | ≥ 768px | Tablets |
| Medium | `size_md` | `col-md-` | ≥ 992px | Desktops |
| Large | `size_lg` | `col-lg-` | ≥ 1200px | Large desktops |

### Responsive Class Inheritance

Bootstrap v3 classes **scale up**. A class set for a smaller breakpoint applies to all larger breakpoints unless overridden.

```javascript
// sp_column record:
{
    size_xs: 12,    // Full width on phones
    size_sm: 6,     // Half width on tablets
    size_md: 4,     // One-third on desktops
    size_lg: 3      // One-quarter on large screens
}

// Generates CSS classes:
// class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
```

### Column Sum Rule

**CRITICAL:** Columns in a single row should sum to exactly 12 for optimal layout.

```
Valid:   col-4 + col-4 + col-4 = 12 ✓
Valid:   col-8 + col-4 = 12 ✓
Valid:   col-3 + col-6 + col-3 = 12 ✓
Invalid: col-5 + col-5 + col-5 = 15 ✗ (wraps to next line)
```

---

## Creating Page Layouts Programmatically

### Complete Layout Creation Script

```javascript
/**
 * Creates a Service Portal page with a complete layout
 * @param {string} pageId - Unique page identifier
 * @param {string} pageTitle - Display title
 * @param {array} layoutConfig - Array of row configurations
 * @returns {string} - sys_id of created page
 */
function createPageWithLayout(pageId, pageTitle, layoutConfig) {
    
    // Step 1: Create Page
    var page = new GlideRecord('sp_page');
    page.initialize();
    page.setValue('id', pageId);
    page.setValue('title', pageTitle);
    page.setValue('public', false);
    var pageSysId = page.insert();
    
    // Step 2: Create Container
    var container = new GlideRecord('sp_container');
    container.initialize();
    container.setValue('sp_page', pageSysId);
    container.setValue('order', 100);
    container.setValue('container_class_name', 'container');
    var containerSysId = container.insert();
    
    // Step 3: Create Rows and Columns from config
    for (var r = 0; r < layoutConfig.length; r++) {
        var rowConfig = layoutConfig[r];
        
        var row = new GlideRecord('sp_row');
        row.initialize();
        row.setValue('sp_container', containerSysId);
        row.setValue('order', (r + 1) * 100);
        var rowSysId = row.insert();
        
        // Create columns
        for (var c = 0; c < rowConfig.columns.length; c++) {
            var colConfig = rowConfig.columns[c];
            
            var column = new GlideRecord('sp_column');
            column.initialize();
            column.setValue('sp_row', rowSysId);
            column.setValue('order', (c + 1) * 100);
            column.setValue('size_xs', colConfig.size_xs || 12);
            column.setValue('size_sm', colConfig.size_sm || null);
            column.setValue('size_md', colConfig.size_md || null);
            column.setValue('size_lg', colConfig.size_lg || null);
            column.insert();
        }
    }
    
    return pageSysId;
}
```

---

## Common Layout Patterns

### Pattern 1: Full-Width Single Column
```javascript
var layout = [{
    columns: [{ size_xs: 12, size_md: 12 }]
}];
```

### Pattern 2: Two Equal Columns
```javascript
var layout = [{
    columns: [
        { size_xs: 12, size_md: 6 },
        { size_xs: 12, size_md: 6 }
    ]
}];
```

### Pattern 3: Three Equal Columns
```javascript
var layout = [{
    columns: [
        { size_xs: 12, size_sm: 6, size_md: 4 },
        { size_xs: 12, size_sm: 6, size_md: 4 },
        { size_xs: 12, size_sm: 12, size_md: 4 }
    ]
}];
```

### Pattern 4: Sidebar + Main Content
```javascript
var layout = [{
    columns: [
        { size_xs: 12, size_md: 3 },  // Sidebar
        { size_xs: 12, size_md: 9 }   // Main content
    ]
}];
```

### Pattern 5: Four Equal Columns
```javascript
var layout = [{
    columns: [
        { size_xs: 6, size_sm: 6, size_md: 3 },
        { size_xs: 6, size_sm: 6, size_md: 3 },
        { size_xs: 6, size_sm: 6, size_md: 3 },
        { size_xs: 6, size_sm: 6, size_md: 3 }
    ]
}];
```

---

# Part 3: Theme System

## Theme Architecture

A Service Portal Theme (`sp_theme`) is the central styling component that defines:

- **Visual Styling**: SCSS/CSS variables for colors, typography, spacing
- **Header/Footer Structure**: Widget references for header and footer components
- **External Resources**: CSS stylesheets and JavaScript files
- **Bootstrap Configuration**: Override Bootstrap 3.3.6 SASS variables

### Theme Hierarchy in Portal

```
sp_portal (Portal)
    │
    ├── theme ──────────────► sp_theme (Theme)
    │                              │
    │                              ├── header ──────► sp_header_footer
    │                              │                       │
    │                              │                       └── widget ──► sp_widget
    │                              │
    │                              ├── footer ──────► sp_header_footer
    │                              │                       │
    │                              │                       └── widget ──► sp_widget
    │                              │
    │                              ├── CSS Includes ─► [m2m] ──► sp_css
    │                              │
    │                              └── JS Includes ──► [m2m] ──► sp_js_include
    │
    └── css_variables (Portal-level overrides)
```

### sp_theme Table Fields

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `sys_id` | GUID | Unique identifier | Auto |
| `name` | String | Theme display name | Yes |
| `css_variables` | String (Large) | SCSS variable declarations ONLY | No |
| `header` | Reference | Header component (→ sp_header_footer) | No |
| `footer` | Reference | Footer component (→ sp_header_footer) | No |
| `navbar_fixed` | Boolean | Fix header to top of viewport | No |
| `footer_fixed` | Boolean | Fix footer to bottom of viewport | No |

---

## CSS/SCSS Processing Pipeline

### How Service Portal Compiles CSS

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      CSS COMPILATION PIPELINE                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

Browser Request: /sp_bootstrap.scss?portal_id=<sys_id>

Step 1: Gather SCSS Variables
┌─────────────────────────────────────────────────────────────────────────────────┐
│  sp_theme.css_variables        (Theme SCSS variables)                           │
│           +                                                                      │
│  sp_portal.css_variables       (Portal SCSS variables - overrides theme)        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
Step 2: Append CSS Includes
┌─────────────────────────────────────────────────────────────────────────────────┐
│  m2m_sp_theme_css records (ordered by 'order' field)                            │
│  └── sp_css.css content appended                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
Step 3: Compile with Bootstrap
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Bootstrap 3.3.6 SCSS + ServiceNow SCSS                                         │
│  Variables from Steps 1-2 override Bootstrap defaults                           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
Step 4: Return Compiled CSS
```

### CSS Priority Order (Lowest to Highest)

```
LOWEST PRIORITY (easily overridden)
         │
         ▼
┌─────────────────────────────────┐
│       Portal CSS Variables      │  ← sp_portal.css_variables
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│         Theme CSS               │  ← sp_theme CSS includes
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│         Page CSS                │  ← sp_page.css field
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│    Widget Instance CSS          │  ← sp_instance.css field
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│      Widget Class CSS           │  ← sp_widget.css (auto-scoped)
└─────────────────────────────────┘
         │
HIGHEST PRIORITY (overrides all above)
```

---

## SASS Variables Reference

### Bootstrap 3.3.6 Variables (Most Common)

#### Brand Colors
```scss
$brand-primary: #337ab7 !default;
$brand-success: #5cb85c !default;
$brand-info:    #5bc0de !default;
$brand-warning: #f0ad4e !default;
$brand-danger:  #d9534f !default;
```

#### Typography
```scss
$font-family-sans-serif: "Helvetica Neue", Helvetica, Arial, sans-serif !default;
$font-family-base:       $font-family-sans-serif !default;
$font-size-base:         14px !default;
$headings-font-family:   inherit !default;
$headings-font-weight:   500 !default;
```

#### Navbar
```scss
$navbar-height:                    50px !default;
$navbar-default-bg:                #f8f8f8 !default;
$navbar-inverse-bg:                #222 !default;
$navbar-inverse-link-color:        lighten(#777, 15%) !default;
$navbar-inverse-link-hover-color:  #fff !default;
```

### ServiceNow-Specific SASS Variables
```scss
$sp-tagline-color:           #999 !default;
$sp-navbar-divider-color:    #ccc !default;
$sp-nav-bg:                  #fff !default;
$sp-nav-link-color:          #485563 !default;
$sp-body-bg:                 #f5f5f5 !default;
$sp-homepage-bg:             #fff !default;
```

### Using the !default Flag

**CRITICAL:** Always use `!default` when declaring variables in widgets.

```scss
// In Theme CSS Variables (takes priority - NO !default)
$my-color: #ff0000;

// In Widget CSS (will be overridden by theme value)
$my-color: #0000ff !default;

.my-element {
    color: $my-color;  // Renders as #ff0000 (theme value)
}
```

---

# Part 4: Header & Menu System

## ⚠️ CRITICAL: Header vs Menu Understanding

**The "Header Menu" is formed by TWO separate components working together:**

| Component | Table | Linked Via | What It Actually Is |
|-----------|-------|------------|---------------------|
| **TRUE Header** | `sp_header_footer` | `sp_theme.header` | The actual `<header>` HTML element with Bootstrap navbar - the PARENT container |
| **Menu Widget** | `sp_instance_menu` | `sp_portal.sp_rectangle_menu` | Just the navigation menu COMPONENT that gets embedded inside the header |

### Architecture Diagram

```
                              ┌─────────────────┐
                              │    sp_portal    │
                              │    (Portal)     │
                              └────────┬────────┘
                                       │
               ┌───────────────────────┴───────────────────────────┐
               │                                                   │
               │ sp_portal.theme                                   │ sp_portal.sp_rectangle_menu
               ▼                                                   ▼
      ┌─────────────────┐                                ┌─────────────────────┐
      │    sp_theme     │                                │  sp_instance_menu   │
      │    (Theme)      │                                │  (Menu Instance)    │
      └────────┬────────┘                                └──────────┬──────────┘
               │                                                    │
               │ sp_theme.header                                    │ widget
               ▼                                                    ▼
      ┌─────────────────┐                                ┌─────────────────────┐
      │sp_header_footer │                                │     sp_widget       │
      │ (Header Record) │                                │   "Header Menu"     │
      └────────┬────────┘                                │                     │
               │                                         │  Renders menu items │
               │ widget                                  │  as <ul><li> links  │
               ▼                                         └──────────┬──────────┘
      ┌─────────────────┐                                           │
      │    sp_widget    │                                           │
      │ "Stock Header"  │◄──────────── embeds via ──────────────────┘
      │                 │              $sp.getWidgetFromInstance()
      │ THIS IS THE     │
      │ TRUE HEADER     │
      │                 │
      │ Creates:        │
      │ <header>        │
      │   <nav.navbar>  │
      │     [logo]      │
      │     [menu] ◄────│──── Menu widget rendered here
      │     [user]      │
      │   </nav>        │
      │ </header>       │
      └─────────────────┘
```

### DO NOT:
- ❌ Create header widget as a normal widget instance on a page
- ❌ Add header to sp_container/sp_row/sp_column
- ❌ Confuse menu widget (navigation component) with header widget (container)
- ❌ Forget to link BOTH theme AND menu to the portal

### MUST DO:
- ✅ Create header via `sp_header_footer` table
- ✅ Link header to theme via `sp_theme.header` field
- ✅ Create menu via `sp_instance_menu` table
- ✅ Link menu to portal via `sp_portal.sp_rectangle_menu` field
- ✅ Link theme to portal via `sp_portal.theme` field

---

## The TRUE Header vs Menu Widget

| Aspect | TRUE Header (`sp_header_footer`) | Menu Widget (`sp_instance_menu`) |
|--------|----------------------------------|----------------------------------|
| **Purpose** | The actual page header container | Navigation links component |
| **HTML Output** | `<header><nav class="navbar">...</nav></header>` | `<ul class="nav navbar-nav">...</ul>` |
| **Contains** | Logo, tagline, menu widget, user profile | Only navigation links/dropdowns |
| **Table** | `sp_header_footer` | `sp_instance_menu` |
| **Linked From** | `sp_theme.header` | `sp_portal.sp_rectangle_menu` |
| **Widget Example** | "Stock Header" | "Header Menu" |
| **Is Parent/Child** | **PARENT** - contains everything | **CHILD** - embedded inside header |

### The Embedding Mechanism

The TRUE Header widget embeds the Menu Widget using:

```javascript
// Inside Stock Header server script
(function() {
    var portalGr = $sp.getPortalRecord();
    var menuInstanceSysId = $sp.getValue('sp_rectangle_menu');
    
    // EMBED the menu widget
    data.menu = $sp.getWidgetFromInstance(menuInstanceSysId);
    
    data.logo = portalGr.getDisplayValue('logo');
    data.title = portalGr.getDisplayValue('title');
})();
```

And in the template:
```html
<div class="collapse navbar-collapse">
    <sp-widget widget="data.menu"></sp-widget>
</div>
```

---

## Creating the Menu

### sp_rectangle_menu_item (Menu Item) Fields

| Field Name | Type | Description |
|------------|------|-------------|
| `label` | String | Display text |
| `sp_rectangle_menu` | Reference | Parent menu instance |
| `parent` | Reference | Parent menu item (for submenus) |
| `page` | Reference | Target page (if Type = "page") |
| `url` | String | Target URL (if Type = "url") |
| `type` | Choice | page, url, sc, kb, filtered, scripted |
| `order` | Integer | Display order |
| `roles` | String | Comma-separated roles for visibility |
| `condition` | Script | Visibility condition script |

### Menu Item Type Values

| Type | API Value | Use Case |
|------|-----------|----------|
| Page | `page` | Link to sp_page |
| URL | `url` | External or custom URL |
| Service Catalog | `sc` | Link to catalog homepage |
| Catalog Category | `sc_category` | Link to specific category |
| Knowledge Base | `kb` | Link to KB homepage |
| KB Article | `kb_article` | Link to specific article |
| Filtered List | `filtered` | Dynamic list based on filter |
| Scripted List | `scripted` | Script-generated menu items |

---

# Part 5: Widget Development

## Widget Architecture

Widgets consist of these components:

| Component | Location | Purpose |
|-----------|----------|---------|
| HTML Template | `template` field | AngularJS HTML markup |
| Client Script | `client_script` field | AngularJS controller logic |
| Server Script | `script` field | Server-side orchestration (calls Script Includes) |
| CSS/SCSS | `css` field | Widget-specific styling (auto-scoped) |
| Link Function | `link` field | Advanced DOM manipulation |
| Option Schema | `option_schema` field | JSON defining configurable options |

### Option Schema Definition

```json
{
  "title": {
    "displayName": "Title",
    "description": "Widget title text",
    "fieldType": "string",
    "default_value": "Default Title"
  },
  "table": {
    "displayName": "Table",
    "description": "Source table for data",
    "fieldType": "table_name"
  },
  "limit": {
    "displayName": "Record Limit",
    "description": "Maximum records to display",
    "fieldType": "integer",
    "default_value": 10
  }
}
```

---

## CRITICAL: Script Include Pattern

> **⚠️ BUILD AGENT INSTRUCTION: NEVER place GlideRecord scripts directly in widget Server Script fields.**

Widget Server Scripts should be lightweight orchestrators that call Script Include functions containing the actual GlideRecord logic.

### Why Script Includes Are Required

| Reason | Explanation |
|--------|-------------|
| **Reusability** | Functions can be called from multiple widgets, Business Rules, REST APIs |
| **Testability** | Script Includes can be unit tested independently |
| **Maintainability** | Centralizes business logic; changes propagate to all consumers |
| **Performance** | Script Includes are cached by the platform |
| **Separation of Concerns** | Widget scripts handle data flow; Script Includes handle business logic |

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CORRECT ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────┐         ┌──────────────────┐
  │  Widget Server   │         │  Widget Server   │
  │     Script       │         │     Script       │
  │  (Orchestrator)  │         │  (Orchestrator)  │
  └────────┬─────────┘         └────────┬─────────┘
           │                            │
           │  calls                     │  calls
           ▼                            ▼
  ┌─────────────────────────────────────────────────┐
  │              Script Include                      │
  │         (Contains GlideRecord Logic)            │
  │                                                  │
  │   - getActiveIncidents()                        │
  │   - createIncident(data)                        │
  │   - updateIncidentStatus(sysId, status)         │
  └─────────────────────────────────────────────────┘
```

### Step 1: Create the Script Include

```javascript
// Script Include Name: IncidentUtils
// Client Callable: false

var IncidentUtils = Class.create();
IncidentUtils.prototype = {
    
    initialize: function() {},
    
    getMyActiveIncidents: function(limit) {
        var incidents = [];
        var gr = new GlideRecord('incident');
        gr.addQuery('caller_id', gs.getUserID());
        gr.addQuery('active', true);
        gr.orderByDesc('sys_created_on');
        gr.setLimit(limit || 10);
        gr.query();
        
        while (gr.next()) {
            incidents.push({
                sys_id: gr.getUniqueValue(),
                number: gr.getValue('number'),
                short_description: gr.getValue('short_description'),
                state: gr.getDisplayValue('state')
            });
        }
        
        return incidents;
    },
    
    type: 'IncidentUtils'
};
```

### Step 2: Widget Server Script (Orchestrator Only)

```javascript
// Widget Server Script - KEEP IT SIMPLE
(function() {
    var incidentUtils = new IncidentUtils();
    var limit = options.limit || 10;
    data.incidents = incidentUtils.getMyActiveIncidents(limit);
    
    if (input && input.action === 'create') {
        data.createResult = incidentUtils.createIncident(input.incidentData);
    }
})();
```

### Step 3: Widget Client Script

```javascript
api.controller = function($scope, spUtil) {
    var c = this;
    
    c.incidents = c.data.incidents;
    
    c.createIncident = function() {
        c.server.get({
            action: 'create',
            incidentData: c.newIncident
        }).then(function(response) {
            if (response.data.createResult.success) {
                spUtil.addInfoMessage('Incident created');
                c.server.refresh();
            }
        });
    };
};
```

---

## Client Scripts

### Widget Client Script Structure

```javascript
api.controller = function($scope, spUtil, $http) {
    var c = this;
    
    // Initialize data from server
    c.data = $scope.data;
    
    // Client-side functions
    c.submitForm = function() {
        if (!c.data.name) {
            spUtil.addErrorMessage('Name is required');
            return;
        }
        
        c.server.update().then(function(response) {
            // CORRECT: Use $scope.data (automatically updated)
            c.data = $scope.data;
            spUtil.addInfoMessage('Success!');
        });
    };
};
```

### Client Script Best Practices

1. **Use `c` (controller) instead of `$scope`** for data binding
2. **Minimize watchers** - They impact performance
3. **Use one-time bindings** (`{{::value}}`) for static data
4. **Handle errors gracefully** with `.catch()` on promises
5. **Never call `$scope.$apply()`** - Service Portal handles digest cycles

---

## Server Scripts

### Server Script Structure

```javascript
// Widget Server Script - ORCHESTRATOR ONLY
(function() {
    // 1. Instantiate Script Includes
    var utils = new MyAppUtils();
    
    // 2. Read widget options
    var tableName = options.table || 'incident';
    var limit = options.limit || 10;
    
    // 3. Get URL parameters if needed
    var recordId = $sp.getParameter('sys_id');
    
    // 4. Call Script Include functions
    data.records = utils.getRecords(tableName, limit);
    
    // 5. Handle client input
    if (input && input.action === 'save') {
        data.saveResult = utils.saveRecord(input.record);
    }
    
    // 6. Set additional data
    data.canCreate = gs.hasRole('itil');
})();
```

### Available Server-Side Objects

| Object | Description |
|--------|-------------|
| `data` | Object passed to client |
| `input` | Data sent from client via `c.server.update()` |
| `options` | Widget instance options |
| `$sp` | Service Portal API object |
| `gs` | GlideSystem API |

---

# Part 6: Widget Communication

## Event Broadcasting ($rootScope.$broadcast / $on)

The most common method for widget-to-widget communication on the **same page**.

### Sender Widget

```javascript
api.controller = function($rootScope, $scope) {
    var c = this;
    
    $scope.sendStatus = function() {
        var payload = {
            status: 10,
            message: 'Task completed'
        };
        
        $rootScope.$broadcast('status_updated', payload);
    };
};
```

### Receiver Widget

```javascript
api.controller = function($rootScope, $scope) {
    var c = this;
    
    // Register the listener
    var deregister = $rootScope.$on('status_updated', function(event, data) {
        c.currentStatus = data.status;
    });
    
    // CRITICAL: Clean up listener on scope destroy to prevent memory leaks
    $scope.$on('$destroy', function() {
        deregister();
    });
};
```

### Common OOB Widget Events

| Event Name | Source Widget | Triggered When |
|------------|--------------|----------------|
| `sp.form.submitted` | Form Widget | Form is submitted |
| `$sp.list.click` | Simple List | Row is clicked |
| `data_table.click` | Data Table | Row is clicked |
| `spModel.gForm.initialized` | Form Widget | Form is initialized |

---

## Embedded Widgets

Use when you need **parent-to-child** communication.

### Server Script (Parent Widget)

```javascript
(function() {
    var widgetOptions = {
        table: 'incident',
        filter: 'active=true',
        limit: 10
    };
    
    data.embeddedWidget = $sp.getWidget('child-widget-id', widgetOptions);
})();
```

### HTML (Parent Widget)

```html
<div class="container">
    <sp-widget widget="c.data.embeddedWidget"></sp-widget>
</div>
```

---

## Angular Service Providers

The most **scalable and maintainable** approach for complex applications.

### Creating an Angular Provider

Navigate to **Service Portal > Angular Providers**:

```javascript
function sharedDataService($rootScope) {
    var service = {};
    var sharedData = {};
    
    service.setData = function(key, value) {
        sharedData[key] = value;
        $rootScope.$broadcast('sharedData.updated', { key: key, value: value });
    };
    
    service.getData = function(key) {
        return sharedData[key];
    };
    
    return service;
}
```

### Using in Widget

```javascript
api.controller = function($scope, sharedDataService) {
    var c = this;
    
    c.saveSelection = function(item) {
        sharedDataService.setData('selectedItem', item);
    };
    
    c.item = sharedDataService.getData('selectedItem');
};
```

---

## URL Parameters

Use for **cross-page communication** or bookmarkable state.

### Setting URL Parameters (Client)

```javascript
api.controller = function($scope, $location) {
    var c = this;
    
    c.selectRecord = function(sysId) {
        $location.search('sys_id', sysId);
    };
};
```

### Reading URL Parameters (Server)

```javascript
(function() {
    var sysId = $sp.getParameter('sys_id');
    var table = $sp.getParameter('table') || 'incident';
    
    if (sysId) {
        var gr = new GlideRecord(table);
        if (gr.get(sysId)) {
            data.record = {
                sys_id: gr.getUniqueValue(),
                number: gr.getValue('number')
            };
        }
    }
})();
```

---

## Session Data

Use for **persistent cross-page communication** within a user session.

### Storing Session Data (Server Script)

```javascript
(function() {
    // Store data in session
    if (input && input.action === 'savePreferences') {
        gs.getSession().putClientData('userPreferences', JSON.stringify({
            theme: input.theme,
            itemsPerPage: input.itemsPerPage
        }));
    }
    
    // Retrieve session data
    var prefsString = gs.getSession().getClientData('userPreferences');
    if (prefsString) {
        data.preferences = JSON.parse(prefsString);
    }
})();
```

---

# Part 7: Pagination

## The Pagination Problem

Service Portal widgets often experience pagination failures where:
- Clicking page 2, 3, etc. always returns page 1 data
- Server logs show `input.page` as null or undefined
- `chooseWindow()` GlideRecord method behaves inconsistently

## The Multi-Fallback Solution

### Client-Side Implementation

```javascript
api.controller = function($scope, $location) {
    var c = this;
    
    c.goToPage = function(page) {
        if (page < 1 || page > c.totalPages || page === c.currentPage || c.isLoading) {
            return;
        }
        
        c.isLoading = true;
        
        // CRITICAL: Triple-redundancy approach
        
        // Method 1: Store in data object before server call (most reliable)
        $scope.data.requested_page = page;
        
        // Method 2: Update URL parameter for state persistence
        $location.search('p', page);
        
        // Method 3: Include in request data (traditional approach)
        var requestData = {
            page: page,
            _t: Date.now() // Force cache refresh
        };
        
        $scope.server.update(requestData).then(function() {
            // CORRECT: Use $scope.data (automatically updated)
            c.items = angular.copy($scope.data.items || []);
            c.currentPage = $scope.data.current_page || page;
            c.totalPages = $scope.data.total_pages || 1;
            c.isLoading = false;
        });
    };
};
```

### Server-Side Implementation

```javascript
(function() {
    var itemsPerPage = parseInt(options.items_per_page) || 9;
    
    // Triple-fallback page parameter retrieval
    var requestedPage = 1;
    
    // Method 1: From stored data.requested_page (most reliable)
    if (data.requested_page && !isNaN(parseInt(data.requested_page))) {
        requestedPage = parseInt(data.requested_page);
    }
    // Method 2: From input.page (traditional method)
    else if (input && input.page !== undefined && input.page !== null) {
        var parsed = parseInt(String(input.page), 10);
        if (!isNaN(parsed) && parsed >= 1) {
            requestedPage = parsed;
        }
    }
    // Method 3: From URL parameter (fallback)
    else {
        var urlPage = parseInt($sp.getParameter('p')) || 1;
        if (urlPage > 1) {
            requestedPage = urlPage;
        }
    }
    
    data.page = requestedPage;
    
    // Get total count
    var countGr = new GlideRecord('your_table');
    countGr.query();
    data.total_count = countGr.getRowCount();
    data.total_pages = Math.max(1, Math.ceil(data.total_count / itemsPerPage));
    
    var offset = (data.page - 1) * itemsPerPage;
    
    // CRITICAL: Use MANUAL pagination instead of chooseWindow()
    var gr = new GlideRecord('your_table');
    gr.query();
    
    var results = [];
    var skipped = 0;
    var collected = 0;
    
    while (gr.next()) {
        if (skipped < offset) {
            skipped++;
            continue;
        }
        
        if (collected >= itemsPerPage) {
            break;
        }
        
        results.push({
            sys_id: gr.getUniqueValue(),
            name: gr.getValue('name')
        });
        collected++;
    }
    
    data.items = results;
    data.current_page = data.page;
})();
```

### Key Success Principles

1. **Triple Redundancy**: Never rely on a single method for critical parameters
2. **Manual Pagination Over chooseWindow()**: Manual skip-and-collect is more reliable
3. **Comprehensive Logging**: Log all parameter sources for debugging
4. **State Persistence**: Use URL parameters to maintain page state

---

# Part 8: Troubleshooting

## Infinite Digest Loop Prevention

### Symptom
- Console shows `[$rootScope:infdig]` errors
- Application becomes unresponsive
- "10 $digest() iterations reached. Aborting!" error

### Fix 1: Correct Response Structure

**❌ WRONG:**
```javascript
$scope.server.update({...}).then(function(response) {
    c.data = response.data.prompts; // WRONG
});
```

**✅ CORRECT:**
```javascript
$scope.server.update({...}).then(function(response) {
    c.data = $scope.data.prompts; // Use $scope.data
});
```

### Fix 2: Never Call $scope.$apply()

**❌ WRONG:**
```javascript
$scope.server.update({...}).then(function(response) {
    c.data = $scope.data.prompts;
    $scope.$apply(); // ❌ CAUSES INFINITE DIGEST LOOP
});
```

**✅ CORRECT:**
```javascript
$scope.server.update({...}).then(function(response) {
    c.data = $scope.data.prompts;
    // ✅ No $scope.$apply() needed
});
```

### Fix 3: Cache Template Function Results

**❌ WRONG:**
```javascript
c.getStars = function(rating) {
    var stars = [];
    for (var i = 0; i < rating; i++) {
        stars.push({ class: 'fa-star' });
    }
    return stars; // ❌ New array every time
};
```

**✅ CORRECT:**
```javascript
c.starCache = {};

c.getStars = function(rating) {
    var cacheKey = rating.toString();
    if (c.starCache[cacheKey]) {
        return c.starCache[cacheKey]; // ✅ Same object reference
    }
    
    var stars = [];
    for (var i = 0; i < rating; i++) {
        stars.push({ class: 'fa-star' });
    }
    c.starCache[cacheKey] = stars;
    return stars;
};
```

---

## Common Issues & Solutions

### Issue: Header Not Showing

**Checklist:**
1. ☐ Portal has Theme assigned (`sp_portal.theme`)
2. ☐ Theme has Header assigned (`sp_theme.header`)
3. ☐ Header record has Widget assigned (`sp_header_footer.widget`)
4. ☐ Widget exists and is active (`sp_widget`)
5. ☐ Portal has Main menu assigned (`sp_portal.sp_rectangle_menu`)

### Issue: Widget Data Not Loading

**Solutions:**
1. Test Script Include functions in Scripts - Background
2. Verify Script Include name matches exactly (case-sensitive)
3. Add `gs.info()` logging to trace data flow
4. Check ACLs allow current user to read the queried table

### Issue: CSS Not Applied

**Solutions:**
1. Check for SCSS syntax errors in widget CSS field
2. Use browser dev tools to inspect applied styles
3. Add `!default` flag to widget SCSS variables
4. Clear cache via `cache.do`

---

## Diagnostic Scripts

### Diagnose Portal Header

```javascript
function diagnosePortalHeader(portalUrlSuffix) {
    var result = [];
    
    var portal = new GlideRecord('sp_portal');
    portal.addQuery('url_suffix', portalUrlSuffix);
    portal.query();
    
    if (!portal.next()) {
        result.push('ERROR: Portal not found');
        return result;
    }
    result.push('OK: Portal found - ' + portal.getValue('title'));
    
    var themeSysId = portal.getValue('theme');
    if (!themeSysId) {
        result.push('ERROR: Portal has no theme assigned');
        return result;
    }
    
    var theme = new GlideRecord('sp_theme');
    if (!theme.get(themeSysId)) {
        result.push('ERROR: Theme record not found');
        return result;
    }
    result.push('OK: Theme found - ' + theme.getValue('name'));
    
    var headerSysId = theme.getValue('header');
    if (!headerSysId) {
        result.push('ERROR: Theme has no header assigned');
        return result;
    }
    
    var header = new GlideRecord('sp_header_footer');
    if (!header.get(headerSysId)) {
        result.push('ERROR: Header/Footer record not found');
        return result;
    }
    result.push('OK: Header record found - ' + header.getValue('name'));
    
    var headerWidgetSysId = header.getValue('widget');
    if (!headerWidgetSysId) {
        result.push('ERROR: Header record has no widget assigned');
        return result;
    }
    
    var headerWidget = new GlideRecord('sp_widget');
    if (!headerWidget.get(headerWidgetSysId)) {
        result.push('ERROR: Header widget not found');
        return result;
    }
    result.push('OK: Header widget found - ' + headerWidget.getValue('name'));
    
    return result;
}

// Usage
var diagnosis = diagnosePortalHeader('my_portal');
diagnosis.forEach(function(line) {
    gs.info(line);
});
```

### Diagnose Page Layout

```javascript
function diagnosePageLayout(pageId) {
    var page = new GlideRecord('sp_page');
    page.addQuery('id', pageId);
    page.query();
    
    if (!page.next()) {
        gs.error('Page not found: ' + pageId);
        return;
    }
    
    gs.info('Page: ' + page.getValue('title') + ' (sys_id: ' + page.getUniqueValue() + ')');
    
    var container = new GlideRecord('sp_container');
    container.addQuery('sp_page', page.getUniqueValue());
    container.orderBy('order');
    container.query();
    
    while (container.next()) {
        gs.info('  Container: ' + container.getValue('name') + ' (order: ' + container.getValue('order') + ')');
        
        var row = new GlideRecord('sp_row');
        row.addQuery('sp_container', container.getUniqueValue());
        row.orderBy('order');
        row.query();
        
        while (row.next()) {
            gs.info('    Row: order=' + row.getValue('order'));
            
            var column = new GlideRecord('sp_column');
            column.addQuery('sp_row', row.getUniqueValue());
            column.orderBy('order');
            column.query();
            
            var totalMd = 0;
            while (column.next()) {
                var md = parseInt(column.getValue('size_md') || '0', 10);
                totalMd += md;
                gs.info('      Column: md=' + md);
            }
            
            if (totalMd !== 12 && totalMd > 0) {
                gs.warn('      ⚠️ Column sizes sum to ' + totalMd + ' (should be 12)');
            }
        }
    }
}
```

---

# Part 9: Quick Reference

## All Service Portal Tables

```
sp_portal              → Portal configuration
sp_theme               → Theme/branding
sp_header_footer       → Header/Footer containers
sp_page                → Pages
sp_container           → Page sections
sp_row                 → Row layouts
sp_column              → Columns in rows
sp_widget              → Widget definitions
sp_instance            → Widget placements
sp_instance_*          → Instance extensions
sp_css                 → CSS stylesheets
sp_js_include          → JavaScript includes
sp_dependency          → JS/CSS dependencies
sp_angular_provider    → Angular services/directives
sp_rectangle_menu_item → Menu items
sp_instance_menu       → Menu instances
m2m_sp_theme_css       → Theme ↔ CSS junction
m2m_sp_theme_js        → Theme ↔ JS junction
```

## Common $sp Methods

| Method | Description |
|--------|-------------|
| `$sp.getPortalRecord()` | Get current portal GlideRecord |
| `$sp.getParameter(name)` | Get URL parameter value |
| `$sp.getWidget(id, options)` | Get widget model |
| `$sp.getWidgetFromInstance(sysId)` | Get widget from instance |
| `$sp.canReadRecord(table, sysId)` | Check read access |
| `$sp.getValue(field)` | Get value from instance/portal |
| `$sp.getDisplayValue(field)` | Get display value from instance/portal |

## Common spUtil Methods (Client)

| Method | Description |
|--------|-------------|
| `spUtil.get(widgetId, options)` | Load widget dynamically |
| `spUtil.update($scope)` | Update scope |
| `spUtil.addErrorMessage(msg)` | Display error message |
| `spUtil.addInfoMessage(msg)` | Display info message |
| `spUtil.recordWatch($scope, table, filter, callback)` | Watch for record changes |

## OOB Widget IDs

| Widget Name | Widget ID |
|-------------|-----------|
| Stock Header | `widget-stock-header` |
| Header Menu | `widget-menu` |
| Sample Footer | `widget-footer` |
| Form | `widget-form` |
| Data Table | `widget-data-table` |
| Simple List | `widget-simple-list` |

## Bootstrap v3 Column Classes

```
col-xs-*  → Extra small (< 768px)
col-sm-*  → Small (≥ 768px)
col-md-*  → Medium (≥ 992px)
col-lg-*  → Large (≥ 1200px)
```

## Order Field Convention

Use multiples of 100 for order fields:
```
First item:  order = 100
Second item: order = 200
Third item:  order = 300
```

## Script Include Naming Convention

```
[AppName]Utils      → General utility functions
[AppName]UtilsAjax  → Client-callable Ajax version
[TableName]Utils    → Table-specific operations
[Feature]Service    → Service-oriented logic
```

---

## Build Agent Checklist

When creating Service Portal components:

### Portal Setup
- [ ] Create `sp_portal` with url_suffix, title, theme
- [ ] Link homepage via `sp_portal.homepage`
- [ ] Link main menu via `sp_portal.sp_rectangle_menu`

### Theme Setup
- [ ] Create `sp_theme` with css_variables (SCSS only)
- [ ] Create `sp_header_footer` for header widget wrapper
- [ ] Link header via `sp_theme.header`
- [ ] Link theme to portal via `sp_portal.theme`

### Page Layout Setup
- [ ] Create `sp_page` with unique id
- [ ] Create `sp_container` linked to page
- [ ] Create `sp_row` linked to container
- [ ] Create `sp_column` linked to row (sizes sum to 12)
- [ ] Create `sp_instance` linked to column and widget

### Widget Development
- [ ] Create Script Include for GlideRecord logic
- [ ] Keep Server Script under 20 lines (orchestrator only)
- [ ] Use `!default` flag in widget SCSS variables
- [ ] Always deregister `$rootScope.$on` listeners
- [ ] Never call `$scope.$apply()`
- [ ] Cache template function results

---

*Document Version: 2.0*  
*Target: ServiceNow Build Agent*  
*Framework: Service Portal with Bootstrap v3.3.6, AngularJS 1.5.1*
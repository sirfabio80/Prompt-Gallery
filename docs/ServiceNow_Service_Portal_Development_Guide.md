# ServiceNow Service Portal Complete Guide

**Version:** 2.0  
**Purpose:** Authoritative reference for Build Agent (Claude-4-Sonnet) to correctly create Service Portal components  
**Last Updated:** December 2025  
**Source:** Official ServiceNow Zurich Documentation

---

# PART 1: SERVICE PORTAL OVERVIEW AND CONCEPTS

## What is Service Portal?

Service Portal contains two parts: **a framework** and **a portal**. The framework is composed of a set of APIs, Angular services, directives, and tools that help to build portals. The portal is a group of pages linked by page IDs.

After you enter a URL, the framework uses the suffix and picks the appropriate portal to determine the theme and configurations. Then it loads the configured default portal homepage unless the URL has a specified ID.

## Configuration Overview

The following is the high-level workflow to configure a portal:

1. **Create a new portal or update a base system portal**
   - A portal is the engine that houses all the references to content for your site
   - The portal record defines the URL extension for a site, as well as things like the knowledge base, catalog, and homepage
   - You can also use the portal record to define the header menu and the portal branding

2. **Configure portal branding**
   - With the Branding Editor, you can configure the styles and theme of your portal in a view with real-time updates
   - More advanced users still have the option of creating CSS style sheets for the portal theme
   - Changes made in the Branding Editor or to specific components of the portal (such as a widget or a page container) override any customizations made to the theme

3. **Create new pages or update base system pages and configure widgets**
   - Pages are the centerpiece of the end-user experience
   - Page definitions not only control the layout of the content, they craft the experience for the user
   - Pages also help define mobile responsiveness, which is a key component in the user experience

4. **Configure search in a portal**
   - Search data displays within a widget on the search page
   - To make data searchable from a portal, create a search source that fetches data from a single table within your instance, from multiple tables, or from an external site

5. **Manage access to a portal**
   - Manage who can access your portal by making pages public, configuring user logins and single sign-on, limiting page access by role, or enabling multi-factor authentication

---

## Understanding Portal Styles

Pages are made up of containers, columns, rows, widgets, and widget instances. You can configure the CSS of each component, or use the CSS defined in theme and branding as global definitions for the portal. **If you do not define CSS in theme or branding, Bootstrap defaults are used.**

### CSS Hierarchy (Lowest to Highest Priority)

| Level | Source | Description |
|-------|--------|-------------|
| 1 | Bootstrap defaults | If no other CSS is defined, all elements use Bootstrap version 3.3.6 defaults |
| 2 | Branding editor / Portal CSS | CSS defined in the Branding Editor Theme Colors tab. Changes appear in the CSS variables field in sp_portal |
| 3 | Theme CSS | CSS defined in the CSS variables field in the Themes table [sp_theme]. Use the Theme CSS as much as possible |
| 4 | Page CSS | CSS defined in the Page Specific CSS field in the Pages table [sp_page]. Overwrites theme CSS |
| 5 | Container/Row/Column CSS | CSS classes and styles defined on layout elements |
| 6 | Widget CSS | CSS defined in the CSS field in the Widgets table [sp_widget]. Overwrites layout CSS |
| 7 | Widget instance CSS | CSS defined in the CSS field in the Instance table [sp_instance]. **Overwrites all other CSS** |

**Important:** Use the CSS variables field to define CSS variables only. Use CSS Includes to define CSS rules. As of the Madrid release, Sass and LESS can be used within CSS Includes.

---

## Embedded Frameworks

Service Portal provides these frameworks embedded and already loaded, which can be used to speed up development (especially branding) and reduce the amount of CSS to write in each entity:

### Bootstrap 3.3.6

Service Portal includes Bootstrap 3 with full SCSS/SASS variable support. The complete list of configurable variables is provided below.

**🔴 CRITICAL: SASS Variable Best Practices**

1. **SASS variables can ONLY be specified in the Theme** (`sp_theme.css_variables` field)
2. **Widgets MUST inherit values from Theme SASS variables** - do not hardcode CSS values in widgets
3. **Custom widgets requiring new SASS variables** must define them in their CSS field with `!default` suffix:
   ```scss
   $my-custom-color: #336699 !default;
   $my-custom-spacing: 16px !default;
   ```
4. **The `!default` flag** allows the Theme to override widget-defined variables if needed

This approach ensures:
- Centralized branding control through the Theme
- Consistent styling across all widgets
- Easy theme switching and rebranding
- Reduced CSS duplication

#### Bootstrap 3 SASS Variables Reference

##### Color System

```scss
// Grayscale
$white:    #fff !default;
$gray-100: #f8f9fa !default;
$gray-200: #e9ecef !default;
$gray-300: #dee2e6 !default;
$gray-400: #ced4da !default;
$gray-500: #adb5bd !default;
$gray-600: #6c757d !default;
$gray-700: #495057 !default;
$gray-800: #343a40 !default;
$gray-900: #212529 !default;
$black:    #000 !default;

// Base Colors
$blue:    #0d6efd !default;
$indigo:  #6610f2 !default;
$purple:  #6f42c1 !default;
$pink:    #d63384 !default;
$red:     #dc3545 !default;
$orange:  #fd7e14 !default;
$yellow:  #ffc107 !default;
$green:   #198754 !default;
$teal:    #20c997 !default;
$cyan:    #0dcaf0 !default;

// Theme Colors
$primary:       $blue !default;
$secondary:     $gray-600 !default;
$success:       $green !default;
$info:          $cyan !default;
$warning:       $yellow !default;
$danger:        $red !default;
$light:         $gray-100 !default;
$dark:          $gray-900 !default;
```

##### Typography

```scss
// Font Families
$font-family-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif !default;
$font-family-monospace:  SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !default;

// Font Sizes
$font-size-base: 1rem !default;
$font-size-sm:   $font-size-base * .875 !default;
$font-size-lg:   $font-size-base * 1.25 !default;

// Font Weights
$font-weight-lighter: lighter !default;
$font-weight-light:   300 !default;
$font-weight-normal:  400 !default;
$font-weight-medium:  500 !default;
$font-weight-semibold: 600 !default;
$font-weight-bold:    700 !default;
$font-weight-bolder:  bolder !default;

// Line Heights
$line-height-base: 1.5 !default;
$line-height-sm:   1.25 !default;
$line-height-lg:   2 !default;

// Headings
$h1-font-size: $font-size-base * 2.5 !default;
$h2-font-size: $font-size-base * 2 !default;
$h3-font-size: $font-size-base * 1.75 !default;
$h4-font-size: $font-size-base * 1.5 !default;
$h5-font-size: $font-size-base * 1.25 !default;
$h6-font-size: $font-size-base !default;

$headings-margin-bottom: $spacer * .5 !default;
$headings-font-weight:   500 !default;
$headings-line-height:   1.2 !default;
$headings-color:         inherit !default;
```

##### Spacing

```scss
$spacer: 1rem !default;
$spacers: (
  0: 0,
  1: $spacer * .25,
  2: $spacer * .5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3,
) !default;
```

##### Grid System

```scss
// Breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
) !default;

// Container Max Widths
$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px,
  xxl: 1320px
) !default;

// Grid Configuration
$grid-columns:      12 !default;
$grid-gutter-width: 1.5rem !default;
$grid-row-columns:  6 !default;
```

##### Body

```scss
$body-color: $gray-900 !default;
$body-bg:    $white !default;
$body-secondary-color: rgba($body-color, .75) !default;
$body-secondary-bg:    $gray-200 !default;
$body-tertiary-color:  rgba($body-color, .5) !default;
$body-tertiary-bg:     $gray-100 !default;
```

##### Links

```scss
$link-color:            $primary !default;
$link-decoration:       underline !default;
$link-hover-decoration: null !default;
```

##### Borders

```scss
$border-width: 1px !default;
$border-style: solid !default;
$border-color: $gray-300 !default;

$border-radius:    .375rem !default;
$border-radius-sm: .25rem !default;
$border-radius-lg: .5rem !default;
$border-radius-xl: 1rem !default;
$border-radius-xxl: 2rem !default;
$border-radius-pill: 50rem !default;
```

##### Box Shadows

```scss
$box-shadow:       0 .5rem 1rem rgba($black, .15) !default;
$box-shadow-sm:    0 .125rem .25rem rgba($black, .075) !default;
$box-shadow-lg:    0 1rem 3rem rgba($black, .175) !default;
$box-shadow-inset: inset 0 1px 2px rgba($black, .075) !default;
```

##### Components

```scss
$component-active-color: $white !default;
$component-active-bg:    $primary !default;

// Focus Ring
$focus-ring-width:   .25rem !default;
$focus-ring-opacity: .25 !default;
$focus-ring-color:   rgba($primary, $focus-ring-opacity) !default;

// Transitions
$transition-base:     all .2s ease-in-out !default;
$transition-fade:     opacity .15s linear !default;
$transition-collapse: height .35s ease !default;
```

##### Buttons

```scss
$btn-padding-y:    .375rem !default;
$btn-padding-x:    .75rem !default;
$btn-font-size:    $font-size-base !default;
$btn-line-height:  $line-height-base !default;
$btn-border-width: 1px !default;
$btn-font-weight:  $font-weight-normal !default;

$btn-padding-y-sm: .25rem !default;
$btn-padding-x-sm: .5rem !default;
$btn-font-size-sm: $font-size-sm !default;

$btn-padding-y-lg: .5rem !default;
$btn-padding-x-lg: 1rem !default;
$btn-font-size-lg: $font-size-lg !default;

$btn-border-radius:    $border-radius !default;
$btn-border-radius-sm: $border-radius-sm !default;
$btn-border-radius-lg: $border-radius-lg !default;

$btn-disabled-opacity: .65 !default;
```

##### Forms

```scss
$input-padding-y: .375rem !default;
$input-padding-x: .75rem !default;
$input-font-size: $font-size-base !default;
$input-line-height: $line-height-base !default;

$input-bg: $body-bg !default;
$input-disabled-bg: $gray-200 !default;
$input-color: $body-color !default;
$input-border-color: $gray-300 !default;
$input-border-width: 1px !default;

$input-border-radius:    $border-radius !default;
$input-border-radius-sm: $border-radius-sm !default;
$input-border-radius-lg: $border-radius-lg !default;

$input-focus-border-color: tint-color($primary, 50%) !default;
$input-placeholder-color: $gray-600 !default;

$form-label-margin-bottom: .5rem !default;
$form-text-margin-top:     .25rem !default;
$form-text-color:          $gray-600 !default;
```

##### Navbar

```scss
$navbar-padding-y: $spacer * .5 !default;
$navbar-padding-x: null !default;

$navbar-brand-font-size: $font-size-lg !default;
$navbar-brand-margin-end: 1rem !default;

// Light Navbar
$navbar-light-color:          rgba($gray-900, .65) !default;
$navbar-light-hover-color:    rgba($gray-900, .8) !default;
$navbar-light-active-color:   rgba($gray-900, 1) !default;
$navbar-light-disabled-color: rgba($gray-900, .3) !default;

// Dark Navbar
$navbar-dark-color:          rgba($white, .55) !default;
$navbar-dark-hover-color:    rgba($white, .75) !default;
$navbar-dark-active-color:   $white !default;
$navbar-dark-disabled-color: rgba($white, .25) !default;
```

##### Cards

```scss
$card-spacer-y: $spacer !default;
$card-spacer-x: $spacer !default;
$card-title-spacer-y: $spacer * .5 !default;
$card-border-width: 1px !default;
$card-border-color: rgba($black, .125) !default;
$card-border-radius: $border-radius !default;
$card-cap-padding-y: $card-spacer-y * .5 !default;
$card-cap-padding-x: $card-spacer-x !default;
$card-cap-bg: rgba($gray-900, .03) !default;
$card-bg: $body-bg !default;
```

##### Modals

```scss
$modal-inner-padding: $spacer !default;
$modal-dialog-margin: .5rem !default;

$modal-content-bg: $body-bg !default;
$modal-content-border-color: rgba($black, .175) !default;
$modal-content-border-width: 1px !default;
$modal-content-border-radius: $border-radius-lg !default;

$modal-backdrop-bg: $black !default;
$modal-backdrop-opacity: .5 !default;

$modal-header-border-color: $gray-300 !default;
$modal-header-padding-y: $spacer !default;
$modal-header-padding-x: $spacer !default;

$modal-sm: 300px !default;
$modal-md: 500px !default;
$modal-lg: 800px !default;
$modal-xl: 1140px !default;
```

##### Alerts

```scss
$alert-padding-y: $spacer !default;
$alert-padding-x: $spacer !default;
$alert-margin-bottom: 1rem !default;
$alert-border-radius: $border-radius !default;
$alert-border-width: 1px !default;
```

##### Tables

```scss
$table-cell-padding-y: .5rem !default;
$table-cell-padding-x: .5rem !default;
$table-cell-padding-y-sm: .25rem !default;
$table-cell-padding-x-sm: .25rem !default;

$table-striped-bg-factor: .05 !default;
$table-active-bg-factor:  .1 !default;
$table-hover-bg-factor:   .075 !default;
$table-border-factor:     .2 !default;
```

##### Badges

```scss
$badge-font-size:   .75em !default;
$badge-font-weight: $font-weight-bold !default;
$badge-color:       $white !default;
$badge-padding-y:   .35em !default;
$badge-padding-x:   .65em !default;
$badge-border-radius: $border-radius !default;
```

##### Progress Bars

```scss
$progress-height: 1rem !default;
$progress-font-size: $font-size-base * .75 !default;
$progress-bg: $gray-200 !default;
$progress-border-radius: $border-radius !default;
$progress-bar-color: $white !default;
$progress-bar-bg: $primary !default;
```

##### List Groups

```scss
$list-group-color: $body-color !default;
$list-group-bg: $body-bg !default;
$list-group-border-color: $gray-300 !default;
$list-group-border-width: 1px !default;
$list-group-border-radius: $border-radius !default;

$list-group-item-padding-y: $spacer * .5 !default;
$list-group-item-padding-x: $spacer !default;

$list-group-hover-bg: $gray-100 !default;
$list-group-active-color: $component-active-color !default;
$list-group-active-bg: $component-active-bg !default;
```

##### Dropdowns

```scss
$dropdown-min-width: 10rem !default;
$dropdown-padding-x: 0 !default;
$dropdown-padding-y: .5rem !default;
$dropdown-spacer: .125rem !default;
$dropdown-font-size: $font-size-base !default;
$dropdown-color: $body-color !default;
$dropdown-bg: $body-bg !default;
$dropdown-border-color: rgba($black, .175) !default;
$dropdown-border-radius: $border-radius !default;
$dropdown-border-width: 1px !default;

$dropdown-link-color: $body-color !default;
$dropdown-link-hover-bg: $gray-100 !default;
$dropdown-link-active-color: $white !default;
$dropdown-link-active-bg: $primary !default;

$dropdown-item-padding-y: $spacer * .25 !default;
$dropdown-item-padding-x: $spacer !default;
```

##### Pagination

```scss
$pagination-padding-y: .375rem !default;
$pagination-padding-x: .75rem !default;
$pagination-font-size: $font-size-base !default;
$pagination-color: $link-color !default;
$pagination-bg: $body-bg !default;
$pagination-border-radius: $border-radius !default;
$pagination-border-width: 1px !default;
$pagination-border-color: $gray-300 !default;

$pagination-hover-color: $link-hover-color !default;
$pagination-hover-bg: $gray-200 !default;

$pagination-active-color: $component-active-color !default;
$pagination-active-bg: $component-active-bg !default;

$pagination-disabled-color: $gray-600 !default;
$pagination-disabled-bg: $gray-200 !default;
```

##### Tooltips

```scss
$tooltip-font-size: $font-size-sm !default;
$tooltip-max-width: 200px !default;
$tooltip-color: $body-bg !default;
$tooltip-bg: $gray-900 !default;
$tooltip-border-radius: $border-radius !default;
$tooltip-opacity: .9 !default;
$tooltip-padding-y: $spacer * .25 !default;
$tooltip-padding-x: $spacer * .5 !default;
```

##### Breadcrumbs

```scss
$breadcrumb-font-size: null !default;
$breadcrumb-padding-y: 0 !default;
$breadcrumb-padding-x: 0 !default;
$breadcrumb-item-padding-x: .5rem !default;
$breadcrumb-margin-bottom: 1rem !default;
$breadcrumb-divider-color: $gray-600 !default;
$breadcrumb-active-color: $gray-600 !default;
$breadcrumb-divider: quote("/") !default;
```

##### Z-Index Stack

```scss
$zindex-dropdown:          1000 !default;
$zindex-sticky:            1020 !default;
$zindex-fixed:             1030 !default;
$zindex-offcanvas-backdrop: 1040 !default;
$zindex-offcanvas:         1045 !default;
$zindex-modal-backdrop:    1050 !default;
$zindex-modal:             1055 !default;
$zindex-popover:           1070 !default;
$zindex-tooltip:           1080 !default;
$zindex-toast:             1090 !default;
```

### Font Awesome 4.7.0

Service Portal includes Font Awesome 4.7.0 for icons. Use icons directly in HTML templates:

```html
<!-- Basic usage -->
<i class="fa fa-home"></i>
<i class="fa fa-user"></i>
<i class="fa fa-cog"></i>

<!-- Sizing -->
<i class="fa fa-home fa-lg"></i>    <!-- 33% larger -->
<i class="fa fa-home fa-2x"></i>    <!-- 2x size -->
<i class="fa fa-home fa-3x"></i>    <!-- 3x size -->
<i class="fa fa-home fa-4x"></i>    <!-- 4x size -->
<i class="fa fa-home fa-5x"></i>    <!-- 5x size -->

<!-- Fixed width (useful in navigation) -->
<i class="fa fa-home fa-fw"></i>

<!-- Lists -->
<ul class="fa-ul">
  <li><i class="fa-li fa fa-check"></i>Item 1</li>
  <li><i class="fa-li fa fa-check"></i>Item 2</li>
</ul>

<!-- Spinning (for loaders) -->
<i class="fa fa-spinner fa-spin"></i>
<i class="fa fa-refresh fa-spin"></i>
<i class="fa fa-cog fa-spin"></i>

<!-- Rotations -->
<i class="fa fa-shield fa-rotate-90"></i>
<i class="fa fa-shield fa-rotate-180"></i>
<i class="fa fa-shield fa-rotate-270"></i>
<i class="fa fa-shield fa-flip-horizontal"></i>
<i class="fa fa-shield fa-flip-vertical"></i>

<!-- Stacked icons -->
<span class="fa-stack fa-lg">
  <i class="fa fa-circle fa-stack-2x"></i>
  <i class="fa fa-flag fa-stack-1x fa-inverse"></i>
</span>
```

#### Commonly Used Icons in Service Portal

| Category | Icons |
|----------|-------|
| Navigation | `fa-home`, `fa-arrow-left`, `fa-arrow-right`, `fa-bars`, `fa-chevron-down` |
| Actions | `fa-plus`, `fa-edit`, `fa-trash`, `fa-save`, `fa-download`, `fa-upload` |
| Status | `fa-check`, `fa-times`, `fa-exclamation-triangle`, `fa-info-circle` |
| Communication | `fa-envelope`, `fa-phone`, `fa-comment`, `fa-bell` |
| Users | `fa-user`, `fa-users`, `fa-user-circle` |
| Files | `fa-file`, `fa-file-text`, `fa-folder`, `fa-paperclip` |
| Settings | `fa-cog`, `fa-cogs`, `fa-wrench`, `fa-sliders` |
| Search | `fa-search`, `fa-filter` |
| Time | `fa-clock-o`, `fa-calendar`, `fa-history` |
| Misc | `fa-star`, `fa-heart`, `fa-bookmark`, `fa-tag` |

**Reference:** Full icon list at https://fontawesome.com/v4/icons/

---

## Understanding Pages

Use pages to organize content, ensure responsive mobile optimization, and design meaningful portal user experiences for your customers. A page houses containers and rows, which then contain widgets.

**Key concepts:**
- Pages are referenced using the page ID
- Pages can be referenced in more than one portal
- Use base system pages as templates

### Page Layout Structure

**Containers** are markup artifacts that are put on a page to contain the layouts that house the widgets. You can view containers in the Service Portal Designer (Service Portal > Service Portal Configuration > Designer).

**Layouts** define the structure of your page and the space available to drop widgets. The structure of the layout aligns with the Bootstrap grid template and always adds up to 12.

### Creating Pages

1. Navigate to All > Service Portal > Service Portal Configuration
2. Select Designer
3. Switch to the portal you want to design pages for
4. Select a page to customize or select "Add a new page"
5. Under Layouts, select Container and drag it onto the page
6. Drag one of the other layouts and drop it in the container
7. Use the filter to search for a widget, then drag the widget to the layout

---

## Understanding Widgets

Widgets are what define the content of your portal pages. You can use the base system widgets provided with Service Portal, clone and modify widgets, or develop custom widgets to fit your own needs.

### Base System Widgets

You can use the base system widgets included with Service Portal to get started configuring portal pages. **Base system widgets are read-only** so you can benefit from future updates. However, for each instance of a base system widget that you add to a page, you can configure the instance options available for that widget.

### Widget Instances

Each widget added to a page becomes its own instance. A widget instance is basically the application of a widget in a page. Because widgets are reusable and can appear on different pages to do different things, the manifestation of a widget on a page is referred to as a **Widget Instance**.

Widget instances get their logic from the base widget template, client scripts, server scripts, and depending on the widget, CSS.

**Key points:**
- Adding the same widget multiple times to the same page creates multiple instances
- All widget instances point to a widget - if you edit that widget, all of its widget instances receive that change
- You can also make changes specific to a widget instance, and only that widget instance is affected
- For widgets that do not contain any information by default, you must configure the options for their widget instances before they will appear on a portal page

### Widget Context Menu

From any rendered Service Portal page, you can **CTRL+right-click** a widget to see more configuration options in a context menu. You must have the admin or sp_admin role to see the widget context menu.

---

## Understanding Headers and Menus

Configuring a portal header with a menu involves several steps:

1. **Create a header and add it to a theme**
   - Until you add a theme with a header to a portal, the header menu does not display

2. **Create a main menu with menu items and assign it to the portal**
   - The main menu record is where you assign which navigation options appear in the header
   - For example, you can add a menu item that links to another page within your portal

**Result:** The main menu and header form a header menu when associated with a theme and a portal.

### Adding a Header or Footer

Use the theme to add a header or footer to your portal:

1. Navigate to All > Service Portal > Service Portal Configuration
2. Select Portal Tables > Themes and then select the theme
3. In the header or footer field, select the header or footer you want to use
4. If you are just getting started, you can reuse the base system **Stock Header** or **Sample Footer** widgets
5. (Optional) Select Fixed Header or Fixed Footer to lock it in place when users scroll

---

## Best Practices Summary

1. **Use Theme CSS as the primary styling location** - allows for more flexible evolution of your portal
2. **Base system widgets are read-only** - clone them if you need to make changes
3. **Pages can be referenced in more than one portal** - design reusable pages
4. **Configure widget instance options** - many widgets require configuration to display content
5. **Avoid reserved words in URL suffixes** - such as "portal" and "cms"
6. **Use Bootstrap grid system** - layouts always add up to 12 columns
7. **Test mobile responsiveness** - pages help define mobile responsiveness

---

# PART 2: COMPLETE DEVELOPMENT GUIDE FOR BUILD AGENT

## CRITICAL WARNINGS - READ FIRST

### ⛔ MOST COMMON FATAL ERRORS

Build Agent frequently makes these mistakes when creating Service Portals. **DO NOT** make these errors:

1. **HEADER vs MENU CONFUSION**
   - ❌ **WRONG:** Using "Header Menu" widget for `sp_header_footer.widget`
   - ✅ **CORRECT:** Using "Stock Header" widget (`widget-stock-header`) for `sp_header_footer.widget`
   - ❌ **WRONG:** Using "Stock Header" widget for `sp_instance_menu.widget`
   - ✅ **CORRECT:** Using "Header Menu" widget (`widget-menu`) for `sp_instance_menu.widget`

2. **PAGE LAYOUT HIERARCHY**
   - ❌ **WRONG:** Creating `sp_instance` records without `sp_column` parent
   - ✅ **CORRECT:** Always follow: `sp_page` → `sp_container` → `sp_row` → `sp_column` → `sp_instance`

3. **CSS INCLUDES**
   - ❌ **WRONG:** Creating `sp_css` records without linking to theme via `sp_css_include`
   - ✅ **CORRECT:** Create `sp_css` record THEN create `sp_css_include` linking CSS to theme

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Core Tables Reference](#2-core-tables-reference)
3. [Table Relationships](#3-table-relationships)
4. [Complete Portal Creation Workflow](#4-complete-portal-creation-workflow)
5. [Header and Menu Implementation](#5-header-and-menu-implementation)
6. [Page Layout Creation](#6-page-layout-creation)
7. [Theme and CSS Configuration](#7-theme-and-css-configuration)
8. [Widget Development](#8-widget-development)
9. [Field Reference Tables](#9-field-reference-tables)
10. [Validation Scripts](#10-validation-scripts)

---

## 1. Architecture Overview

### Component Hierarchy

```
Portal (sp_portal)
├── Theme (sp_theme)
│   ├── Header (sp_header_footer) ─── Widget: "Stock Header" (widget-stock-header)
│   ├── Footer (sp_header_footer) ─── Widget: Custom footer widget
│   └── CSS Includes (sp_css_include) ─── Style Sheet (sp_css)
│
├── Main Menu (sp_instance_menu) ─── Widget: "Header Menu" (widget-menu)
│   └── Menu Items (sp_rectangle_menu_item)
│
├── Homepage (sp_page)
├── Login Page (sp_page)
├── 404 Page (sp_page)
│
└── Pages (sp_page)
    └── Containers (sp_container)
        └── Rows (sp_row)
            └── Columns (sp_column)
                └── Widget Instances (sp_instance)
                    └── Widget Definition (sp_widget)
```

### URL Structure

```
https://[instance].service-now.com/[url_suffix]?id=[page_id]

Examples:
- https://myinstance.service-now.com/sp              (default homepage)
- https://myinstance.service-now.com/sp?id=catalog   (catalog page)
- https://myinstance.service-now.com/ess?id=home     (custom portal, home page)
```

---

## 2. Core Tables Reference

### Primary Tables

| Table Name | API Name | Purpose |
|------------|----------|---------|
| Portal | `sp_portal` | Main portal definition |
| Theme | `sp_theme` | Visual styling and structure |
| Header/Footer | `sp_header_footer` | Header/footer widget container |
| Menu Instance | `sp_instance_menu` | Navigation menu definition |
| Menu Item | `sp_rectangle_menu_item` | Individual navigation links |
| Page | `sp_page` | Portal page definition |
| Container | `sp_container` | Top-level page layout element |
| Row | `sp_row` | Horizontal row within container |
| Column | `sp_column` | Column within row (Bootstrap grid) |
| Widget Instance | `sp_instance` | Widget placed on page |
| Widget | `sp_widget` | Reusable widget definition |
| CSS Style Sheet | `sp_css` | CSS/SASS style definitions |
| CSS Include | `sp_css_include` | Links CSS to themes/pages |

---

## 3. Table Relationships

### 🔴 MANDATORY: Record Creation Order

**You MUST create records in this exact order to satisfy foreign key dependencies:**

```
1. sp_widget (if custom widgets needed)
2. sp_css (if custom CSS needed)
3. sp_header_footer (requires sp_widget reference)
4. sp_theme (requires sp_header_footer reference)
5. sp_css_include (requires sp_css AND sp_theme references)
6. sp_instance_menu (requires sp_widget reference)
7. sp_rectangle_menu_item (requires sp_instance_menu reference)
8. sp_page (independent, but needed before layout)
9. sp_container (requires sp_page reference)
10. sp_row (requires sp_container reference)
11. sp_column (requires sp_row reference)
12. sp_instance (requires sp_column AND sp_widget references)
13. sp_portal (requires sp_theme, sp_instance_menu, sp_page references)
```

### Complete Relationship Diagram

```
sp_portal
│
├── theme ──────────────────> sp_theme
│                               │
│                               ├── header ──────> sp_header_footer
│                               │                    └── widget ──> sp_widget (Stock Header)
│                               │
│                               ├── footer ──────> sp_header_footer
│                               │                    └── widget ──> sp_widget (Footer widget)
│                               │
│                               └── [css_includes related list] ──> sp_css_include
│                                                                     └── style_sheet ──> sp_css
│
├── sp_rectangle_menu ──────> sp_instance_menu
│                               │
│                               ├── widget ──────> sp_widget (Header Menu / widget-menu)
│                               │
│                               └── [Menu Items related list] ──> sp_rectangle_menu_item
│                                                                   ├── sp_rectangle_menu ──> sp_instance_menu
│                                                                   └── page ──> sp_page (if type=page)
│
├── homepage ───────────────> sp_page
├── login_page ─────────────> sp_page
└── 404_page ───────────────> sp_page

sp_page
│
└── [Containers related] ──> sp_container
                               │
                               └── sp_page ──────> sp_page (REQUIRED)
                                   │
                                   └── [Rows related] ──> sp_row
                                                            │
                                                            └── sp_container ──> sp_container (REQUIRED)
                                                                │
                                                                └── [Columns related] ──> sp_column
                                                                                            │
                                                                                            └── sp_row ──> sp_row (REQUIRED)
                                                                                                │
                                                                                                └── [Instances] ──> sp_instance
                                                                                                                     │
                                                                                                                     ├── sp_column ──> sp_column (REQUIRED)
                                                                                                                     └── widget ──> sp_widget (REQUIRED)
```

### 🔴 CRITICAL FIELD MAPPINGS

#### Portal to Theme to Header Chain

```javascript
// CORRECT CHAIN:
sp_portal.theme           → sp_theme.sys_id
sp_theme.header           → sp_header_footer.sys_id
sp_header_footer.widget   → sp_widget.sys_id (MUST BE "Stock Header" widget-stock-header)

// INCORRECT - NEVER DO THIS:
sp_header_footer.widget   → sp_widget where widget.id = "widget-menu" // WRONG!
```

#### Portal to Menu Chain

```javascript
// CORRECT CHAIN:
sp_portal.sp_rectangle_menu → sp_instance_menu.sys_id
sp_instance_menu.widget     → sp_widget.sys_id (MUST BE "Header Menu" widget-menu)
```

#### Page Layout Chain

```javascript
// CORRECT CHAIN:
sp_container.sp_page   → sp_page.sys_id
sp_row.sp_container    → sp_container.sys_id
sp_column.sp_row       → sp_row.sys_id
sp_instance.sp_column  → sp_column.sys_id
sp_instance.widget     → sp_widget.sys_id
```

---

## 4. Complete Portal Creation Workflow

### Step 1: Create Theme (`sp_theme`)

```javascript
var themeGr = new GlideRecord('sp_theme');
themeGr.initialize();
themeGr.setValue('name', 'My Custom Theme');
// css_variables: Leave empty or set based on design requirements
var themeSysId = themeGr.insert();
```

### Step 2: Create Header (`sp_header_footer`)

```javascript
// Find Stock Header widget sys_id
var stockHeaderGr = new GlideRecord('sp_widget');
stockHeaderGr.addQuery('id', 'widget-stock-header');
stockHeaderGr.query();
var stockHeaderSysId = '';
if (stockHeaderGr.next()) {
    stockHeaderSysId = stockHeaderGr.getUniqueValue();
}

// Create header record
var headerGr = new GlideRecord('sp_header_footer');
headerGr.initialize();
headerGr.setValue('name', 'My Portal Header');
headerGr.setValue('widget', stockHeaderSysId); // MUST be Stock Header widget
var headerSysId = headerGr.insert();
```

### Step 3: Link Header to Theme

```javascript
var themeUpdate = new GlideRecord('sp_theme');
if (themeUpdate.get(themeSysId)) {
    themeUpdate.setValue('header', headerSysId);
    themeUpdate.update();
}
```

### Step 4: Create Menu Instance (`sp_instance_menu`)

```javascript
// Find Header Menu widget sys_id
var menuWidgetGr = new GlideRecord('sp_widget');
menuWidgetGr.addQuery('id', 'widget-menu');
menuWidgetGr.query();
var menuWidgetSysId = '';
if (menuWidgetGr.next()) {
    menuWidgetSysId = menuWidgetGr.getUniqueValue();
}

// Create menu instance
var menuGr = new GlideRecord('sp_instance_menu');
menuGr.initialize();
menuGr.setValue('title', 'My Portal Main Menu');
menuGr.setValue('widget', menuWidgetSysId); // MUST be Header Menu widget
var menuSysId = menuGr.insert();
```

### Step 5: Create Menu Items (`sp_rectangle_menu_item`)

```javascript
// Create Home menu item
var homeItem = new GlideRecord('sp_rectangle_menu_item');
homeItem.initialize();
homeItem.setValue('label', 'Home');
homeItem.setValue('sp_rectangle_menu', menuSysId);
homeItem.setValue('order', 100);
homeItem.setValue('type', 'page');
homeItem.setValue('page', 'index'); // page ID, not sys_id
homeItem.insert();

// Create Service Catalog menu item
var catalogItem = new GlideRecord('sp_rectangle_menu_item');
catalogItem.initialize();
catalogItem.setValue('label', 'Service Catalog');
catalogItem.setValue('sp_rectangle_menu', menuSysId);
catalogItem.setValue('order', 200);
catalogItem.setValue('type', 'sc');
catalogItem.insert();
```

### Step 6: Create Page (`sp_page`)

```javascript
var pageGr = new GlideRecord('sp_page');
pageGr.initialize();
pageGr.setValue('title', 'Homepage');
pageGr.setValue('id', 'home'); // Unique page ID - used in URLs
pageGr.setValue('public', true);
var pageSysId = pageGr.insert();
```

### Step 7: Create Container (`sp_container`)

```javascript
var containerGr = new GlideRecord('sp_container');
containerGr.initialize();
containerGr.setValue('sp_page', pageSysId); // REQUIRED - links to page
containerGr.setValue('width', 'fixed'); // 'fixed' or 'fluid'
containerGr.setValue('order', 100);
var containerSysId = containerGr.insert();
```

### Step 8: Create Row (`sp_row`)

```javascript
var rowGr = new GlideRecord('sp_row');
rowGr.initialize();
rowGr.setValue('sp_container', containerSysId); // REQUIRED - links to container
rowGr.setValue('order', 100);
var rowSysId = rowGr.insert();
```

### Step 9: Create Column (`sp_column`)

```javascript
var columnGr = new GlideRecord('sp_column');
columnGr.initialize();
columnGr.setValue('sp_row', rowSysId); // REQUIRED - links to row
columnGr.setValue('order', 100);
columnGr.setValue('size', 12); // Bootstrap column size (1-12)
var columnSysId = columnGr.insert();
```

### Step 10: Create Widget Instance (`sp_instance`)

```javascript
// Get sys_id of widget to place
var widgetGr = new GlideRecord('sp_widget');
widgetGr.addQuery('id', 'YOUR_WIDGET_ID'); // Replace with actual widget ID
widgetGr.query();
var widgetSysId = '';
if (widgetGr.next()) {
    widgetSysId = widgetGr.getUniqueValue();
}

var instanceGr = new GlideRecord('sp_instance');
instanceGr.initialize();
instanceGr.setValue('sp_column', columnSysId); // REQUIRED - links to column
instanceGr.setValue('widget', widgetSysId); // REQUIRED - links to widget
instanceGr.setValue('order', 100);
var instanceSysId = instanceGr.insert();
```

### Step 11: Create Portal (`sp_portal`)

```javascript
var portalGr = new GlideRecord('sp_portal');
portalGr.initialize();
portalGr.setValue('title', 'My Employee Portal');
portalGr.setValue('url_suffix', 'emp'); // Portal URL: /emp
portalGr.setValue('theme', themeSysId);
portalGr.setValue('sp_rectangle_menu', menuSysId);
portalGr.setValue('homepage', pageSysId);
portalGr.insert();
```

---

## 5. Header and Menu Implementation

### Understanding the Distinction

**Headers and Menus are TWO SEPARATE components:**

| Component | Table | Widget Required | Linked Via | Purpose |
|-----------|-------|-----------------|------------|---------|
| Header | `sp_header_footer` | "Stock Header" (`widget-stock-header`) | `sp_theme.header` | Container structure (logo, branding, navbar) |
| Menu | `sp_instance_menu` | "Header Menu" (`widget-menu`) | `sp_portal.sp_rectangle_menu` | Navigation links |

### How They Work Together

At runtime, the Stock Header widget automatically embeds the portal's menu (from `sp_portal.sp_rectangle_menu`) to create the complete header with navigation.

### Out-of-Box Widget Reference

| Widget Name | Widget ID | Used For |
|-------------|-----------|----------|
| Stock Header | `widget-stock-header` | `sp_header_footer.widget` for headers |
| Header Menu | `widget-menu` | `sp_instance_menu.widget` for navigation |

---

## 6. Page Layout Creation

### Bootstrap Grid System

Service Portal uses **Bootstrap 3.3.6** with a 12-column grid:

| Size | Width % | Use Case |
|------|---------|----------|
| 12 | 100% | Full width |
| 6 | 50% | Half width (2-column layout) |
| 4 | 33.33% | Third width (3-column layout) |
| 3 | 25% | Quarter width (4-column layout) |

### Responsive Classes

Use the `class` field on `sp_column` for responsive layouts:

```
col-xs-12 col-md-6   /* Full on mobile, half on desktop */
col-xs-12 col-sm-6 col-md-4   /* Full on mobile, half on tablet, third on desktop */
```

---

## 7. Theme and CSS Configuration

### Creating CSS Records (`sp_css`)

```javascript
var cssGr = new GlideRecord('sp_css');
cssGr.initialize();
cssGr.setValue('name', 'Custom Portal Styles');
// css field: Leave empty - populate based on specific design requirements
var cssSysId = cssGr.insert();
```

### Creating CSS Include (`sp_css_include`)

```javascript
var cssIncludeGr = new GlideRecord('sp_css_include');
cssIncludeGr.initialize();
cssIncludeGr.setValue('name', 'Custom Portal Styles Include');
cssIncludeGr.setValue('source', 'Style Sheet');
cssIncludeGr.setValue('style_sheet', cssSysId);
var cssIncludeSysId = cssIncludeGr.insert();
```

### Common SASS Variables

These variables can be used in `sp_theme.css_variables` when styling is required:

```scss
/* Brand Colors */
$brand-primary: #0056D2;
$brand-success: #28a745;
$brand-info: #17a2b8;
$brand-warning: #ffc107;
$brand-danger: #dc3545;

/* Navbar */
$navbar-default-bg: #ffffff;
$navbar-default-color: #333333;

/* Text */
$text-color: #333333;
$text-muted: #777777;
```

---

## 8. Widget Development

### Creating a Widget (`sp_widget`)

```javascript
var widgetGr = new GlideRecord('sp_widget');
widgetGr.initialize();
widgetGr.setValue('name', 'My Custom Widget');
widgetGr.setValue('id', 'my-custom-widget'); // Lowercase, hyphens only
// template: Leave empty - populate based on requirements
// client_script: Leave empty - populate based on requirements
// script: Leave empty - populate based on requirements
// css: Leave empty - populate based on design requirements
// option_schema: Leave empty - define based on configuration needs
widgetGr.insert();
```

### Widget Fields Overview

| Field | Purpose |
|-------|---------|
| template | AngularJS HTML template |
| client_script | AngularJS controller (client-side JavaScript) |
| script | Server-side script (GlideRecord operations) |
| css | SASS/CSS styling |
| option_schema | JSON schema for configuration options |

---

## 9. Field Reference Tables

### sp_portal Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Title | title | String | Yes | Portal display name |
| URL suffix | url_suffix | String | Yes | URL path (/suffix) |
| Homepage | homepage | Reference | No | Default landing page |
| Login page | login_page | Reference | No | Custom login page |
| 404 page | 404_page | Reference | No | Custom error page |
| Main menu | sp_rectangle_menu | Reference | No | Navigation menu |
| Theme | theme | Reference | Yes | Portal theme |
| Logo | logo | Image | No | Header logo (max 200x46px) |
| CSS variables | css_variables | String | No | Portal-level SASS variables |

### sp_theme Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Name | name | String | Yes | Theme name |
| Header | header | Reference | No | Header widget container |
| Footer | footer | Reference | No | Footer widget container |
| Fixed header | fixed_header | Boolean | No | Lock header on scroll |
| CSS variables | css_variables | String | No | Theme SASS variables |

### sp_header_footer Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Name | name | String | Yes | Header/footer name |
| Widget | widget | Reference | Yes | **MUST be "Stock Header" for headers** |

### sp_instance_menu Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Title | title | String | Yes | Menu title |
| Widget | widget | Reference | Yes | **MUST be "Header Menu" (widget-menu)** |

### sp_rectangle_menu_item Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Label | label | String | Yes | Display text |
| Parent menu | sp_rectangle_menu | Reference | Yes | Parent menu |
| Order | order | Integer | Yes | Sort order (100, 200, 300...) |
| Type | type | Choice | Yes | Link type |
| Page | page | String | Conditional | Page ID (when type=page) |

**Menu Item Types:** `page`, `url`, `sc`, `sc_cat_item`, `sc_category`, `kb`, `kb_article`, `kb_category`

### sp_page Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Title | title | String | Yes | Page title |
| ID | id | String | Yes | Unique page identifier |
| Public | public | Boolean | No | No login required |

### sp_container Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Page | sp_page | Reference | **YES** | Parent page |
| Width | width | Choice | No | 'fixed' or 'fluid' |
| Order | order | Integer | No | Display order |

### sp_row Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Container | sp_container | Reference | **YES** | Parent container |
| Order | order | Integer | No | Display order |

### sp_column Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Row | sp_row | Reference | **YES** | Parent row |
| Size | size | Integer | No | Bootstrap column width (1-12) |
| Order | order | Integer | No | Display order |

### sp_instance Fields

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| Column | sp_column | Reference | **YES** | Parent column |
| Widget | widget | Reference | **YES** | Widget definition |
| Order | order | Integer | No | Display order |

---

## 10. Validation Scripts

### Portal Configuration Validator

Run in Scripts - Background to validate portal configuration:

```javascript
var portalSuffix = 'YOUR_PORTAL_SUFFIX'; // Change this

var portalGr = new GlideRecord('sp_portal');
portalGr.addQuery('url_suffix', portalSuffix);
portalGr.query();

if (!portalGr.next()) {
    gs.error('Portal "' + portalSuffix + '" not found');
} else {
    gs.info('Portal found: ' + portalGr.getValue('title'));
    
    // Check Theme
    if (!portalGr.getValue('theme')) {
        gs.error('ERROR: No theme assigned');
    } else {
        var theme = portalGr.theme.getRefRecord();
        gs.info('Theme: ' + theme.getValue('name'));
        
        // Check Header
        if (!theme.getValue('header')) {
            gs.error('ERROR: No header in theme');
        } else {
            var header = theme.header.getRefRecord();
            var headerWidget = header.widget.getRefRecord();
            
            if (headerWidget.getValue('id') === 'widget-menu') {
                gs.error('CRITICAL: Header using "Header Menu" widget - should use "Stock Header"');
            } else {
                gs.info('Header widget: ' + headerWidget.getValue('id'));
            }
        }
    }
    
    // Check Menu
    if (!portalGr.getValue('sp_rectangle_menu')) {
        gs.error('ERROR: No menu assigned');
    } else {
        var menu = portalGr.sp_rectangle_menu.getRefRecord();
        var menuWidget = menu.widget.getRefRecord();
        
        if (menuWidget.getValue('id') !== 'widget-menu') {
            gs.error('ERROR: Menu not using "Header Menu" widget');
        } else {
            gs.info('Menu widget correct: widget-menu');
        }
    }
}
```

---

## Quick Reference: Out-of-Box Widget IDs

| Widget Name | Widget ID | Purpose |
|-------------|-----------|---------|
| Stock Header | `widget-stock-header` | Headers |
| Header Menu | `widget-menu` | Navigation menus |
| Homepage Search | `homepage-search` | Search bar |
| Icon Link | `icon-link` | Category icons |
| Data Table | `data-table` | List displays |
| Form | `form` | Record forms |
| SC Catalog Item | `sc-cat-item` | Catalog items |
| KB Article View | `kb-article-view` | KB articles |

---

## Summary: The Three Critical Rules

1. **Header Widget Rule**: `sp_header_footer.widget` MUST reference "Stock Header" (`widget-stock-header`), NEVER "Header Menu"

2. **Menu Widget Rule**: `sp_instance_menu.widget` MUST reference "Header Menu" (`widget-menu`), NEVER "Stock Header"

3. **Page Layout Chain Rule**: Always create in order:
   ```
   sp_page → sp_container → sp_row → sp_column → sp_instance
   ```
   Each child MUST reference its parent via the required reference field.

---

**End of Guide**
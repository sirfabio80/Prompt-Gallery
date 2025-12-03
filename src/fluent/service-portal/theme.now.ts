import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Theme Header/Footer record - Creates the header widget wrapper
export const prompt_gallery_header_footer = Record({
    $id: Now.ID['prompt_gallery_header_footer'],
    table: 'sp_header_footer',
    data: {
        name: 'Prompt Gallery Header',
        widget: '5ef595c1cb12020000f8d856634c9c6e', // OOB Stock Header widget sys_id
    },
})

// Main Theme record for Prompt Gallery Portal
export const prompt_gallery_theme = Record({
    $id: Now.ID['prompt_gallery_theme'],
    table: 'sp_theme',
    data: {
        name: 'Prompt Gallery Theme',
        header: prompt_gallery_header_footer, // Link to our header/footer record
        footer: '', // No footer for now
        navbar_fixed: true, // Fix header to top of viewport
        footer_fixed: false,
        css_variables: `/* Prompt Gallery Portal Theme Variables */

/* Color Palette */
$brand-primary: #667eea !default;
$brand-success: #5cb85c !default;
$brand-info: #5bc0de !default;
$brand-warning: #f0ad4e !default;
$brand-danger: #d9534f !default;

/* Typography */
$font-family-sans-serif: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif !default;
$font-family-base: $font-family-sans-serif !default;
$font-size-base: 14px !default;
$headings-font-family: inherit !default;
$headings-font-weight: 600 !default;

/* Navbar/Header Styling */
$navbar-height: 60px !default;
$navbar-default-bg: #ffffff !default;
$navbar-default-border: #e3e6f0 !default;
$navbar-inverse-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !default;
$navbar-inverse-link-color: #ffffff !default;
$navbar-inverse-link-hover-color: #f8f9fa !default;
$navbar-inverse-brand-color: #ffffff !default;

/* ServiceNow Portal Specific Variables */
$sp-tagline-color: #6c757d !default;
$sp-navbar-divider-color: #e3e6f0 !default;
$sp-nav-bg: #ffffff !default;
$sp-nav-link-color: #495057 !default;
$sp-body-bg: #f8f9fa !default;
$sp-homepage-bg: #ffffff !default;

/* Custom Prompt Gallery Variables */
$prompt-card-border-radius: 12px !default;
$prompt-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !default;
$prompt-card-hover-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !default;
$prompt-primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !default;

/* Layout Variables */
$container-max-width: 1200px !default;
$grid-gutter-width: 30px !default;

/* Border and Radius */
$border-radius-base: 8px !default;
$border-radius-large: 12px !default;
$border-radius-small: 4px !default;`,
    },
})

// Many-to-many record linking the CSS Include to the Theme
export const prompt_gallery_theme_css_link = Record({
    $id: Now.ID['prompt_gallery_theme_css_link'],
    table: 'm2m_sp_theme_css',
    data: {
        sp_theme: prompt_gallery_theme, // Reference to our theme
        sp_css: 'cf9a939ed0d249959ae1d28d0decd45c', // sys_id of our CSS record from prompt-gallery-css.now.ts
        order: 100,
    },
})
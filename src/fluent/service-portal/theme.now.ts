import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Main Theme record for Prompt Gallery Portal
export const prompt_gallery_theme = Record({
    $id: Now.ID['prompt_gallery_theme'],
    table: 'sp_theme',
    data: {
        name: 'Prompt Gallery Theme',
        header: '511a7cb8fdbd49e3b452acd5fc2354fb', // Direct reference to our header sys_id
        footer: '', // No footer for now
        navbar_fixed: true, // Fix header to top of viewport
        footer_fixed: false,
        css_variables: `/* Prompt Gallery Portal Theme Variables */&#13;
&#13;
/* Color Palette */&#13;
$brand-primary: #667eea !default;&#13;
$brand-success: #5cb85c !default;&#13;
$brand-info: #5bc0de !default;&#13;
$brand-warning: #f0ad4e !default;&#13;
$brand-danger: #d9534f !default;&#13;
&#13;
/* Typography */&#13;
$font-family-sans-serif: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;&#13;
$font-family-base: $font-family-sans-serif !default;&#13;
$font-size-base: 14px !default;&#13;
$headings-font-family: inherit !default;&#13;
$headings-font-weight: 600 !default;&#13;
&#13;
/* Navbar/Header Styling */&#13;
$navbar-height: 60px !default;&#13;
$navbar-default-bg: #ffffff !default;&#13;
$navbar-default-border: #e3e6f0 !default;&#13;
$navbar-inverse-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !default;&#13;
$navbar-inverse-link-color: #ffffff !default;&#13;
$navbar-inverse-link-hover-color: #f8f9fa !default;&#13;
$navbar-inverse-brand-color: #ffffff !default;&#13;
&#13;
/* ServiceNow Portal Specific Variables */&#13;
$sp-tagline-color: #6c757d !default;&#13;
$sp-navbar-divider-color: #e3e6f0 !default;&#13;
$sp-nav-bg: #ffffff !default;&#13;
$sp-nav-link-color: #495057 !default;&#13;
$sp-body-bg: #f8f9fa !default;&#13;
$sp-homepage-bg: #ffffff !default;&#13;
&#13;
/* Custom Prompt Gallery Variables */&#13;
$prompt-card-border-radius: 12px !default;&#13;
$prompt-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !default;&#13;
$prompt-card-hover-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !default;&#13;
$prompt-primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !default;&#13;
&#13;
/* Layout Variables */&#13;
$container-max-width: 1200px !default;&#13;
$grid-gutter-width: 30px !default;&#13;
&#13;
/* Border and Radius */&#13;
$border-radius-base: 8px !default;&#13;
$border-radius-large: 12px !default;&#13;
$border-radius-small: 4px !default;`,
        turn_off_scss_compilation: 'false',
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

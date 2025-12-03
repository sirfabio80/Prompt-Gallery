import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Service Portal CSS record
export const prompt_gallery_sp_css = Record({
    $id: Now.ID['prompt_gallery_sp_css'],
    table: 'sp_css',
    data: {
        name: 'Prompt Gallery Custom CSS',
        css: `/* Import Inter font from Google Fonts */&#13;
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');&#13;
&#13;
/* Custom CSS for Prompt Gallery Service Portal */&#13;
&#13;
main[data-page-id="045f49ad101a476ba1ab40c67c564249"]{&#13;
background-color: #f8f9fa;&#13;
}&#13;
&#13;
/* Main gallery layout improvements */&#13;
.prompt-gallery-main {&#13;
    background: #f8f9fa;&#13;
    min-height: calc(100vh - 200px);&#13;
    padding: 20px 0;&#13;
}&#13;
&#13;
/* Global body styles for enhanced font rendering */&#13;
body {&#13;
    -webkit-font-smoothing: antialiased;&#13;
    -moz-osx-font-smoothing: grayscale;&#13;
    text-rendering: optimizeLegibility;&#13;
}&#13;
&#13;
/* Enhanced card design */&#13;
.prompt-card {&#13;
    background: white;&#13;
    border-radius: 12px;&#13;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);&#13;
    border: 1px solid #e3e6f0;&#13;
    transition: all 0.2s ease-in-out;&#13;
    margin-bottom: 20px;&#13;
    overflow: hidden;&#13;
}&#13;
&#13;
.prompt-card:hover {&#13;
    transform: translateY(-2px);&#13;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);&#13;
    border-color: #667eea;&#13;
}&#13;
&#13;
.prompt-card-header {&#13;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);&#13;
    color: white;&#13;
    padding: 16px 20px;&#13;
    border-bottom: none;&#13;
}&#13;
&#13;
.prompt-card-title {&#13;
    color: white !important;&#13;
    font-size: 18px;&#13;
    font-weight: 600;&#13;
    margin: 0;&#13;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);&#13;
}&#13;
&#13;
.prompt-card-body {&#13;
    padding: 20px;&#13;
}&#13;
&#13;
.prompt-description {&#13;
    color: #495057;&#13;
    line-height: 1.6;&#13;
    font-size: 14px;&#13;
    margin-bottom: 15px;&#13;
}&#13;
&#13;
.prompt-meta {&#13;
    display: flex;&#13;
    justify-content: space-between;&#13;
    align-items: center;&#13;
    margin-top: 15px;&#13;
    padding-top: 15px;&#13;
    border-top: 1px solid #e9ecef;&#13;
}&#13;
&#13;
.prompt-category {&#13;
    background: #e9ecef;&#13;
    color: #495057;&#13;
    padding: 4px 12px;&#13;
    border-radius: 20px;&#13;
    font-size: 12px;&#13;
    font-weight: 500;&#13;
    text-transform: uppercase;&#13;
    letter-spacing: 0.5px;&#13;
}&#13;
&#13;
.prompt-rating {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: 8px;&#13;
}&#13;
&#13;
.rating-stars {&#13;
    color: #ffc107;&#13;
    font-size: 14px;&#13;
}&#13;
&#13;
.rating-count {&#13;
    color: #6c757d;&#13;
    font-size: 12px;&#13;
}&#13;
&#13;
/* Search and filter improvements */&#13;
.search-section {&#13;
    background: white;&#13;
    border-radius: 8px;&#13;
    padding: 20px;&#13;
    margin-bottom: 30px;&#13;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);&#13;
}&#13;
&#13;
.search-input {&#13;
    border: 2px solid #e3e6f0;&#13;
    border-radius: 8px;&#13;
    padding: 12px 16px;&#13;
    font-size: 16px;&#13;
    transition: border-color 0.15s ease-in-out;&#13;
}&#13;
&#13;
.search-input:focus {&#13;
    border-color: #667eea;&#13;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);&#13;
}&#13;
&#13;
.filter-buttons {&#13;
    display: flex;&#13;
    gap: 10px;&#13;
    margin-top: 15px;&#13;
    flex-wrap: wrap;&#13;
}&#13;
&#13;
.filter-btn {&#13;
    background: #f8f9fa;&#13;
    border: 1px solid #dee2e6;&#13;
    color: #495057;&#13;
    padding: 8px 16px;&#13;
    border-radius: 20px;&#13;
    font-size: 14px;&#13;
    font-weight: 500;&#13;
    cursor: pointer;&#13;
    transition: all 0.2s ease-in-out;&#13;
}&#13;
&#13;
.filter-btn:hover {&#13;
    background: #e9ecef;&#13;
    border-color: #adb5bd;&#13;
}&#13;
&#13;
.filter-btn.active {&#13;
    background: #667eea;&#13;
    border-color: #667eea;&#13;
    color: white;&#13;
}&#13;
&#13;
/* Button styles */&#13;
.btn-primary-custom {&#13;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);&#13;
    border: none;&#13;
    color: white;&#13;
    padding: 10px 20px;&#13;
    border-radius: 6px;&#13;
    font-weight: 500;&#13;
    transition: all 0.2s ease-in-out;&#13;
}&#13;
&#13;
.btn-primary-custom:hover {&#13;
    transform: translateY(-1px);&#13;
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);&#13;
}&#13;
&#13;
.btn-secondary-custom {&#13;
    background: white;&#13;
    border: 1px solid #dee2e6;&#13;
    color: #495057;&#13;
    padding: 10px 20px;&#13;
    border-radius: 6px;&#13;
    font-weight: 500;&#13;
    transition: all 0.2s ease-in-out;&#13;
}&#13;
&#13;
.btn-secondary-custom:hover {&#13;
    background: #f8f9fa;&#13;
    border-color: #adb5bd;&#13;
}&#13;
&#13;
/* Loading states */&#13;
.loading-spinner {&#13;
    display: inline-block;&#13;
    width: 20px;&#13;
    height: 20px;&#13;
    border: 3px solid rgba(102, 126, 234, 0.3);&#13;
    border-radius: 50%;&#13;
    border-top-color: #667eea;&#13;
    animation: spin 1s ease-in-out infinite;&#13;
}&#13;
&#13;
@keyframes spin {&#13;
    to { transform: rotate(360deg); }&#13;
}&#13;
&#13;
/* Responsive design */&#13;
@media (max-width: 768px) {&#13;
    .prompt-gallery-main {&#13;
        padding: 15px 0;&#13;
    }&#13;
    &#13;
    .search-section {&#13;
        padding: 15px;&#13;
        margin-bottom: 20px;&#13;
    }&#13;
    &#13;
    .prompt-card {&#13;
        margin-bottom: 15px;&#13;
    }&#13;
    &#13;
    .prompt-card-header {&#13;
        padding: 12px 16px;&#13;
    }&#13;
    &#13;
    .prompt-card-body {&#13;
        padding: 16px;&#13;
    }&#13;
    &#13;
    .filter-buttons {&#13;
        gap: 8px;&#13;
    }&#13;
    &#13;
    .filter-btn {&#13;
        font-size: 12px;&#13;
        padding: 6px 12px;&#13;
    }&#13;
}&#13;
&#13;
/* Accessibility improvements */&#13;
.prompt-card:focus-within {&#13;
    outline: 2px solid #667eea;&#13;
    outline-offset: 2px;&#13;
}&#13;
&#13;
.btn-primary-custom:focus,&#13;
.btn-secondary-custom:focus,&#13;
.search-input:focus,&#13;
.filter-btn:focus {&#13;
    outline: 2px solid #667eea;&#13;
    outline-offset: 2px;&#13;
}&#13;
&#13;
/* Animation for cards appearing */&#13;
.prompt-card.fade-in {&#13;
    animation: fadeInUp 0.3s ease-out;&#13;
}&#13;
&#13;
@keyframes fadeInUp {&#13;
    from {&#13;
        opacity: 0;&#13;
        transform: translateY(10px);&#13;
    }&#13;
    to {&#13;
        opacity: 1;&#13;
        transform: translateY(0);&#13;
    }&#13;
}`,
        active: true,
        turn_off_scss_compilation: 'false',
    },
})

// CSS Include record that references the CSS
export const prompt_gallery_css_include = Record({
    $id: Now.ID['prompt_gallery_css_include'],
    table: 'sp_css_include',
    data: {
        name: 'Prompt Gallery CSS Include',
        css: 'cf9a939ed0d249959ae1d28d0decd45c', // MUST reference the sp_css record sys_id
        source: 'local',
        order: 100,
        active: true,
        lazy_load: 'false',
        sp_css: 'cf9a939ed0d249959ae1d28d0decd45c',
    },
})

// Many-to-many record linking the CSS Include to the Prompt Gallery Theme
export const theme_css_include_link = Record({
    $id: Now.ID['theme_css_include_link'],
    table: 'm2m_sp_theme_css_include',
    data: {
        sp_theme: '7ba139dce64c477abec81af8d4d142e6', // sys_id of Prompt Gallery Theme
        sp_css_include: prompt_gallery_css_include, // Reference to the CSS include
    },
})

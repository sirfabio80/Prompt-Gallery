import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { prompt_gallery_theme } from '../theme.now'

// Service Portal CSS record
export const prompt_gallery_sp_css = Record({
    $id: Now.ID['prompt_gallery_sp_css'],
    table: 'sp_css',
    data: {
        name: 'Prompt Gallery Custom CSS',
        css: `/* Import distinctive fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* Custom CSS for Prompt Gallery Service Portal */
main {
  padding-bottom: 70px;
}

main[data-page-id="045f49ad101a476ba1ab40c67c564249"]{
  background-color: #f8f9fa;
}


/* Main gallery layout improvements */
.prompt-gallery-main {
    background: #f8f9fa;
    min-height: calc(100vh - 200px);
    padding: 20px 0;
}

/* Global body styles for enhanced font rendering */
body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
}

/* Enhanced card design */
.prompt-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e3e6f0;
    transition: all 0.2s ease-in-out;
    margin-bottom: 20px;
    overflow: hidden;
}

.prompt-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #667eea;
}

.prompt-card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    border-bottom: none;
}

.prompt-card-title {
    color: white !important;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.prompt-card-body {
    padding: 20px;
}

.prompt-description {
    color: #495057;
    line-height: 1.6;
    font-size: 14px;
    margin-bottom: 15px;
}

.prompt-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e9ecef;
}

.prompt-category {
    background: #e9ecef;
    color: #495057;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.prompt-rating {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rating-stars {
    color: #ffc107;
    font-size: 14px;
}

.rating-count {
    color: #6c757d;
    font-size: 12px;
}

/* Search and filter improvements */
.search-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input {
    border: 2px solid #e3e6f0;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 16px;
    transition: border-color 0.15s ease-in-out;
}

.search-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.filter-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.filter-btn {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.filter-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

.filter-btn.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

/* Button styles */
.btn-primary-custom {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
}

.btn-primary-custom:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-secondary-custom {
    background: white;
    border: 1px solid #dee2e6;
    color: #495057;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
}

.btn-secondary-custom:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
}

/* Loading states */
.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(102, 126, 234, 0.3);
    border-radius: 50%;
    border-top-color: #667eea;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
    .prompt-gallery-main {
        padding: 15px 0;
    }
    
    .search-section {
        padding: 15px;
        margin-bottom: 20px;
    }
    
    .prompt-card {
        margin-bottom: 15px;
    }
    
    .prompt-card-header {
        padding: 12px 16px;
    }
    
    .prompt-card-body {
        padding: 16px;
    }
    
    .filter-buttons {
        gap: 8px;
    }
    
    .filter-btn {
        font-size: 12px;
        padding: 6px 12px;
    }
}

/* Accessibility improvements */
.prompt-card:focus-within {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}

.btn-primary-custom:focus,
.btn-secondary-custom:focus,
.search-input:focus,
.filter-btn:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}

/* Animation for cards appearing */
.prompt-card.fade-in {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
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
    table: 'm2m_sp_theme_css',
    data: {
        sp_theme: prompt_gallery_theme, // Reference to our theme
        sp_css_include: prompt_gallery_css_include, // Reference to the CSS include
    },
})

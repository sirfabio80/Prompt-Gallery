import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { prompt_gallery_theme } from './theme.now'
import { prompt_gallery_menu_instance } from './menu/prompt-gallery-menu.now'
import { prompt_gallery_sp_page } from './page-and-layout.now'

// Service Portal for Prompt Gallery - Rebuilding with specific sys_id
export const prompt_gallery_portal = Record({
    $id: Now.ID['prompt_gallery_portal'],
    table: 'sp_portal', // Specified portal sys_id
    data: {
        url_suffix: 'prompt-gallery',
        title: 'Prompt Gallery Portal',
        homepage: prompt_gallery_sp_page, // Reference to our main page
        theme: prompt_gallery_theme, // Link to our Prompt Gallery Theme
        sp_rectangle_menu: prompt_gallery_menu_instance, // Reference to our main menu instance
        logo: '08d4155a932dfe183321f2cbdd03d68a',
        logo_alt_text: 'Prompt Gallery',
        quick_start_config: '',
        login_page: '',
        hide_portal_name: false,
        enable_ais: false,
        enable_embeddables: true,
        rtl_enabled: false,
        default: false,
        inactive: false,
        kb_knowledge_page: '',
        kb_knowledge_base: '',
        sc_catalog_page: '',
        sc_category_page: '',
        notfound_page: '',
        enable_certificate_based_authentication: false,
        enable_favorites: false,
    },
})

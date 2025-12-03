import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { prompt_gallery_theme } from './theme.now'
import { prompt_gallery_menu_instance } from './menu/prompt-gallery-menu.now'

// Service Portal for Prompt Gallery - Rebuilding with specific sys_id
export const prompt_gallery_portal = Record({
    $id: Now.ID['prompt_gallery_portal'],
    table: 'sp_portal',
    forcedId: 'a68e0c3e750d4fab84c1b9772094d2ed', // Specified portal sys_id
    data: {
        url_suffix: 'prompt-gallery',
        title: 'Prompt Gallery Portal',
        homepage: '848eb10632fe45808e7c2da50b7ec266', // prompt_gallery page sys_id
        theme: prompt_gallery_theme, // Link to our Prompt Gallery Theme
        sp_rectangle_menu: prompt_gallery_menu_instance, // Reference to our main menu instance
        logo: '',
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
    },
})
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Service Portal for Prompt Gallery - Rebuilding with specific sys_id
export const prompt_gallery_portal = Record({
    $id: Now.ID['prompt_gallery_portal'],
    table: 'sp_portal',
    forcedId: 'a68e0c3e750d4fab84c1b9772094d2ed', // Specified portal sys_id
    data: {
        url_suffix: 'prompt-gallery',
        title: 'Prompt Gallery Portal',
        homepage: '848eb10632fe45808e7c2da50b7ec266', // prompt_gallery page sys_id
        theme: '', // Theme will be set separately - mentioned as already created
        sp_rectangle_menu: 'ab44670105424f4b9919c98587ac006e', // Main menu sys_id (already created)
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
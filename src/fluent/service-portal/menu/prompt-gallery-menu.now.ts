import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Service Portal Menu Instance - Links menu widget to menu items
export const prompt_gallery_menu_instance = Record({
    $id: Now.ID['prompt_gallery_menu_instance'],
    table: 'sp_instance_menu',
    data: {
        title: 'Prompt Gallery Main Menu',
        sp_widget: '5ef595c1cb12020000f8d856634c9c6e', // OOB Header Menu widget sys_id
        color: 'default',
        short_description: 'Main navigation menu for the Prompt Gallery portal',
        active: 'true',
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        glyph: 'empty',
        preserve_placeholder_size: 'false',
    },
})

// Menu Items for Prompt Gallery Navigation
export const menu_item_home = Record({
    $id: Now.ID['menu_item_home'],
    table: 'sp_rectangle_menu_item',
    data: {
        sp_rectangle_menu: prompt_gallery_menu_instance,
        label: 'Home',
        type: 'page',
        page: 'prompt_gallery', // Reference to our main page ID
        order: 100,
        glyph: 'home',
        roles: '',
        condition: '',
    },
})

export const menu_item_gallery = Record({
    $id: Now.ID['menu_item_gallery'],
    table: 'sp_rectangle_menu_item',
    data: {
        sp_rectangle_menu: prompt_gallery_menu_instance,
        label: 'Browse Gallery',
        type: 'page',
        page: 'prompt_gallery',
        order: 200,
        glyph: 'list',
        roles: '',
        condition: '',
    },
})

export const menu_item_categories = Record({
    $id: Now.ID['menu_item_categories'],
    table: 'sp_rectangle_menu_item',
    data: {
        sp_rectangle_menu: prompt_gallery_menu_instance,
        label: 'Categories',
        type: 'url',
        url: '?id=prompt_gallery#categories',
        order: 300,
        glyph: 'th-large',
        roles: '',
        condition: '',
    },
})

export const menu_item_favorites = Record({
    $id: Now.ID['menu_item_favorites'],
    table: 'sp_rectangle_menu_item',
    data: {
        sp_rectangle_menu: prompt_gallery_menu_instance,
        label: 'My Favorites',
        type: 'url',
        url: '?id=prompt_gallery#favorites',
        order: 400,
        glyph: 'star',
        roles: '',
        condition: '',
    },
})

export const menu_item_separator = Record({
    $id: Now.ID['menu_item_separator'],
    table: 'sp_rectangle_menu_item',
    data: {
        sp_rectangle_menu: prompt_gallery_menu_instance,
        label: '',
        type: 'separator',
        url: '',
        order: 500,
        glyph: '',
        roles: '',
        condition: '',
    },
})

export const menu_item_help = Record({
    $id: Now.ID['menu_item_help'],
    table: 'sp_rectangle_menu_item',
    data: {
        sp_rectangle_menu: prompt_gallery_menu_instance,
        label: 'Help & Documentation',
        type: 'kb',
        url: '',
        order: 600,
        glyph: 'question-circle',
        roles: '',
        condition: '',
    },
})

export const menu_item_admin = Record({
    $id: Now.ID['menu_item_admin'],
    table: 'sp_rectangle_menu_item',
    data: {
        sp_rectangle_menu: prompt_gallery_menu_instance,
        label: 'Admin Console',
        type: 'url',
        url: '/nav_to.do?uri=$x_snc_prompt_galle_prompt.list',
        order: 700,
        glyph: 'cog',
        roles: 'admin,x_snc_prompt_galle.admin', // Only for admins
        condition: '',
    },
})

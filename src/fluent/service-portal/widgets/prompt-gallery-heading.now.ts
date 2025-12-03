import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const prompt_gallery_heading_widget = Record({
    $id: Now.ID['prompt_gallery_heading_widget'],
    table: 'sp_widget',
    data: {
        id: 'prompt_gallery_heading',
        name: 'Prompt Gallery Heading',
        description: 'Beautiful heading widget for the Prompt Gallery page with configurable title and subtitle',
        template: Now.include('../../../client/service-portal/widgets/prompt-gallery-heading/template.html'),
        client_script: Now.include('../../../client/service-portal/widgets/prompt-gallery-heading/client.js'),
        script: `(function() {
  // Widget options with defaults
  data.title = options.title || 'Prompt Gallery';
  data.subtitle = options.subtitle || 'Discover and share AI prompts for enhanced productivity';
})()`,
        css: Now.include('../../../client/service-portal/widgets/prompt-gallery-heading/styles.css'),
        option_schema:
            '[{"name":"title","label":"Title","type":"string","default_value":"Prompt Gallery"}, {"name":"subtitle","label":"Subtitle","type":"string","default_value":"Discover and share AI prompts for enhanced productivity"}]',
        demo_data: '{"title": "Prompt Gallery", "subtitle": "Discover and share AI prompts for enhanced productivity"}',
        docs: 'Beautiful heading widget for the',
        public: false,
        has_preview: true,
        servicenow: false,
        data_table: 'sp_instance',
        controller_as: 'c',
        internal: false,
    },
})

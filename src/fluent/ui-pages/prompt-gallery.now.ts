import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import promptGalleryPage from '../../client/index.html';

export const prompt_gallery_page = UiPage({
  $id: Now.ID['prompt_gallery_ui_page'],
  endpoint: 'x_snc_prompt_galle_gallery.do',
  html: promptGalleryPage,
  direct: true
});
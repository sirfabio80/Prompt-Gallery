import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import debugPage from '../../client/debug.html';

export const prompt_gallery_debug_page = UiPage({
  $id: Now.ID['prompt-gallery-debug'],
  endpoint: 'x_snc_prompt_galle_debug.do',
  html: debugPage,
  direct: true
});
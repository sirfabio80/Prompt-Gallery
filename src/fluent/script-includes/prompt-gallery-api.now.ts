import '@servicenow/sdk/global';
import { ScriptInclude } from '@servicenow/sdk/core';

export const PromptGalleryAPI = ScriptInclude({
  $id: Now.ID['PromptGalleryAPI'],
  name: 'PromptGalleryAPI',
  script: Now.include('../../server/script-includes/prompt-gallery-api.js'),
  description: 'Server-side API for Prompt Gallery operations including prompt retrieval, rating, and usage tracking',
  apiName: 'x_snc_prompt_galle.PromptGalleryAPI',
  callerAccess: 'tracking',
  clientCallable: true,
  mobileCallable: true,
  sandboxCallable: false,
  accessibleFrom: 'public',
  active: true
});
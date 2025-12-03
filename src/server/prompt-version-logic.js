import { gs, GlideRecord } from '@servicenow/glide';

// Business logic for managing prompt versions
export function managePromptVersions(current, previous) {
  try {
    // Update latest version number on parent prompt
    if (current.operation() === 'insert') {
      updatePromptLatestVersion(current.getValue('prompt'));
    }
    
    // Ensure only one recommended version per prompt
    if (current.getValue('status') === 'recommended' && 
        (current.operation() === 'insert' || current.status.changes())) {
      clearOtherRecommendedVersions(current.getValue('prompt'), current.getUniqueValue());
    }
    
    // Update prompt usage counts when version usage changes
    if (current.operation() === 'update' && current.usage_count.changes()) {
      updatePromptTotalUsage(current.getValue('prompt'));
    }
    
  } catch (error) {
    gs.error('Error in managePromptVersions: ' + error.message);
  }
}

function updatePromptLatestVersion(promptSysId) {
  // Find the highest version number for this prompt
  const versionGR = new GlideRecord('x_snc_prompt_galle_prompt_version');
  versionGR.addQuery('prompt', promptSysId);
  versionGR.orderByDesc('version_number');
  versionGR.setLimit(1);
  versionGR.query();
  
  if (versionGR.next()) {
    const promptGR = new GlideRecord('x_snc_prompt_galle_prompt');
    if (promptGR.get(promptSysId)) {
      promptGR.setValue('latest_version_number', versionGR.getValue('version_number'));
      promptGR.update();
    }
  }
}

function clearOtherRecommendedVersions(promptSysId, currentVersionSysId) {
  const versionGR = new GlideRecord('x_snc_prompt_galle_prompt_version');
  versionGR.addQuery('prompt', promptSysId);
  versionGR.addQuery('status', 'recommended');
  versionGR.addQuery('sys_id', '!=', currentVersionSysId);
  versionGR.query();
  
  while (versionGR.next()) {
    versionGR.setValue('status', 'draft');
    versionGR.update();
  }
}

function updatePromptTotalUsage(promptSysId) {
  // Calculate total usage across all versions
  const versionGR = new GlideRecord('x_snc_prompt_galle_prompt_version');
  versionGR.addQuery('prompt', promptSysId);
  versionGR.query();
  
  let totalUsage = 0;
  while (versionGR.next()) {
    totalUsage += parseInt(versionGR.getValue('usage_count') || '0');
  }
  
  const promptGR = new GlideRecord('x_snc_prompt_galle_prompt');
  if (promptGR.get(promptSysId)) {
    promptGR.setValue('total_usage_count', totalUsage);
    promptGR.update();
  }
}
import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Sample Tags
export const tag_itsm = Record({
  $id: Now.ID['tag_itsm'],
  table: 'x_snc_prompt_galle_tag',
  data: {
    name: 'ITSM',
    tag_category: 'Domain',
    description: 'IT Service Management related prompts',
    is_active: true
  }
});

export const tag_discovery = Record({
  $id: Now.ID['tag_discovery'],
  table: 'x_snc_prompt_galle_tag',
  data: {
    name: 'Discovery',
    tag_category: 'Activity',
    description: 'Discovery and requirements gathering prompts',
    is_active: true
  }
});

export const tag_workshop = Record({
  $id: Now.ID['tag_workshop'],
  table: 'x_snc_prompt_galle_tag',
  data: {
    name: 'Workshop',
    tag_category: 'Activity',
    description: 'Workshop facilitation prompts',
    is_active: true
  }
});

export const tag_csm = Record({
  $id: Now.ID['tag_csm'],
  table: 'x_snc_prompt_galle_tag',
  data: {
    name: 'CSM',
    tag_category: 'Domain',
    description: 'Customer Service Management prompts',
    is_active: true
  }
});

export const tag_demo = Record({
  $id: Now.ID['tag_demo'],
  table: 'x_snc_prompt_galle_tag',
  data: {
    name: 'Demo',
    tag_category: 'Activity',
    description: 'Demo and presentation prompts',
    is_active: true
  }
});

export const tag_portal = Record({
  $id: Now.ID['tag_portal'],
  table: 'x_snc_prompt_galle_tag',
  data: {
    name: 'Portal',
    tag_category: 'Platform',
    description: 'ServiceNow Portal related prompts',
    is_active: true
  }
});

export const tag_retail = Record({
  $id: Now.ID['tag_retail'],
  table: 'x_snc_prompt_galle_tag',
  data: {
    name: 'Retail',
    tag_category: 'Industry',
    description: 'Retail industry specific prompts',
    is_active: true
  }
});

// Sample Engagements
export const engagement_acme_retail = Record({
  $id: Now.ID['engagement_acme'],
  table: 'x_snc_prompt_galle_engagement',
  data: {
    name: 'ACME Retail Implementation',
    customer_name: 'ACME Corporation',
    geo_region: 'amer',
    description: 'Full ServiceNow implementation for retail operations',
    start_date: '2024-01-15',
    end_date: '2024-06-30'
  }
});

export const engagement_global_bank = Record({
  $id: Now.ID['engagement_bank'],
  table: 'x_snc_prompt_galle_engagement',
  data: {
    name: 'Global Bank ITSM Upgrade',
    customer_name: 'Global Bank Inc',
    geo_region: 'emea',
    description: 'ITSM platform upgrade and optimization',
    start_date: '2024-03-01',
    end_date: '2024-09-15'
  }
});
import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Sample Categories for Prompt Gallery

export const category_discovery = Record({
  $id: Now.ID['category_discovery'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'discovery',
    display_name: 'Discovery',
    description: 'Prompts for conducting discovery workshops, gathering requirements, and understanding current state processes',
    icon: 'search',
    color: '#0073e6',
    sequence: 10,
    is_active: true,
    prompt_count: 0
  }
});

export const category_design = Record({
  $id: Now.ID['category_design'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'design',
    display_name: 'Design',
    description: 'Prompts for UI/UX design, form layouts, and user experience optimization',
    icon: 'paint-brush',
    color: '#8B5CF6',
    sequence: 20,
    is_active: true,
    prompt_count: 0
  }
});

export const category_solution_architecture = Record({
  $id: Now.ID['category_solution_architecture'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'solution_architecture',
    display_name: 'Solution Architecture',
    description: 'Prompts for designing comprehensive ServiceNow solutions and technical architecture',
    icon: 'sitemap',
    color: '#F59E0B',
    sequence: 30,
    is_active: true,
    prompt_count: 0
  }
});

export const category_implementation = Record({
  $id: Now.ID['category_implementation'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'implementation',
    display_name: 'Implementation',
    description: 'Prompts for implementation strategies, best practices, and project execution guidance',
    icon: 'cogs',
    color: '#10B981',
    sequence: 40,
    is_active: true,
    prompt_count: 0
  }
});

export const category_documentation = Record({
  $id: Now.ID['category_documentation'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'documentation',
    display_name: 'Documentation',
    description: 'Prompts for creating technical documentation, user guides, and process documentation',
    icon: 'file-text-o',
    color: '#6B7280',
    sequence: 50,
    is_active: true,
    prompt_count: 0
  }
});

export const category_communication = Record({
  $id: Now.ID['category_communication'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'communication',
    display_name: 'Communication / Email',
    description: 'Prompts for professional email templates, stakeholder communication, and project updates',
    icon: 'envelope-o',
    color: '#EC4899',
    sequence: 60,
    is_active: true,
    prompt_count: 0
  }
});

export const category_demo_script = Record({
  $id: Now.ID['category_demo_script'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'demo_script',
    display_name: 'Demo Script',
    description: 'Prompts for creating compelling demo scripts and presentation materials',
    icon: 'play-circle-o',
    color: '#EF4444',
    sequence: 70,
    is_active: true,
    prompt_count: 0
  }
});

export const category_internal_productivity = Record({
  $id: Now.ID['category_internal_productivity'],
  table: 'x_snc_prompt_galle_category',
  data: {
    name: 'internal_productivity',
    display_name: 'Internal Productivity',
    description: 'Prompts for optimizing team workflows, productivity, and internal processes',
    icon: 'line-chart',
    color: '#8B5A2B',
    sequence: 80,
    is_active: true,
    prompt_count: 0
  }
});
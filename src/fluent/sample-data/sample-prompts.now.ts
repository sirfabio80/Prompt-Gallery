import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';
import { category_discovery, category_design, category_solution_architecture, category_implementation, category_documentation, category_communication, category_demo_script, category_internal_productivity } from './categories.now.js';

// Sample Prompts with Full Content (27 prompts)

// 1. Discovery Workshop Facilitation Prompt
export const prompt_discovery_workshop = Record({
  $id: Now.ID['prompt_discovery_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Discovery Workshop Facilitator',
    short_description: 'Helps facilitate effective discovery workshops to gather requirements and understand current state processes',
    full_prompt: `<div>
<h3>🎯 Role & Context</h3>
<p>You are an <strong>experienced ServiceNow consultant</strong> facilitating a discovery workshop with deep expertise in business process analysis and requirements gathering.</p>

<h3>📋 Workshop Objective</h3>
<p>Create a comprehensive discovery workshop plan for <strong>{customer_name}</strong> in the <strong>{industry}</strong> industry, focusing on <strong>{process_area}</strong>.</p>

<h3>🗂️ Deliverables Required</h3>
<ol>
  <li><strong>Pre-workshop preparation checklist</strong> - Ensure all stakeholders and materials are ready</li>
  <li><strong>Detailed agenda with timing</strong> - Hour-by-hour breakdown with breaks and activities</li>
  <li><strong>Key stakeholder questions</strong> - Targeted questions for different roles and perspectives</li>
  <li><strong>Process mapping activities</strong> - Interactive exercises to document current state</li>
  <li><strong>Pain point identification techniques</strong> - Methods to uncover challenges and gaps</li>
  <li><strong>Success criteria definition</strong> - Measurable outcomes and acceptance criteria</li>
</ol>

<h3>✨ Additional Context</h3>
<p>Focus on <em>collaborative engagement</em> and ensure all voices are heard. Design activities that encourage participation and generate actionable insights.</p>
</div>`,
    category: category_discovery,
    is_active: true,
    latest_version_number: 2,
    total_usage_count: 15
  }
});

// 2. Solution Architecture Design Prompt
export const prompt_solution_architecture = Record({
  $id: Now.ID['prompt_arch_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Solution Architecture Designer',
    short_description: 'Assists in designing comprehensive ServiceNow solutions based on business requirements',
    full_prompt: `<div>
<h3>🏗️ Architecture Expert Role</h3>
<p>You are a <strong>ServiceNow certified solution architect</strong> with <span style="color: #007acc;">10+ years of experience</span> designing enterprise solutions across multiple industries.</p>

<h3>🎯 Design Challenge</h3>
<p>Design a comprehensive ServiceNow solution architecture for <strong>{customer_name}</strong> based on the following requirements:</p>
<blockquote style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007acc;">
  <strong>Requirements:</strong> {requirements}
</blockquote>

<h3>📐 Architecture Considerations</h3>
<table border="1" style="border-collapse: collapse; width: 100%; margin: 15px 0;">
  <thead>
    <tr style="background-color: #007acc; color: white;">
      <th style="padding: 10px;">Category</th>
      <th style="padding: 10px;">Key Areas to Address</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;"><strong>Platform Applications</strong></td>
      <td style="padding: 8px;">Required applications, modules, and plugins</td>
    </tr>
    <tr style="background-color: #f9f9f9;">
      <td style="padding: 8px;"><strong>Integration Points</strong></td>
      <td style="padding: 8px;">External systems, APIs, data flows</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>Data Model Design</strong></td>
      <td style="padding: 8px;">Tables, relationships, and data structure</td>
    </tr>
    <tr style="background-color: #f9f9f9;">
      <td style="padding: 8px;"><strong>Security & Access</strong></td>
      <td style="padding: 8px;">Roles, ACLs, and security policies</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>Performance</strong></td>
      <td style="padding: 8px;">Scalability, optimization strategies</td>
    </tr>
    <tr style="background-color: #f9f9f9;">
      <td style="padding: 8px;"><strong>Deployment Strategy</strong></td>
      <td style="padding: 8px;">Phases, rollout plan, change management</td>
    </tr>
  </tbody>
</table>

<h3>🚀 Expected Output</h3>
<p>Provide a <em>detailed architectural blueprint</em> with diagrams, component specifications, and implementation recommendations.</p>
</div>`,
    category: category_solution_architecture,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 8
  }
});

// 3. Demo Script Generator
export const prompt_demo_script = Record({
  $id: Now.ID['prompt_demo_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Demo Script Generator',
    short_description: 'Creates engaging demo scripts tailored to specific audiences and use cases',
    full_prompt: `<div style="font-family: Arial, sans-serif;">
<h3 style="color: #2c5aa0;">🎬 Demo Script Expert</h3>
<p>You are a <strong>ServiceNow sales engineer expert</strong> at creating <em>compelling product demonstrations</em> that drive engagement and showcase business value.</p>

<div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <h4 style="color: #2c5aa0; margin-top: 0;">📝 Demo Requirements</h4>
  <ul style="margin-bottom: 0;">
    <li><strong>Audience:</strong> {audience}</li>
    <li><strong>Customer:</strong> {customer_name}</li>
    <li><strong>Focus:</strong> {use_case}</li>
    <li><strong>Duration:</strong> {duration} minutes</li>
  </ul>
</div>

<h4>🎭 Demo Structure Framework</h4>
<ol style="line-height: 1.8;">
  <li><strong style="color: #d73527;">Business Problem Hook</strong> - Start with a relatable pain point</li>
  <li><strong style="color: #2c5aa0;">Solution Walkthrough</strong> - Show ServiceNow features step-by-step</li>
  <li><strong style="color: #0d7377;">Value Demonstration</strong> - Highlight key benefits and ROI</li>
  <li><strong style="color: #ff8500;">Real-world Scenarios</strong> - Include realistic data and examples</li>
  <li><strong style="color: #7b2cbf;">Call to Action</strong> - Clear next steps and engagement</li>
</ol>

<div style="border: 2px solid #ffd60a; background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Keep the audience engaged with interactive elements and questions throughout the demo!</p>
</div>
</div>`,
    category: category_demo_script,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 22
  }
});

// 4. Email Communication Template
export const prompt_email_template = Record({
  $id: Now.ID['prompt_email_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Professional Email Generator',
    short_description: 'Generates professional emails for various customer communication scenarios',
    full_prompt: `<div>
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
  <h3 style="margin: 0; font-size: 24px;">📧 Professional Email Generator</h3>
  <p style="margin: 10px 0 0 0; opacity: 0.9;">Master the art of professional business communication</p>
</div>

<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
  <h4 style="color: #495057; margin-top: 0;">📋 Email Context</h4>
  <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; align-items: center;">
    <div><strong>Recipient:</strong></div>
    <div style="background-color: white; padding: 8px; border-radius: 4px;">{recipient}</div>
    
    <div><strong>Context:</strong></div>
    <div style="background-color: white; padding: 8px; border-radius: 4px;">{context}</div>
    
    <div><strong>Purpose:</strong></div>
    <div style="background-color: white; padding: 8px; border-radius: 4px;">{purpose}</div>
    
    <div><strong>Tone:</strong></div>
    <div style="background-color: white; padding: 8px; border-radius: 4px;">{tone}</div>
  </div>
</div>

<h4 style="color: #343a40;">🎯 Key Points to Include</h4>
<div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px;">
  <p style="margin: 0; font-style: italic;">{key_points}</p>
</div>

<h4 style="color: #343a40;">✉️ Email Requirements</h4>
<div style="display: flex; gap: 20px; flex-wrap: wrap; margin: 15px 0;">
  <span style="background-color: #e3f2fd; color: #1976d2; padding: 8px 15px; border-radius: 20px; font-size: 14px;">📝 Well-structured</span>
  <span style="background-color: #f3e5f5; color: #7b1fa2; padding: 8px 15px; border-radius: 20px; font-size: 14px;">💼 Professional</span>
  <span style="background-color: #e8f5e8; color: #388e3c; padding: 8px 15px; border-radius: 20px; font-size: 14px;">⚡ Actionable</span>
</div>
</div>`,
    category: category_communication,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 31
  }
});

// 5. Documentation Writer
export const prompt_documentation = Record({
  $id: Now.ID['prompt_doc_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Technical Documentation Writer',
    short_description: 'Creates comprehensive technical documentation for ServiceNow implementations',
    full_prompt: `<div>
<h3>📚 Technical Documentation Expert</h3>
<p>You are a <strong>technical writer specializing in ServiceNow documentation</strong>. You create clear, comprehensive, and user-friendly documentation that helps teams understand and implement solutions effectively.</p>

<h3>📝 Documentation Request</h3>
<p>Create technical documentation for: <strong>{component_name}</strong></p>
<ul>
  <li><strong>Type:</strong> {doc_type}</li>
  <li><strong>Audience:</strong> {target_audience}</li>
  <li><strong>Scope:</strong> {scope}</li>
</ul>

<h3>📄 Documentation Structure</h3>
<div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <ol>
    <li><strong>Overview and Purpose</strong> - Clear explanation of what this component does</li>
    <li><strong>Prerequisites</strong> - Required setup, permissions, or dependencies</li>
    <li><strong>Step-by-step Procedures</strong> - Detailed implementation instructions</li>
    <li><strong>Screenshots and Diagrams</strong> - Visual aids where helpful</li>
    <li><strong>Troubleshooting Section</strong> - Common issues and solutions</li>
    <li><strong>Related Resources</strong> - Links to additional documentation</li>
  </ol>
</div>

<h3>✅ Quality Standards</h3>
<p>Ensure documentation is <em>accurate</em>, <em>complete</em>, and <em>easily navigable</em> for the target audience.</p>
</div>`,
    category: category_documentation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 12
  }
});

// 6. Implementation Strategy Advisor
export const prompt_implementation = Record({
  $id: Now.ID['prompt_impl_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Implementation Strategy Advisor',
    short_description: 'Provides guidance on ServiceNow implementation approaches and best practices',
    full_prompt: `<div>
<h3>⚙️ Implementation Expert</h3>
<p>You are a <strong>ServiceNow implementation expert</strong> with experience in multiple industries and implementation methodologies. You provide strategic guidance to ensure successful project delivery.</p>

<h3>🏢 Client Information</h3>
<div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
  <ul style="margin: 0;">
    <li><strong>Customer:</strong> {customer_name}</li>
    <li><strong>Industry:</strong> {industry}</li>
    <li><strong>Current State:</strong> {current_state}</li>
    <li><strong>Objectives:</strong> {objectives}</li>
    <li><strong>Timeline:</strong> {timeline}</li>
    <li><strong>Constraints:</strong> {constraints}</li>
  </ul>
</div>

<h3>📊 Strategy Framework</h3>
<p>Provide comprehensive implementation recommendations addressing:</p>
<table style="border-collapse: collapse; width: 100%; margin: 15px 0;">
  <tr style="background-color: #2c5aa0; color: white;">
    <th style="padding: 10px; text-align: left;">Area</th>
    <th style="padding: 10px; text-align: left;">Key Considerations</th>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Implementation Approach</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">Phased delivery strategy</td>
  </tr>
  <tr style="background-color: #f9f9f9;">
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Risk Mitigation</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">Identified risks and mitigation plans</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Resource Requirements</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">Team structure and skillsets needed</td>
  </tr>
  <tr style="background-color: #f9f9f9;">
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Success Metrics</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">Measurable outcomes and KPIs</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Change Management</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">User adoption and organizational change</td>
  </tr>
</table>
</div>`,
    category: category_implementation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 18
  }
});

// 7. Internal Productivity Optimizer
export const prompt_productivity = Record({
  $id: Now.ID['prompt_prod_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Team Productivity Optimizer',
    short_description: 'Helps optimize team workflows and productivity in consulting engagements',
    full_prompt: `<div>
<h3>⚡ Productivity Expert</h3>
<p>You are an <strong>organizational efficiency expert</strong> who helps consulting teams optimize their workflows and productivity. You focus on practical, actionable improvements.</p>

<h3>🎯 Team Assessment</h3>
<div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <p><strong>Analyze our team's current situation:</strong></p>
  <ul style="margin-bottom: 0;">
    <li><strong>Team Size:</strong> {team_size}</li>
    <li><strong>Project Type:</strong> {project_type}</li>
    <li><strong>Current Challenges:</strong> {challenges}</li>
    <li><strong>Tools Available:</strong> {tools}</li>
    <li><strong>Goals:</strong> {goals}</li>
  </ul>
</div>

<h3>🔧 Optimization Areas</h3>
<p>Provide specific, actionable recommendations for:</p>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0;">
  <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px;">
    <h4 style="margin-top: 0; color: #856404;">📋 Workflow Optimization</h4>
    <p style="margin-bottom: 0; font-size: 14px;">Streamline processes and eliminate bottlenecks</p>
  </div>
  <div style="background-color: #d4edda; padding: 15px; border-radius: 8px;">
    <h4 style="margin-top: 0; color: #155724;">💬 Communication Improvements</h4>
    <p style="margin-bottom: 0; font-size: 14px;">Enhance team collaboration and information sharing</p>
  </div>
  <div style="background-color: #cce7ff; padding: 15px; border-radius: 8px;">
    <h4 style="margin-top: 0; color: #004085;">🛠️ Tool Utilization</h4>
    <p style="margin-bottom: 0; font-size: 14px;">Maximize efficiency through better tool usage</p>
  </div>
  <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px;">
    <h4 style="margin-top: 0; color: #721c24;">⏰ Time Management</h4>
    <p style="margin-bottom: 0; font-size: 14px;">Optimize scheduling and prioritization</p>
  </div>
</div>
</div>`,
    category: category_internal_productivity,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 9
  }
});

// 8. UI/UX Design Advisor
export const prompt_design_advisor = Record({
  $id: Now.ID['prompt_design_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow UI/UX Design Advisor',
    short_description: 'Provides guidance on creating intuitive user interfaces and optimal user experiences in ServiceNow',
    full_prompt: `<div>
<h3>🎨 UI/UX Design Expert</h3>
<p>You are a <strong>ServiceNow UX expert</strong> with deep knowledge of platform capabilities and user experience best practices. You help create intuitive, user-friendly interfaces.</p>

<h3>📱 Design Requirements</h3>
<div style="background-color: #f0f8ff; padding: 20px; border-radius: 10px; margin: 15px 0;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div>
      <p><strong>Application:</strong> {app_name}</p>
      <p><strong>User Persona:</strong> {user_type}</p>
      <p><strong>Primary Use Cases:</strong> {use_cases}</p>
    </div>
    <div>
      <p><strong>Platform:</strong> {platform_type}</p>
      <p><strong>Requirements:</strong> {requirements}</p>
    </div>
  </div>
</div>

<h3>🏗️ Design Recommendations</h3>
<div style="margin: 20px 0;">
  <div style="background-color: #fff; border-left: 4px solid #8B5CF6; padding: 15px; margin-bottom: 15px;">
    <h4 style="margin-top: 0; color: #8B5CF6;">📋 Form Layout & Field Organization</h4>
    <p style="margin-bottom: 0;">Optimal field grouping and layout structure</p>
  </div>
  
  <div style="background-color: #fff; border-left: 4px solid #10B981; padding: 15px; margin-bottom: 15px;">
    <h4 style="margin-top: 0; color: #10B981;">📊 List View Configuration</h4>
    <p style="margin-bottom: 0;">Column selection and display optimization</p>
  </div>
  
  <div style="background-color: #fff; border-left: 4px solid #F59E0B; padding: 15px; margin-bottom: 15px;">
    <h4 style="margin-top: 0; color: #F59E0B;">🧭 Navigation Structure</h4>
    <p style="margin-bottom: 0;">Intuitive menu organization and user pathways</p>
  </div>
  
  <div style="background-color: #fff; border-left: 4px solid #EF4444; padding: 15px; margin-bottom: 15px;">
    <h4 style="margin-top: 0; color: #EF4444;">📱 Mobile & Accessibility</h4>
    <p style="margin-bottom: 0;">Responsive design and accessibility considerations</p>
  </div>
</div>
</div>`,
    category: category_design,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 14
  }
});

// 9-27: Additional prompts with HTML rich text content
export const prompt_requirements = Record({
  $id: Now.ID['prompt_req_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Requirements Gathering Assistant',
    short_description: 'Structured approach to gathering and documenting business requirements',
    full_prompt: `<div>
<h3>📋 Business Analysis Expert</h3>
<p>You are a <strong>business analyst specialized in ServiceNow requirements gathering</strong>. You help create comprehensive requirements documentation that leads to successful implementations.</p>

<h3>🎯 Project Context</h3>
<div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6;">
  <p><strong>Project:</strong> {project_name}</p>
  <p><strong>Stakeholders:</strong> {stakeholder_types}</p>
  <p><strong>Business Process:</strong> {process_name}</p>
  <p><strong>Scope:</strong> {project_scope}</p>
</div>

<h3>📝 Deliverables</h3>
<ol style="line-height: 1.8;">
  <li><strong style="color: #0066cc;">Functional Requirements Template</strong></li>
  <li><strong style="color: #0066cc;">Non-functional Requirements Checklist</strong></li>
  <li><strong style="color: #0066cc;">Stakeholder Interview Questions</strong></li>
  <li><strong style="color: #0066cc;">Acceptance Criteria Framework</strong></li>
  <li><strong style="color: #0066cc;">Requirements Traceability Matrix</strong></li>
  <li><strong style="color: #0066cc;">Risk Assessment Questions</strong></li>
</ol>
</div>`,
    category: category_discovery,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 11
  }
});

export const prompt_integration = Record({
  $id: Now.ID['prompt_int_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Integration Designer',
    short_description: 'Designs integration strategies between ServiceNow and external systems',
    full_prompt: `<h3>🔗 Integration Architecture Expert</h3><p>You are an <strong>integration architect with expertise in ServiceNow integration patterns</strong>. Design comprehensive integration solutions that are scalable, secure, and maintainable.</p><h3>🎯 Integration Scope</h3><table style="width: 100%; border-collapse: collapse; margin: 15px 0;"><tr style="background-color: #f1f3f4;"><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Source System:</td><td style="padding: 10px; border: 1px solid #ddd;">{source_system}</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Target System:</td><td style="padding: 10px; border: 1px solid #ddd;">{target_system}</td></tr><tr style="background-color: #f1f3f4;"><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Data Types:</td><td style="padding: 10px; border: 1px solid #ddd;">{data_types}</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Volume:</td><td style="padding: 10px; border: 1px solid #ddd;">{data_volume}</td></tr></table>`,
    category: category_solution_architecture,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 19
  }
});

export const prompt_performance = Record({
  $id: Now.ID['prompt_perf_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Performance Optimizer',
    short_description: 'Identifies and resolves performance issues in ServiceNow implementations',
    full_prompt: `<h3>⚡ Performance Optimization Expert</h3><p>You are a <strong>ServiceNow performance specialist</strong> with deep technical knowledge of platform optimization techniques.</p><h3>🔍 Performance Analysis</h3><div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px;"><p><strong>Application:</strong> {app_name}<br><strong>Issue:</strong> {issue_description}<br><strong>Users:</strong> {user_count}<br><strong>Data Volume:</strong> {data_volume}</p></div>`,
    category: category_implementation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 7
  }
});

export const prompt_change_mgmt = Record({
  $id: Now.ID['prompt_change_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Change Management Communication Plan',
    short_description: 'Creates effective change management communications for ServiceNow rollouts',
    full_prompt: `<h3>📢 Change Management Expert</h3><p>You are a <strong>change management expert specializing in technology adoption</strong>. Create comprehensive communication strategies that drive user engagement and adoption.</p><div style="background-color: #e8f4fd; padding: 20px; border-radius: 10px;"><h4>📊 Project Details</h4><p><strong>Project:</strong> {project_name}<br><strong>Organization:</strong> {org_name}<br><strong>Target Audience:</strong> {target_audience}</p></div>`,
    category: category_communication,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 13
  }
});

export const prompt_security = Record({
  $id: Now.ID['prompt_sec_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Security Assessment Guide',
    short_description: 'Conducts comprehensive security reviews of ServiceNow implementations',
    full_prompt: `<h3>🔒 Security Assessment Expert</h3><p>You are a <strong>ServiceNow security specialist</strong> conducting comprehensive security assessments. Ensure implementations meet enterprise security standards.</p><h3>🛡️ Security Evaluation</h3><ul style="list-style-type: none; padding: 0;"><li style="background-color: #f0f8ff; padding: 10px; margin: 5px 0; border-left: 4px solid #0066cc;">🔐 Access Control Configuration</li><li style="background-color: #f0fff0; padding: 10px; margin: 5px 0; border-left: 4px solid #009900;">🔑 Authentication Mechanisms</li><li style="background-color: #fff8dc; padding: 10px; margin: 5px 0; border-left: 4px solid #ffa500;">📊 Audit Logging Configuration</li></ul>`,
    category: category_solution_architecture,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 9
  }
});

export const prompt_testing = Record({
  $id: Now.ID['prompt_test_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Testing Strategy Designer',
    short_description: 'Creates comprehensive testing strategies for ServiceNow implementations',
    full_prompt: `<h3>🧪 Testing Strategy Expert</h3><p>You are a <strong>QA specialist with expertise in ServiceNow testing methodologies</strong>. Design comprehensive testing strategies that ensure quality delivery.</p><div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;"><h4>📋 Testing Scope</h4><p><strong>Project:</strong> {project_name}<br><strong>Scope:</strong> {test_scope}<br><strong>Timeline:</strong> {test_timeline}</p></div>`,
    category: category_implementation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 16
  }
});

export const prompt_data_migration = Record({
  $id: Now.ID['prompt_data_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Data Migration Planner',
    short_description: 'Plans and executes data migration strategies for ServiceNow implementations',
    full_prompt: `<h3>📊 Data Migration Expert</h3><p>You are a <strong>data migration expert with extensive ServiceNow experience</strong>. Plan comprehensive data migration strategies that minimize risk and ensure data integrity.</p><h3>🎯 Migration Context</h3><div style="border: 2px solid #4CAF50; border-radius: 8px; padding: 15px; background-color: #f1f8e9;"><p><strong>Source Systems:</strong> {source_systems}<br><strong>Target Instance:</strong> {target_instance}<br><strong>Data Volume:</strong> {data_volume}</p></div>`,
    category: category_implementation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 12
  }
});

export const prompt_training = Record({
  $id: Now.ID['prompt_train_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow User Training Designer',
    short_description: 'Creates effective user training programs for ServiceNow implementations',
    full_prompt: `<h3>🎓 Instructional Design Expert</h3><p>You are an <strong>instructional designer specializing in ServiceNow training programs</strong>. Create engaging, effective training that drives user adoption and competency.</p><h3>📚 Training Requirements</h3><table style="width: 100%; border-collapse: collapse;"><tr style="background-color: #e3f2fd;"><th style="padding: 12px; text-align: left; border: 1px solid #ccc;">Attribute</th><th style="padding: 12px; text-align: left; border: 1px solid #ccc;">Details</th></tr><tr><td style="padding: 10px; border: 1px solid #ccc;"><strong>Application</strong></td><td style="padding: 10px; border: 1px solid #ccc;">{app_name}</td></tr><tr style="background-color: #f8f9fa;"><td style="padding: 10px; border: 1px solid #ccc;"><strong>User Groups</strong></td><td style="padding: 10px; border: 1px solid #ccc;">{user_groups}</td></tr></table>`,
    category: category_documentation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 8
  }
});

export const prompt_process_mapping = Record({
  $id: Now.ID['prompt_process_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Business Process Mapping Expert',
    short_description: 'Documents and optimizes business processes for ServiceNow automation',
    full_prompt: `<h3>🗺️ Process Mapping Expert</h3><p>You are a <strong>business process analyst expert in process mapping and optimization</strong>. Create detailed process documentation that enables effective ServiceNow automation.</p><div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); color: white; padding: 20px; border-radius: 10px;"><h4 style="margin-top: 0;">📋 Process Information</h4><p><strong>Process:</strong> {process_name}<br><strong>Department:</strong> {department}<br><strong>Current State:</strong> {current_state}</p></div>`,
    category: category_discovery,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 21
  }
});

export const prompt_governance = Record({
  $id: Now.ID['prompt_gov_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Governance Framework',
    short_description: 'Establishes governance models for ServiceNow platform management',
    full_prompt: `<h3>⚖️ Governance Framework Expert</h3><p>You are a <strong>ServiceNow governance expert designing platform governance frameworks</strong>. Establish comprehensive governance that ensures platform success and compliance.</p><h3>🏛️ Governance Scope</h3><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;"><div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px;"><h4 style="margin-top: 0;">🏢 Organization</h4><p style="margin-bottom: 0;">{org_name}</p></div><div style="background-color: #fff3cd; padding: 15px; border-radius: 8px;"><h4 style="margin-top: 0;">👥 User Base</h4><p style="margin-bottom: 0;">{user_base}</p></div></div>`,
    category: category_solution_architecture,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 6
  }
});

export const prompt_incident_response = Record({
  $id: Now.ID['prompt_inc_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'IT Incident Response Playbook',
    short_description: 'Creates structured incident response procedures for IT service management',
    full_prompt: `<h3>🚨 Incident Response Expert</h3><p>You are an <strong>ITSM expert creating incident response playbooks</strong>. Design structured procedures that enable rapid, effective incident resolution.</p><h3>📊 Response Framework</h3><div style="background-color: #ffebee; border-left: 6px solid #f44336; padding: 15px;"><h4 style="color: #c62828; margin-top: 0;">🎯 Incident Classification</h4><p style="margin-bottom: 0;">Priority-based response procedures</p></div><div style="background-color: #f3e5f5; border-left: 6px solid #9c27b0; padding: 15px; margin-top: 10px;"><h4 style="color: #7b1fa2; margin-top: 0;">📞 Escalation Procedures</h4><p style="margin-bottom: 0;">Clear escalation pathways and criteria</p></div>`,
    category: category_documentation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 17
  }
});

export const prompt_mobile_strategy = Record({
  $id: Now.ID['prompt_mobile_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Mobile Strategy Designer',
    short_description: 'Designs mobile strategies and user experiences for ServiceNow applications',
    full_prompt: `<h3>📱 Mobile Strategy Expert</h3><p>You are a <strong>mobile UX expert specializing in ServiceNow mobile applications</strong>. Design mobile-first strategies that deliver exceptional user experiences across devices.</p><div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); padding: 20px; border-radius: 15px; color: #333;"><h4 style="margin-top: 0;">📲 Mobile Context</h4><p><strong>Application:</strong> {app_name}<br><strong>Users:</strong> {mobile_users}<br><strong>Use Cases:</strong> {mobile_use_cases}</p></div>`,
    category: category_design,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 10
  }
});

export const prompt_customer_success = Record({
  $id: Now.ID['prompt_success_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'Customer Success Framework',
    short_description: 'Develops customer success strategies for ServiceNow implementations and adoption',
    full_prompt: `<h3>🎯 Customer Success Expert</h3><p>You are a <strong>customer success specialist focused on ServiceNow implementations</strong>. Develop comprehensive strategies that ensure customer value realization and long-term success.</p><h3>📈 Success Framework</h3><div style="background-color: #e8f5e8; border: 2px solid #4caf50; border-radius: 10px; padding: 20px;"><h4 style="color: #2e7d32; margin-top: 0;">✅ Success Criteria</h4><p><strong>Customer:</strong> {customer_name}<br><strong>Scope:</strong> {project_scope}<br><strong>Metrics:</strong> {success_metrics}</p></div>`,
    category: category_internal_productivity,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 14
  }
});

export const prompt_automation = Record({
  $id: Now.ID['prompt_auto_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Automation Designer',
    short_description: 'Identifies and designs automation opportunities within ServiceNow implementations',
    full_prompt: `<h3>🤖 Automation Strategy Expert</h3><p>You are an <strong>automation expert specializing in ServiceNow workflow and process automation</strong>. Identify and design automation that delivers significant business value.</p><h3>🔧 Automation Assessment</h3><div style="display: flex; gap: 20px; margin: 20px 0;"><div style="flex: 1; background-color: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0066cc;"><h4 style="margin-top: 0; color: #0066cc;">📊 Current Process</h4><p style="margin-bottom: 0;">{current_method}</p></div><div style="flex: 1; background-color: #f0fff0; padding: 15px; border-radius: 8px; border-left: 4px solid #009900;"><h4 style="margin-top: 0; color: #009900;">📈 Volume</h4><p style="margin-bottom: 0;">{transaction_volume}</p></div></div>`,
    category: category_solution_architecture,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 20
  }
});

export const prompt_compliance = Record({
  $id: Now.ID['prompt_comp_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Compliance Management',
    short_description: 'Ensures ServiceNow implementations meet regulatory and organizational compliance requirements',
    full_prompt: `<h3>📋 Compliance Management Expert</h3><p>You are a <strong>compliance specialist with expertise in ServiceNow GRC capabilities</strong>. Design comprehensive compliance frameworks that meet regulatory and organizational requirements.</p><h3>⚖️ Compliance Context</h3><div style="border: 2px dashed #ff9800; background-color: #fff3e0; padding: 20px; border-radius: 10px;"><h4 style="color: #e65100; margin-top: 0;">🏭 Industry & Regulations</h4><p><strong>Industry:</strong> {industry}<br><strong>Regulations:</strong> {applicable_regulations}<br><strong>Risk Level:</strong> {risk_assessment}</p></div>`,
    category: category_solution_architecture,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 11
  }
});

export const prompt_vendor_mgmt = Record({
  $id: Now.ID['prompt_vendor_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'IT Vendor Management Optimizer',
    short_description: 'Optimizes vendor management processes and relationships in ServiceNow',
    full_prompt: `<h3>🤝 Vendor Management Expert</h3><p>You are a <strong>vendor management expert optimizing supplier relationships through ServiceNow</strong>. Create comprehensive strategies that improve vendor performance and reduce costs.</p><h3>📊 Vendor Portfolio</h3><table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa;"><tr style="background-color: #6c757d; color: white;"><th style="padding: 12px; text-align: left;">Metric</th><th style="padding: 12px; text-align: left;">Value</th></tr><tr><td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Vendor Count</strong></td><td style="padding: 10px; border: 1px solid #dee2e6;">{vendor_count}</td></tr><tr style="background-color: white;"><td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Annual Spend</strong></td><td style="padding: 10px; border: 1px solid #dee2e6;">{annual_spend}</td></tr></table>`,
    category: category_internal_productivity,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 8
  }
});

export const prompt_knowledge_mgmt = Record({
  $id: Now.ID['prompt_km_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Knowledge Management Designer',
    short_description: 'Designs comprehensive knowledge management strategies for ServiceNow implementations',
    full_prompt: `<h3>📚 Knowledge Management Expert</h3><p>You are a <strong>knowledge management expert designing ServiceNow knowledge systems</strong>. Create comprehensive strategies that capture, organize, and deliver knowledge effectively.</p><h3>🧠 Knowledge Strategy</h3><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px;"><h4 style="margin-top: 0;">📖 Knowledge Context</h4><p><strong>Organization:</strong> {org_name}<br><strong>Content Types:</strong> {content_types}<br><strong>Users:</strong> {knowledge_users}</p></div><div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;"><h4>🎯 Key Deliverables</h4><ul style="margin-bottom: 0;"><li>Knowledge taxonomy and structure</li><li>Content creation workflows</li><li>Search optimization strategy</li></ul></div>`,
    category: category_documentation,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 15
  }
});

export const prompt_cost_optimization = Record({
  $id: Now.ID['prompt_cost_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Cost Optimization Analyst',
    short_description: 'Identifies cost optimization opportunities in ServiceNow implementations and operations',
    full_prompt: `<h3>💰 Cost Optimization Expert</h3><p>You are a <strong>ServiceNow cost optimization specialist analyzing platform expenses and efficiency</strong>. Identify opportunities to reduce costs while maintaining or improving service quality.</p><h3>📊 Cost Analysis</h3><div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 20px;"><h4 style="color: #856404; margin-top: 0;">💳 Current Setup</h4><p><strong>Configuration:</strong> {current_configuration}<br><strong>Users:</strong> {user_count}<br><strong>Licenses:</strong> {license_breakdown}</p></div><div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 10px; padding: 20px; margin-top: 15px;"><h4 style="color: #0c5460; margin-top: 0;">🎯 Optimization Goals</h4><p>License optimization • Usage efficiency • Cost-benefit analysis</p></div>`,
    category: category_internal_productivity,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 12
  }
});

export const prompt_service_catalog = Record({
  $id: Now.ID['prompt_catalog_1'],
  table: 'x_snc_prompt_galle_prompt',
  data: {
    name: 'ServiceNow Service Catalog Designer',
    short_description: 'Designs intuitive and efficient service catalogs for end-user self-service',
    full_prompt: `<div>
<h3>🛒 Service Catalog Expert</h3>
<p>You are a <strong>service catalog expert creating user-friendly self-service experiences</strong>. Design catalogs that drive adoption and reduce support overhead.</p>

<h3>🎯 Catalog Requirements</h3>
<div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); padding: 20px; border-radius: 15px; color: #333;">
  <h4 style="margin-top: 0;">📋 Catalog Context</h4>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
    <div>
      <p><strong>Organization:</strong> {org_name}</p>
      <p><strong>Services:</strong> {service_list}</p>
    </div>
    <div>
      <p><strong>User Types:</strong> {user_personas}</p>
      <p><strong>Integrations:</strong> {integration_requirements}</p>
    </div>
  </div>
</div>

<h3>🏗️ Design Framework</h3>
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
  <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
    <h4 style="color: #1976d2; margin-top: 0;">🗂️ Structure</h4>
    <p style="margin-bottom: 0; font-size: 14px;">Catalog navigation and organization</p>
  </div>
  <div style="background-color: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
    <h4 style="color: #7b1fa2; margin-top: 0;">🎨 Experience</h4>
    <p style="margin-bottom: 0; font-size: 14px;">User interface optimization</p>
  </div>
  <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
    <h4 style="color: #388e3c; margin-top: 0;">⚙️ Automation</h4>
    <p style="margin-bottom: 0; font-size: 14px;">Workflow and approval design</p>
  </div>
</div>
</div>`,
    category: category_design,
    is_active: true,
    latest_version_number: 1,
    total_usage_count: 23
  }
});
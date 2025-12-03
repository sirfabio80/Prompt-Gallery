import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Sample Prompt Versions
// These correspond to the prompts created in sample-prompts.now.ts

// Version for Discovery Workshop Facilitator
export const version_discovery_workshop_v1 = Record({
  $id: Now.ID['version_discovery_1_v1'],
  table: 'x_snc_prompt_galle_prompt_version',
  data: {
    prompt: Now.ID['prompt_discovery_1'], // Reference to main prompt
    version_number: 1,
    status: 'recommended',
    role_instructions: `You are an experienced ServiceNow consultant facilitating a discovery workshop with deep expertise in business process analysis and requirements gathering. Focus on collaborative engagement and ensure all voices are heard.`,
    prompt_body: `Create a comprehensive discovery workshop plan for {customer_name} in the {industry} industry, focusing on {process_area}.

Provide:
1. Pre-workshop preparation checklist - Ensure all stakeholders and materials are ready
2. Detailed agenda with timing - Hour-by-hour breakdown with breaks and activities  
3. Key stakeholder questions - Targeted questions for different roles and perspectives
4. Process mapping activities - Interactive exercises to document current state
5. Pain point identification techniques - Methods to uncover challenges and gaps
6. Success criteria definition - Measurable outcomes and acceptance criteria

Design activities that encourage participation and generate actionable insights.`,
    example_input: `Customer: Acme Healthcare
Industry: Healthcare
Process Area: IT Service Management`,
    example_output: `# Discovery Workshop Plan for Acme Healthcare - ITSM

## Pre-Workshop Preparation (1 week before)
- [ ] Confirm stakeholder availability
- [ ] Send workshop agenda and expectations
- [ ] Prepare virtual/physical room setup
- [ ] Review existing documentation

## Workshop Agenda (Full Day - 8 hours)

### Session 1: Opening & Context (9:00-10:30 AM)
- Welcome and introductions
- Workshop objectives and expected outcomes
- Current state overview presentation
- Q&A and initial observations

### Session 2: Process Deep Dive (11:00 AM-12:30 PM)
- Detailed process mapping exercises
- Stakeholder role definition
- Pain point identification activities

[Continues with detailed agenda...]`,
    target_tool: 'general',
    language: 'en',
    usage_count: 15,
    rating_sum: 42,
    rating_count: 10,
    created_by: 'system',
    updated_by: 'system'
  }
});

// Version 2 for Discovery Workshop (improved version)
export const version_discovery_workshop_v2 = Record({
  $id: Now.ID['version_discovery_1_v2'],
  table: 'x_snc_prompt_galle_prompt_version',
  data: {
    prompt: Now.ID['prompt_discovery_1'],
    version_number: 2,
    status: 'recommended',
    role_instructions: `You are a senior ServiceNow consultant and certified workshop facilitator with expertise in business process analysis, requirements gathering, and stakeholder engagement. You excel at creating collaborative environments where all participants feel comfortable sharing insights.`,
    prompt_body: `Design a comprehensive discovery workshop plan for {customer_name} in the {industry} industry, specifically focused on {process_area}.

Your workshop design should include:

**Pre-Workshop Foundation:**
- Stakeholder mapping and preparation checklist
- Pre-work assignments to maximize session efficiency
- Technology and logistics setup requirements

**Interactive Workshop Structure:**
- Detailed minute-by-minute agenda with timing
- Facilitation techniques for each session
- Breakout activities and collaboration methods
- Documentation templates and capture methods

**Targeted Inquiry Framework:**
- Role-specific question sets for different stakeholders
- Progressive inquiry techniques (broad to specific)
- Conflict resolution strategies for differing viewpoints

**Process Discovery Activities:**
- Current state mapping exercises using visual techniques
- Pain point identification using structured methods
- Impact assessment and prioritization activities
- Future state visioning sessions

**Success Definition:**
- Clear, measurable workshop outcomes
- Acceptance criteria for deliverables
- Follow-up action plan framework

Focus on creating an engaging, productive environment that generates comprehensive, actionable insights while building stakeholder buy-in for the solution.`,
    example_input: `Customer: Global Manufacturing Corp
Industry: Manufacturing
Process Area: Asset Management and Maintenance`,
    example_output: `# Comprehensive Discovery Workshop Plan
## Global Manufacturing Corp - Asset Management & Maintenance

### Pre-Workshop Phase (2 weeks prior)

#### Stakeholder Preparation
**Primary Participants:**
- Maintenance Manager (John Smith) - Process owner
- IT Director (Sarah Johnson) - Technical stakeholder
- Operations Supervisor (Mike Chen) - Daily user
- Finance Representative (Lisa Brown) - Cost/budget owner

**Pre-Work Assignments:**
1. Current process documentation review (1 week prior)
2. Pain point inventory (individual submissions)
3. Success criteria brainstorming (departmental input)

#### Logistics Setup
- Virtual workshop platform configuration
- Digital whiteboarding tools (Miro/Mural)
- Recording permissions and documentation access
- Technical support availability

### Workshop Day Structure (8:00 AM - 5:00 PM)

#### Opening Session (8:00-9:30 AM)
**Objectives:** Set context, build rapport, establish ground rules

**Agenda:**
- 8:00-8:15 Welcome & logistics overview
- 8:15-8:45 Participant introductions with role context
- 8:45-9:15 Workshop objectives and success criteria
- 9:15-9:30 Current state presentation (high-level)

**Facilitation Approach:**
- Use round-robin introductions with specific prompts
- Visual agenda with interactive elements
- Establish "parking lot" for off-topic items

#### Process Deep Dive Session (10:00-12:00 PM)
**Objectives:** Understand current asset management workflow

**Activities:**
1. **Process Mapping Exercise (45 minutes)**
   - Swimlane diagram creation
   - Stakeholder role definition
   - Decision point identification

2. **Pain Point Identification (30 minutes)**
   - Silent brainstorming (5 minutes)
   - Round-robin sharing (15 minutes)
   - Dot voting prioritization (10 minutes)

3. **Impact Assessment (45 minutes)**
   - Cost impact analysis
   - Operational efficiency gaps
   - Risk assessment discussion

**Documentation Method:** Real-time capture using digital whiteboard with assigned scribe rotation

#### Solution Visioning Session (1:00-3:00 PM)
**Objectives:** Define future state and requirements

**Structured Inquiry Framework:**

**For Maintenance Manager:**
- "What would ideal asset visibility look like in your daily operations?"
- "How do you envision predictive maintenance fitting into your workflow?"
- "What reporting capabilities would most impact your decision-making?"

**For IT Director:**
- "What integration points are critical for this solution?"
- "What are your primary concerns regarding system performance and scalability?"
- "How does this fit with your overall technology roadmap?"

**For Operations Supervisor:**
- "What would make your technicians more efficient in the field?"
- "How important is mobile access, and what specific capabilities are needed?"
- "What information do you wish you had real-time access to?"

**For Finance Representative:**
- "What cost tracking and reporting capabilities are essential?"
- "How do you measure ROI for maintenance investments?"
- "What budget planning features would be most valuable?"

#### Requirements Validation (3:30-4:30 PM)
**Activities:**
- Requirements prioritization using MoSCoW method
- Acceptance criteria definition workshop
- Timeline and constraint discussion
- Risk mitigation planning

#### Wrap-up and Next Steps (4:30-5:00 PM)
**Deliverables Review:**
- Workshop summary and key decisions
- Action item assignments with owners and dates
- Next meeting scheduling
- Follow-up communication plan

### Success Metrics
- Complete current state process map
- Prioritized requirements list with acceptance criteria
- Identified integration points and technical constraints
- Stakeholder buy-in on approach and timeline
- Clear action plan for next phase

### Follow-up Framework
- Workshop summary document (within 2 business days)
- Individual stakeholder follow-up calls (within 1 week)
- Requirements validation review (within 2 weeks)
- Solution design workshop scheduling

This comprehensive approach ensures thorough discovery while maintaining engagement and building consensus for the ServiceNow asset management implementation.`,
    target_tool: 'general',
    language: 'en',
    usage_count: 8,
    rating_sum: 38,
    rating_count: 8,
    created_by: 'system',
    updated_by: 'system'
  }
});

// Version for Solution Architecture Designer
export const version_solution_architecture_v1 = Record({
  $id: Now.ID['version_arch_1_v1'],
  table: 'x_snc_prompt_galle_prompt_version',
  data: {
    prompt: Now.ID['prompt_arch_1'],
    version_number: 1,
    status: 'recommended',
    role_instructions: `You are a ServiceNow certified solution architect with 10+ years of experience designing enterprise solutions across multiple industries. You provide comprehensive architectural blueprints with detailed technical specifications.`,
    prompt_body: `Design a comprehensive ServiceNow solution architecture for {customer_name} based on the provided requirements.

Address these key architectural areas:

**Platform Applications:** Required applications, modules, and plugins
**Integration Points:** External systems, APIs, data flows  
**Data Model Design:** Tables, relationships, and data structure
**Security & Access:** Roles, ACLs, and security policies
**Performance:** Scalability and optimization strategies
**Deployment Strategy:** Phases, rollout plan, change management

Provide a detailed architectural blueprint with diagrams, component specifications, and implementation recommendations.`,
    example_input: `Customer: TechCorp Industries
Requirements: Implement ITSM with integrated asset management, automated workflows for incident/change management, and integration with existing monitoring tools (Nagios, Splunk). Support 500+ users across 3 geographic locations.`,
    example_output: `# ServiceNow Solution Architecture - TechCorp Industries

## Executive Summary
Comprehensive ITSM implementation with integrated asset management for 500+ users across 3 geographic locations.

## Platform Applications & Modules

### Core Applications
- **IT Service Management (ITSM)**: Incident, Problem, Change, Release Management
- **Service Asset and Configuration Management (SACM)**: Asset lifecycle and CMDB
- **Service Catalog**: Self-service portal and request fulfillment
- **Knowledge Management**: Centralized knowledge base

### Additional Modules
- **Service Portal**: Modern user interface
- **Mobile Application**: Field service support
- **Reporting and Analytics**: Operational dashboards

## Integration Architecture

### External System Integrations
1. **Nagios Integration**
   - Method: REST API + MID Server
   - Purpose: Automated incident creation from monitoring alerts
   - Data Flow: Nagios → ServiceNow Events → Incident Management

2. **Splunk Integration**  
   - Method: REST API integration
   - Purpose: Log correlation and advanced analytics
   - Data Flow: ServiceNow → Splunk (incident data) / Splunk → ServiceNow (log insights)

[Continues with detailed architecture...]`,
    target_tool: 'general',
    language: 'en',
    usage_count: 8,
    rating_sum: 35,
    rating_count: 7,
    created_by: 'system',
    updated_by: 'system'
  }
});

// Version for Demo Script Generator
export const version_demo_script_v1 = Record({
  $id: Now.ID['version_demo_1_v1'],
  table: 'x_snc_prompt_galle_prompt_version',
  data: {
    prompt: Now.ID['prompt_demo_1'],
    version_number: 1,
    status: 'recommended',
    role_instructions: `You are a ServiceNow sales engineer expert at creating compelling product demonstrations that drive engagement and showcase business value. You excel at tailoring demos to specific audiences and use cases.`,
    prompt_body: `Create an engaging demo script for the specified audience and use case.

**Demo Structure Framework:**
1. **Business Problem Hook** - Start with a relatable pain point
2. **Solution Walkthrough** - Show ServiceNow features step-by-step  
3. **Value Demonstration** - Highlight key benefits and ROI
4. **Real-world Scenarios** - Include realistic data and examples
5. **Call to Action** - Clear next steps and engagement

**Requirements:**
- Audience: {audience}
- Customer: {customer_name}  
- Focus: {use_case}
- Duration: {duration} minutes

Keep the audience engaged with interactive elements and questions throughout the demo.`,
    example_input: `Audience: IT Directors and Managers
Customer: Regional Bank Corp
Use Case: IT Service Management transformation
Duration: 30`,
    example_output: `# ServiceNow ITSM Demo Script - Regional Bank Corp
**Audience:** IT Directors and Managers | **Duration:** 30 minutes

## Opening Hook (2 minutes)
**Problem Statement:**
"Good morning everyone. Let me start with a question that probably keeps many of you up at night: How much time does your team spend each week just trying to figure out the status of incidents, changes, and service requests? 

In our experience with regional banks like yours, we typically see IT teams spending 40-60% of their time on status updates, manual routing, and chasing approvals instead of focusing on strategic initiatives that drive business value."

**Transition:** "Today, I want to show you how Regional Bank Corp can transform from this reactive, manual approach to a proactive, automated IT service management model."

## Current State Reality Check (3 minutes)
**Scenario Setup:**
"Let me paint a picture of what Monday morning typically looks like for your IT team..."

[Walks through typical chaotic morning scenario]

"Sound familiar? Now let me show you what this same Monday morning looks like with ServiceNow..."

## Solution Demonstration (20 minutes)

### Segment 1: Incident Management (7 minutes)
**Demo Flow:**
1. **Automated Incident Creation** (2 minutes)
   - Show email-to-incident creation
   - Demonstrate automatic categorization and routing
   - Highlight SLA timer activation

**Engagement Question:** "Who currently handles the initial triage of incidents in your organization?"

2. **Intelligent Assignment** (2 minutes)
   - Show assignment rules in action
   - Demonstrate knowledge integration
   - Display real-time dashboards

3. **Collaborative Resolution** (3 minutes)
   - Mobile technician experience
   - Knowledge article usage
   - Automated customer updates

**Value Point:** "Notice how we've eliminated the average 15-minute manual routing time per incident. With your volume of 200+ incidents per month, that's 50+ hours saved monthly."

### Segment 2: Change Management (7 minutes)
**Demo Flow:**
1. **Change Request Automation** (3 minutes)
   - Standard change automation
   - Risk assessment integration
   - Approval workflow demonstration

2. **Impact Analysis** (2 minutes)
   - CMDB visualization
   - Dependency mapping
   - Risk scoring

3. **Deployment Coordination** (2 minutes)
   - Calendar integration
   - Stakeholder notifications
   - Rollback planning

**Engagement Question:** "How many change requests does your team process monthly, and what's your current average approval time?"

### Segment 3: Service Portal & Self-Service (6 minutes)
**Demo Flow:**
1. **Employee Experience** (3 minutes)
   - Service catalog browsing
   - Request submission
   - Status tracking

2. **Manager Experience** (2 minutes)
   - Approval workflows
   - Team dashboards
   - Cost tracking

3. **IT Admin View** (1 minute)
   - Request fulfillment automation
   - SLA monitoring
   - Workload distribution

**Value Point:** "Self-service typically reduces Tier 1 support calls by 30-40%. For an organization your size, that translates to approximately 2 FTE worth of capacity that can be redirected to strategic projects."

## ROI and Value Summary (4 minutes)
**Quantified Benefits for Regional Bank Corp:**
- **Efficiency Gains:** 35% reduction in incident resolution time
- **Cost Savings:** $180K annually in operational efficiency
- **Risk Reduction:** 90% improvement in change success rate
- **User Satisfaction:** 40+ point increase in employee satisfaction scores

**Strategic Value:**
- Enhanced compliance and audit readiness
- Improved business continuity and disaster recovery
- Foundation for digital transformation initiatives
- Scalability for future growth and acquisitions

## Call to Action (1 minute)
**Next Steps:**
"Based on what we've discussed and demonstrated today, I'd like to propose three immediate next steps:

1. **Technical Deep Dive Session** - 2-hour workshop with your technical team to review integration requirements and technical architecture
2. **Pilot Program Planning** - Define a 30-day pilot scope with measurable success criteria
3. **Executive Business Case Review** - Present quantified ROI analysis to your leadership team

Which of these resonates most with your current priorities, and when would be the best time to schedule our next conversation?"

## Demo Tips & Notes
**Interactive Elements:**
- Ask questions every 5-7 minutes to maintain engagement
- Use participant names when possible
- Relate features to their specific pain points mentioned in discovery

**Technical Notes:**
- Have backup scenarios ready if live demo fails
- Prepare for common objections (security, cost, timeline)
- Include competitor comparisons if relevant

**Follow-up Actions:**
- Send demo recording and summary within 24 hours
- Schedule follow-up meeting before ending current call
- Provide relevant case studies and references`,
    target_tool: 'general',
    language: 'en',
    usage_count: 22,
    rating_sum: 98,
    rating_count: 22,
    created_by: 'system',
    updated_by: 'system'
  }
});

// Add versions for more prompts...
// For brevity, I'll add a few more key ones

// Version for Requirements Gathering Assistant
export const version_requirements_v1 = Record({
  $id: Now.ID['version_req_1_v1'],
  table: 'x_snc_prompt_galle_prompt_version',
  data: {
    prompt: Now.ID['prompt_req_1'],
    version_number: 1,
    status: 'recommended',
    role_instructions: `You are a business analyst specialized in ServiceNow requirements gathering. You help create comprehensive requirements documentation that leads to successful implementations.`,
    prompt_body: `Create comprehensive requirements documentation for the specified project.

**Project Context:**
- Project: {project_name}
- Stakeholders: {stakeholder_types}  
- Business Process: {process_name}
- Scope: {project_scope}

**Provide these deliverables:**
1. **Functional Requirements Template** - Detailed functional specifications
2. **Non-functional Requirements Checklist** - Performance, security, usability requirements
3. **Stakeholder Interview Questions** - Targeted questions for different roles
4. **Acceptance Criteria Framework** - Clear, testable acceptance criteria
5. **Requirements Traceability Matrix** - Requirements mapping and tracking
6. **Risk Assessment Questions** - Identify potential project risks

Ensure all requirements are clear, measurable, and testable.`,
    example_input: `Project: Employee Onboarding Automation
Stakeholders: HR Managers, IT Administrators, New Employees, Department Managers
Business Process: Employee Onboarding
Scope: Automate onboarding from offer acceptance through first 90 days`,
    example_output: `# Requirements Documentation: Employee Onboarding Automation

## 1. Functional Requirements Template

### FR-001: Offer Acceptance Integration
**Description:** System must automatically trigger onboarding workflow upon offer acceptance in ATS
**Priority:** High
**Acceptance Criteria:**
- When candidate accepts offer in ATS, onboarding record created within 5 minutes
- All candidate data from ATS transfers accurately to onboarding record
- Hiring manager receives automatic notification of onboarding initiation

### FR-002: Equipment Provisioning Workflow  
**Description:** System must automatically request and track IT equipment based on role
**Priority:** High
**Acceptance Criteria:**
- Equipment requests generated based on job role and location
- IT team receives prioritized work orders for equipment setup
- Delivery tracking and confirmation integrated with workflow

[Continues with detailed functional requirements...]

## 2. Non-functional Requirements Checklist

### Performance Requirements
- [ ] System must handle 50+ concurrent onboarding processes
- [ ] Workflow steps must complete within defined SLAs
- [ ] Dashboard loading time < 3 seconds
- [ ] Mobile access for task completion

### Security Requirements  
- [ ] Role-based access control implementation
- [ ] PII data encryption at rest and in transit
- [ ] Audit logging for all onboarding activities
- [ ] Integration with corporate SSO

### Usability Requirements
- [ ] Intuitive self-service portal for new employees
- [ ] Mobile-responsive design for all user interfaces
- [ ] Contextual help and guidance throughout process
- [ ] Multi-language support (English, Spanish)

## 3. Stakeholder Interview Questions

### HR Managers
- "Walk me through your current onboarding process from offer acceptance to day 90"
- "What are the most common delays or bottlenecks in onboarding?"
- "What metrics do you currently track for onboarding effectiveness?"
- "How do you ensure compliance with regulatory requirements during onboarding?"

### IT Administrators  
- "What equipment and access requests are standard for different roles?"
- "How long does it typically take to provision equipment and accounts?"
- "What systems require integration for user account creation?"
- "What are your security requirements for new user access?"

### Department Managers
- "How involved are you currently in the onboarding process?"
- "What information do you need about new team members before their start date?"
- "How do you prefer to receive notifications about onboarding progress?"
- "What role-specific tasks need to be completed during onboarding?"

### New Employees (Recent Hires)
- "Describe your onboarding experience - what worked well?"
- "What information or resources were you missing during onboarding?"
- "How would you prefer to track your onboarding progress?"
- "What would have made your first week more productive?"

## 4. Acceptance Criteria Framework

### Standard Criteria Template:
**Given** [specific context/condition]
**When** [action is performed]
**Then** [expected outcome]
**And** [additional verification]

### Example:
**Given** a new hire's start date is tomorrow
**When** the onboarding workflow runs its daily check
**Then** reminder notifications are sent to all assigned task owners
**And** the new hire receives a welcome email with first-day instructions

## 5. Requirements Traceability Matrix

| Req ID | Requirement | Business Need | Test Case | Status |
|--------|-------------|---------------|-----------|---------|
| FR-001 | Offer acceptance integration | Reduce manual data entry | TC-001 | Draft |
| FR-002 | Equipment provisioning | Ensure equipment ready on start date | TC-002 | Draft |
| FR-003 | Access management | Secure, timely system access | TC-003 | Draft |

## 6. Risk Assessment Questions

### Process Risks
- What happens if ATS integration fails during offer acceptance?
- How do we handle onboarding for contractors vs. full-time employees?
- What backup processes exist for equipment delays?

### Technical Risks  
- What are the dependencies on external systems (ATS, Active Directory, etc.)?
- How do we ensure data integrity across system integrations?
- What is the fallback plan if ServiceNow is unavailable?

### Organizational Risks
- Are there sufficient resources for change management and user training?
- How will we handle resistance to process changes?
- What compliance or regulatory requirements could impact the solution?

### Timeline Risks
- Are there seasonal hiring patterns that could impact rollout timing?
- What dependencies exist with other ongoing IT projects?
- How will we manage parallel onboarding processes during transition?

## Success Metrics
- Onboarding time reduction: Target 50% decrease in time-to-productivity
- User satisfaction: >4.5/5 rating from new hires
- Compliance: 100% completion of mandatory onboarding tasks
- IT efficiency: 75% reduction in manual equipment provisioning time`,
    target_tool: 'general',
    language: 'en',
    usage_count: 11,
    rating_sum: 49,
    rating_count: 11,
    created_by: 'system',
    updated_by: 'system'
  }
});
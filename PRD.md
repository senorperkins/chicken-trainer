# Chicken Trainer - Product Requirements Document

An internal training tracker and resource library for owner-operators to track employee progression, issue mastery badges, manage schedules, and support shift swaps across multiple tenants.

**Experience Qualities**:
1. **Hospitable** - Warm, welcoming interface that makes training feel supportive rather than bureaucratic
2. **Trustworthy** - Clear audit trails and permissions that ensure data integrity and proper oversight
3. **Efficient** - Quick access to critical actions with minimal friction for daily operations

**Complexity Level**: Complex Application (advanced functionality, accounts)
This is a multi-tenant SaaS platform with sophisticated RBAC, tenant isolation, developer tooling, AI-powered search, schedule management, and comprehensive audit logging. The system supports multiple districts, stores, and role hierarchies with strict data partitioning.

## Essential Features

### Multi-Tenant Architecture with OO Codes
- **Functionality**: Hard tenant partitioning using Owner-Operator Codes; separate Developer Tenant for system administration
- **Purpose**: Allows independent owner-operators to manage their businesses while maintaining strict data isolation
- **Trigger**: User enters OO Code after Google SSO authentication
- **Progression**: Google SSO → Email validation → (If whitelisted) Developer OO Code option → OO Code entry → Tenant context established → Dashboard
- **Success criteria**: Users can only access data within their tenant; Developers can read-only view any tenant in production

### Role-Based Access Control
- **Functionality**: Eight distinct roles (Owner, District Manager, General Manager, Team Lead, Team Member, Trainee, Support, Developer) with hierarchical permissions
- **Purpose**: Ensures proper oversight and prevents unauthorized access to sensitive data
- **Trigger**: Role assigned during user creation
- **Progression**: User authenticated → Role permissions loaded → UI adapts to show only permitted actions → Audit log captures all actions
- **Success criteria**: Users can only perform actions permitted by their role; attempted violations are blocked and logged

### Training Assignment & Completion
- **Functionality**: Supervisors assign training modules to employees; track progress; supervisors sign off on completion
- **Purpose**: Standardizes training processes and maintains records of who verified each completion
- **Trigger**: Supervisor selects employee and training module
- **Progression**: Select employee → Choose training → Set optional due date → Employee receives notification → Employee works through training → Supervisor marks complete with timestamp/signature → Badge eligibility triggered
- **Success criteria**: All completions have supervisor attestation; audit trail shows who, when, and what was completed

### Mastery Badge System
- **Functionality**: Supervisors award non-expiring badges upon training completion to recognize skill mastery
- **Purpose**: Provides visible recognition and tracks employee capabilities
- **Trigger**: Training completion and supervisor decision to award badge
- **Progression**: Training completed → Supervisor reviews evidence → Supervisor awards badge → Employee receives notification → Badge appears on profile
- **Success criteria**: All badges show issuer, timestamp, and related training; badges are permanent unless manually revoked by supervisor

### User Avatar System
- **Functionality**: Deterministic default avatar assignment from "Barnyard Six" pack (3 cows + 3 chickens) on first login; users can change default selection or upload custom avatar
- **Purpose**: Personalization and visual identification throughout the application
- **Trigger**: First successful login (auto-assign); user clicks avatar picker in profile
- **Progression**: (Auto) First login → Hash user ID → Assign deterministic avatar from pack → Store avatar_id and avatar_source='default_pack' → (Manual) Navigate to Profile → Click camera icon → Choose from defaults or upload (max 5MB, PNG/JPEG/SVG) → Preview → Save → Avatar updates throughout app
- **Success criteria**: All users have avatars by default; avatars display consistently in navigation, profile, and future features; upload stays under 5MB; Coach Moo never used as user avatar

### Resource Library with AI Search
- **Functionality**: PDF document repository with metadata tagging, AI-powered search, auto-tagging, and summarization (human review required)
- **Purpose**: Centralized knowledge base accessible to all employees in tenant
- **Trigger**: User searches or browses library; Owner/DM uploads new content
- **Progression**: (Upload) Select PDF → Add metadata → AI suggests tags/summary → Human reviews/approves → Publish → (Search) Enter query → AI semantic search → Results with snippets → Open PDF viewer
- **Success criteria**: Users can find relevant documents in under 30 seconds; AI suggestions are reviewed before use

### Schedule Management & Shift Swaps
- **Functionality**: Store-level schedule viewing; employees can offer shifts or request pickups/swaps; managers approve with overlap prevention
- **Purpose**: Provides flexibility while maintaining coverage and manager oversight
- **Trigger**: Employee views schedule and initiates swap/pickup request
- **Progression**: Employee offers shift → Post to swap pool → Other employee requests → Manager receives in Actions Needed → Manager checks overlap and role fit → Approve/deny → Schedules update → Notifications sent
- **Success criteria**: No scheduling conflicts created; all swaps approved by manager; full audit trail

### Attendance Tracking
- **Functionality**: Team Leads and GMs mark attendance status (present, no-show, call-out, late) with reason codes
- **Purpose**: Track reliability and identify patterns for coaching
- **Trigger**: TL/GM accesses shift roster after shift
- **Progression**: Select shift → Mark attendance for each employee → Add reason if absent → Save → Employee can view own history → Metrics roll up to dashboards
- **Success criteria**: All shifts have attendance recorded; employees can view their own records; patterns visible in analytics

### Private Notes with Upward Visibility
- **Functionality**: Supervisors can add progress, attendance, or general notes visible only to subject employee and their supervisory chain
- **Purpose**: Enable coaching documentation while respecting privacy
- **Trigger**: Supervisor decides to document interaction or observation
- **Progression**: Select employee → Choose note type → Write note → Save → Note visible to employee and all supervisors above → Appears in employee's timeline
- **Success criteria**: Notes are private to intended audience; edit rights limited to author and author's supervisors

### Developer Console & Maintenance Access
- **Functionality**: Developers access system-wide tenant browser, logs, user impersonation, and can accept time-limited maintenance tokens for production writes
- **Purpose**: Enables safe troubleshooting and data fixes without breaking tenant isolation, plus ability to test user experiences
- **Trigger**: Developer logs in with code 8675309; Owner/DM issues maintenance request
- **Progression**: Developer views tenant list → Select user to impersonate → View app as that user → Exit impersonation → Return to developer console → Owner creates maintenance ticket → Developer reviews → Owner issues token with scope/duration → Developer accepts → Performs scoped actions → Token expires → All actions logged
- **Success criteria**: Developers read-only by default in prod; user impersonation allows testing without data changes; all write actions require token; audit log captures every developer action; test user available for safe impersonation testing

### Dashboards & Metrics
- **Functionality**: Role-appropriate dashboards showing KPIs, trends, and actionable insights with drill-down capability
- **Purpose**: Provides visibility into training completion, attendance, swaps, and library usage
- **Trigger**: User navigates to dashboard
- **Progression**: Load dashboard → Display summary tiles → User selects metric → Drill down by district/store/individual → Export to CSV/Excel/PDF
- **Success criteria**: Dashboard loads in under 3 seconds; data accurate to last sync; exports complete in under 10 seconds

## Edge Case Handling
- **Deleted Users**: Assignments, badges, and notes remain with "[Deleted User]" attribution; audit logs preserve original user ID
- **OO Code Conflicts**: System prevents duplicate active codes; deactivated codes cannot be reused for 90 days
- **Cross-Store Employees**: User can have different roles at different stores; system shows aggregate schedule and prevents overlaps
- **Manager Approval Timeout**: Swap requests auto-expire after 48 hours; employee notified
- **Token Expiry Mid-Action**: Developer gets 5-minute warning; action in progress allowed to complete
- **Network Offline**: Queue actions locally; show "Pending Sync" indicator; sync on reconnect
- **Concurrent Schedule Edits**: Last write wins with conflict notification to both editors
- **Large PDF Upload**: Show progress bar; chunk upload; validate file integrity

## Design Direction

The design should feel **hospitable, professional, and energizing** - evoking the welcoming service culture of Chick-fil-A while maintaining efficiency for daily operations. The interface balances **friendly warmth** with **operational precision**, using the Red Apron theme to create an approachable yet trustworthy experience. A **minimal but friendly** interface serves best - clean layouts with purposeful color accents, clear hierarchy, and personality in key moments like badge awards and onboarding.

## Color Selection

**Analogous** - Warm reds to oranges with cream neutrals, creating an inviting hospitality atmosphere.

- **Primary Color**: `oklch(0.58 0.21 22)` (#E51636 - Chick-fil-A Red) - Communicates energy, service excellence, and brand recognition; used for primary actions and navigation
- **Secondary Colors**: 
  - Background: `oklch(0.99 0.01 60)` (#FFF7F3 - Cream) - Soft, warm base that reduces eye strain
  - Card: `oklch(1 0 0)` (White) - Clean surface for content
- **Accent Color**: `oklch(0.25 0 0)` (#333333 - Charcoal) - Professional contrast for text and secondary UI elements
- **Success**: `oklch(0.52 0.14 161)` (#2E8B57 - Sea Green) - Badge awards and positive confirmations
- **Warning**: `oklch(0.74 0.15 70)` (#F4A300 - Amber) - Due dates and pending approvals
- **Foreground/Background Pairings**:
  - Background (Cream #FFF7F3): Charcoal text (#333333) - Ratio 11.8:1 ✓
  - Card (White #FFFFFF): Charcoal text (#333333) - Ratio 12.6:1 ✓
  - Primary (Red #E51636): White text (#FFFFFF) - Ratio 4.7:1 ✓
  - Accent (Charcoal #333333): White text (#FFFFFF) - Ratio 12.6:1 ✓
  - Success (Sea Green #2E8B57): White text (#FFFFFF) - Ratio 4.8:1 ✓
  - Warning (Amber #F4A300): Charcoal text (#333333) - Ratio 8.2:1 ✓

## Font Selection

Fonts should convey **friendly professionalism and approachability** - rounded sans-serifs that feel modern and service-oriented while maintaining excellent readability for operational data.

- **Primary**: Nunito (Google Fonts) - Rounded, friendly sans-serif for headings and emphasis
- **Secondary**: Inter (Google Fonts) - Clean, highly legible for body text and data tables
- **Backup**: system-ui, sans-serif

- **Typographic Hierarchy**:
  - H1 (Page Titles): Nunito Bold/32px/tight letter-spacing
  - H2 (Section Headers): Nunito SemiBold/24px/normal
  - H3 (Card Headers): Nunito SemiBold/18px/normal
  - Body (Content): Inter Regular/16px/1.5 line-height
  - Small (Metadata): Inter Regular/14px/muted color
  - Data (Tables/Metrics): Inter Medium/15px/tabular-nums

## Animations

Animations should feel **warm and reassuring**, reinforcing the sense of progress and accomplishment. Use motion to celebrate milestones (badge awards) and guide attention (new assignments, swap approvals) while keeping core navigation snappy and responsive.

- **Purposeful Meaning**: Badge award uses confetti celebration; name badge flip creates tactile satisfaction; notification entry draws attention without interrupting
- **Hierarchy of Movement**:
  - High importance: Badge awards (500ms celebration), Actions Needed indicator (pulse)
  - Medium importance: Card flips (300ms), page transitions (250ms)
  - Low importance: Hover states (150ms), button press (100ms)

## Component Selection

- **Components**:
  - **Dialog**: Assignment creation, badge awards, swap approvals
  - **Card**: Training modules, employee cards, metric tiles, name badge display
  - **Form** + **Input** + **Label**: All data entry with clear validation
  - **Select** + **Combobox**: Role selection, employee search, district/store filters
  - **Table**: Schedules, assignment lists, audit logs
  - **Tabs**: Dashboard sections (Overview, Training, Schedules, Library)
  - **Badge** (component): Status indicators (Pending, Completed, Due Soon)
  - **Avatar**: User identification throughout UI
  - **Accordion**: FAQ, collapsible schedule details
  - **Alert**: Banner for tenant context, developer mode, sync status
  - **Popover**: Quick actions, context menus
  - **Progress**: Training completion, upload status
  - **Separator**: Visual grouping
  - **Scroll Area**: Long lists, PDF viewer sidebar
  - **Switch**: Toggle settings
  - **Calendar**: Due date selection, schedule viewing

- **Customizations**:
  - **NameBadge** (custom): Digital ID badge with flip animation showing role and quick stats on reverse
  - **PDFViewer** (custom): Embedded viewer with highlight/search integration
  - **TenantBanner** (custom): Persistent header showing active tenant and mode
  - **SwapPoolCard** (custom): Shift details with request/offer actions
  - **BadgeAwardCelebration** (custom): Animated overlay with confetti when badge earned

- **States**:
  - **Buttons**: Default (solid primary red), Hover (darken 5%), Active (darken 10%), Disabled (muted), Loading (spinner)
  - **Inputs**: Default (border gray), Focus (ring primary), Error (border destructive), Success (border success)
  - **Cards**: Default (white), Hover (lift shadow), Selected (border primary), Disabled (muted background)

- **Icon Selection**:
  - **Navigation**: Home (House), Training (GraduationCap), Schedule (Calendar), Library (BookOpen), Profile (User)
  - **Actions**: Add (Plus), Edit (Pencil), Delete (Trash), Save (Check), Cancel (X), Search (MagnifyingGlass)
  - **Status**: Complete (CheckCircle), Pending (Clock), Overdue (Warning), Badge (Award)
  - **Schedule**: Swap (ArrowsLeftRight), Pickup (HandRaising), Offer (Gift)

- **Spacing**:
  - Page padding: 6 (24px)
  - Section gaps: 8 (32px)
  - Card padding: 4-6 (16-24px)
  - Form field gaps: 4 (16px)
  - Button padding: 2.5 4 (10px 16px)

- **Mobile**:
  - Navigation: Refined bottom navigation bar on mobile with curved hump design around centered home button; full-width sidebar with collapse on desktop
  - Device Detection: App detects and displays device type (Mobile/Tablet/Web) on sign-in screen
  - Bottom Bar Design: Half the previous height, full-width red background with no rounded corners, unified body appearance
  - Navigation Buttons: Icon-only (no labels), smaller than home button, with pop-out effect on interaction
  - Home Button: Larger circular button (16px diameter) with elevated positioning creating hump in nav bar
  - Cards: Full-width on mobile, grid on tablet+
  - Tables: Horizontal scroll on mobile, card view option
  - Dialogs: Full-screen on mobile, centered modal on desktop
  - Name badge: Larger touch target on mobile, flip gesture enabled
  - Web vs Mobile: Clear visual distinction - desktop uses sidebar navigation, mobile uses bottom nav bar

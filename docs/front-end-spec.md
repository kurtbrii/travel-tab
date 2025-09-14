# TravelTab MVP Front-End Specification (UX)

Version: 1.0
Owner: UX Expert (Sally)
Scope: Login/Register, Trips List, Create/Edit Trip, Trip Detail with BorderBuddy (Context Form, Chat, Places List)

## 1) Design Principles
- Readability first: Inter for body; Cal Sans/Inter Display for headings; JetBrains Mono for dates/codes.
- Calm trust + forward momentum: Primary Deep Ocean Blue (#1e40af), Secondary Warm Amber (#f59e0b).
- Status colors: Success #059669, Warning #ea580c, Error #dc2626.
- Neutrals: Slate scale (#f8fafc to #0f172a). Aim WCAG AA contrast.
- 8px spacing grid; cards with subtle elevation; visible focus outlines.
- Chat uses OpenAI; no maps integration. Always show disclaimer where content is generated.
- Light/Dark parity with an obvious theme toggle.

## 2) Information Architecture & Routes
- `/` Home (marketing) — existing.
- `/login` — Email + Password.
- `/register` — Full name, Email, Password, Confirm Password.
- `/trips` — Trips List (grid), Add Trip.
- `/trips/:id` — Trip Detail with tabs: Overview (optional for later), BorderBuddy (MVP), Settings (later).

Navigation
- Sticky top `Navbar` with logo (links to home or trips), `ThemeToggle`, auth actions.
- Page content in a centered container `max-w-7xl` with responsive padding.

## 3) Responsive Layout
- Mobile (≤640px): single-column; tabs become horizontally scrollable; modal expands nearly full screen (`max-w-full`, edge padding).
- Tablet (641–1024px): two-column opportunities; trips grid 2 cols; detail page main column + sticky toolbars when feasible.
- Desktop (≥1025px): trips grid 3 cols; detail page: sticky header (summary) + tab content.

## 4) Pages & Flows

### 4.1 Login `/login`
- Form: Email, Password, “Remember me” checkbox, Submit.
- Validation: use existing `loginSchema` (zod). Inline, field-level errors on blur and on submit.
- A11y:
  - Labels associate with inputs; `aria-invalid` and `aria-describedby` for errors.
  - Password toggle has accessible label (Show/Hide password) and `aria-pressed` is not needed (button, not switch).
  - Keyboard: Tab order natural; Enter submits; Escape never traps.
- States: pristine, field-error, submitting (button shows spinner), server-error message, success redirect.
- Visual: Inputs use tokenized focus ring; error borders in Error color; success toast is optional.

### 4.2 Register `/register`
- Form: Full Name, Email, Password, Confirm Password; live checklist of password requirements.
- Validation: `registerSchema` (zod) + confirm matches password.
- A11y:
  - Password requirements have a descriptive `aria-label`; each requirement is read as it turns valid.
  - Confirmation field provides an error with `aria-describedby`.
- States: as Login.

### 4.3 Trips List `/trips`
- Header: “Welcome back, {name}”. Subtext: “Manage your travel plans and compliance requirements”.
- Grid: cards of trips; 1 col mobile, 2 col md, 3 col lg. Reorderable with dnd-kit (already present). Persist order locally.
- Add Trip Card: opens Add Trip modal.
- Trip Card Content:
  - Title, Destination, Dates, Status badge, Active Modules chips.
  - Click navigates to Trip Detail.
- A11y:
  - Cards are focusable buttons with `aria-label` describing action.
  - Drag-and-drop provides keyboard sensors; ensure focus visibility on drag handles (or whole card). Maintain a non-drag keyboard reordering affordance (Up/Down with modifier where possible).
- Empty State: show illustration/text and a primary CTA to Add Trip.
- Loading: skeleton cards (already present).

### 4.4 Create/Edit Trip

Pattern: Modal (centered) with header, body, footer.
- Create: launched from Add Trip card/button.
- Edit: launched from Trip Detail header “Edit Trip” button (same form, prefilled). For MVP, modal is sufficient; drawer optional later.

Form Fields (use `FormField` component where applicable):
- Title: text, min 10 chars.
- Destination: text, min 3 chars.
- Start Date: date; min today; if > End Date, clear End Date.
- End Date: date; min Start Date (if present) else today.

Validation
- Existing `tripSchema` (zod) with end-after-start refinement.
- Show errors only for touched fields; update on blur or submit.

A11y for Modal
- `role="dialog"` and `aria-modal="true"`.
- On open: focus the first invalid field, else first field.
- Trap focus within dialog; Escape closes; clicking backdrop closes (with warning for unsaved changes in later iterations).
- Ensure scroll locking and body overflow handling (present in implementation).

Footer Actions
- Primary: Save (Create/Update). Disabled until the form validates.
- Secondary: Cancel (closes). Keyboard accessible.

### 4.5 Trip Detail `/trips/:id`

Layout
- Sticky Header (card):
  - Left: Title, Destination, Dates, Status badge.
  - Right: Actions: Edit Trip, Export (later), More (later).
- Tabs below header: BorderBuddy (default), [Overview later].
- Content: card canvas with consistent padding and section spacing.

## 5) BorderBuddy Tab (MVP Content)
Includes three sections. Use nested sub-tabs or segmented control to switch between: Context, Chat, Places.

Shared Header (inside BorderBuddy)
- Title: “BorderBuddy for {Destination}”
- Subtext: “Based on your profile and trip details. Generated locally.”
- Metadata: Last updated timestamp; disclaimer link “Verify with official sources.”
- Actions: Regenerate (deterministic), Copy, Print/Export (optional later).

### 5.1 Chat
- Goal: Ask clarifying questions; responses from OpenAI using trip + context.
- UI:
  - Messages list: bubbles grouped by author, time stamps in monospace; role colors subtle (user = neutral, assistant = primary-tinted background).
  - Composer: multiline textarea with send button; Enter to send, Shift+Enter newline.
  - Controls: Regenerate last, Clear conversation (with confirm), Seed indicator (optional badge to reinforce determinism).
- A11y:
  - Live region `aria-live="polite"` for new assistant messages.
  - Buttons labeled; composer has label and character count (optional).
  - Keyboard: Up arrow recalls last user message (optional), Tab cycles Send/Regenerate.
- States: empty (prompt suggestions), generating (spinner on send), error (retry), long content collapsible with “Show more”.

### 5.2 Context Form
- Goal: Capture preferences to prime prompts.
- Fields: Interests (chips), Regions/Cities (free text chips), Budget (low/mid/high), Travel Style (fast/balanced/slow), Constraints (chips).
- UX: Inline validation; editable anytime; save debounced.

### 5.3 Places List
- Goal: Simple, text-only recommendations. No maps.
- UX: List of items: name + short description; optional tags. "Regenerate" button to refresh.

<!-- Q&A thread intentionally omitted in MVP per product pivot -->

## 6) Components & Tokens

Reuse existing components and add minimal new ones.

Existing
- `Navbar`, `ThemeToggle`, `StatusBadge`, `FormField`, `Button`, `TripsGrid`, `TripCard`, `AddTripModal`, `AddTripForm`.

New (to add)
- Tabs: keyboard accessible, roving tab index, `role="tablist"`/`tab`/`tabpanel`.
- SegmentedControl (optional) to switch BorderBuddy sub-sections on mobile.
- ChatMessage: bubble, avatar optional, timestamp (mono), copy button.
- ChatComposer: textarea with send/regenerate, character count optional.
- MarkdownContent: safe renderer with headings/lists/tables and code blocks styled via `font-mono`.
- ChecklistItem: checkbox row with due chip; emits change events.
- Progress: thin bar using `.progress-success/.progress-warning` tokens.
- EmptyState: icon + title + CTA.

Design Tokens (already configured in Tailwind/globals.css)
- Colors: `primary`, `secondary`, `success`, `warning`, `error`, `background`, `foreground`, `muted`, `accent`, `border`, `input`, `ring`.
- Shadows: `shadow-card` for cards; stronger in dark mode.
- Typography: `.h1/.h2/.h3` use display font; body uses Inter; timestamps/keys use `font-mono`.

## 7) Accessibility (WCAG AA targets)
- Color contrast: ensure ≥ 4.5:1 for text; avoid amber on white for long text; use darker text for amber backgrounds.
- Focus: always visible with ring; do not remove default outlines without replacement. Use `focus-visible` for precise control.
- Keyboard: All interactive elements reachable in logical order; modals trap focus; Esc closes; Enter submits; Space toggles checkboxes; arrow keys for tabs.
- Semantics: use appropriate roles (`dialog`, `tablist`, `tabpanel`, `status`/`alert` for async ops, `aria-live` for chat).
- Labels: explicit `<label>` for inputs; `aria-describedby` links errors/help; icons are decorative unless meaning-bearing (`aria-hidden="true"`).
- Motion: keep transitions subtle; respect `prefers-reduced-motion` where feasible.

## 8) States, Errors, and Empty Patterns
- Loading: skeletons for cards/lists; spinner for async generation.
- Empty: helpful copy with CTA (e.g., “No messages yet. Try asking for local highlights or tips.”).
- Error: concise message with retry; do not block navigation.
- Offline: present purely local content; hide network-dependent affordances (not needed for MVP; no external calls).

## 9) Theming: Light/Dark
- Use CSS variables in `globals.css` and classes like `bg-background`, `text-foreground`, tokens for status.
- Dark mode adjusts brand shades for contrast (already defined). Verify focus rings remain visible in both themes.

## 10) Acceptance Criteria (UI)
- Forms: Inline, field-level validation with clear messages; keyboard and screen reader friendly.
- Trips grid: Reorder persists locally; keyboard reordering works; visible focus on active card.
- Create/Edit modal: Trap focus; Esc and backdrop close; Save disabled unless valid; visible errors.
- Trip Detail: BorderBuddy tab with sub-tabs for Context, Chat, Places; each supports empty/loading/error; Places supports Regenerate.
- Focus and contrast verified across light/dark.

## 11) Visual Notes
- Cards: rounded-2xl, subtle shadow, content spacing `p-6`.
- Chips/pills: use `bg-primary/10 text-primary` or status equivalents.
<!-- No checklist in MVP; progress bar guidance removed. -->
- Date/time text: use `font-mono` for clarity.

## 12) Copy Guidelines
- Tone: neutral, clear, helpful.
- Avoid jargon; explain requirements succinctly.
- Always timestamp generated outputs and add: “Generated locally based on trip details. Verify with official sources.”

## 13) Technical Handoff Notes
- Add route `/trips/[id]/page.tsx` with BorderBuddy sub-tabs.
- Reuse `FormField` in Edit Trip form; share `tripSchema`.
- Add minimal `Tabs` and `MarkdownContent` components in `src/components/ui/` to support BorderBuddy.
- Persist UI-only state (chat draft input, selected tabs) in localStorage under namespaced keys per trip.

---
End of spec.

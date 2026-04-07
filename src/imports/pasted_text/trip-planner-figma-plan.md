AI Travel Agent — Figma Make Implementation Plan
Product Owner Description | Version 1.0 | Trip Planner
---
1. PRODUCT VISION & NORTH STAR
Product Name: TripMind — Your AI Travel Agent  
Tagline: "Tell me where. I'll handle everything else."  
Target User: Business professionals who travel frequently and value time above all else.  
Core Promise: A single screen where the user describes a trip in natural language, and a visible, narrating AI agent handles every step — transparently, in real time.
What makes this product unforgettable:  
The AI narrates its own thinking like a trusted travel EA speaking to you. It doesn't just show status dots — it explains decisions, flags trade-offs, and asks smart questions. The user always knows exactly what the agent is doing and why.
---
2. DESIGN PRINCIPLES
Principle	What It Means in UI
Radical Transparency	Every agent action has a natural language explanation card
Progressive Disclosure	Show high-level status first; tap to expand detail
Approval Gates	Agent always pauses before spending money or booking anything
Graceful Interruption	Agent can be paused, corrected, or redirected at any step
Mobile-First	Designed for one thumb, portrait mode, on the go
---
3. DESIGN LANGUAGE (For Figma Make)
3.1 Visual Identity
Aesthetic: Premium, calm, trust-inspiring. Think Bloomberg Terminal meets Headspace. Dark base (#0D1117) with warm amber accents (#F5A623) and cool teal highlights (#00C9A7).
Typography:
Display/Heading: Syne (bold, geometric, authoritative)
Body/Narration: DM Sans (warm, readable, conversational)
Monospace (times/timestamps): JetBrains Mono
Iconography: Rounded line icons (Phosphor or Lucide). Never filled icons in active states — use accent color outlines instead.
Motion Philosophy: The agent's narration text should typewriter-animate in. Cards should slide up from below (spring physics). Status transitions: fade + scale. Nothing should flash or feel jarring — the user is trusting this thing with real money.
3.2 Color Tokens
```
--bg-primary:       #0D1117   (main background)
--bg-surface:       #161B22   (cards, sheets)
--bg-elevated:      #21262D   (input fields, chips)
--accent-amber:     #F5A623   (CTAs, active agent step)
--accent-teal:      #00C9A7   (success, completed steps)
--accent-red:       #FF5C5C   (warnings, delays, cancellations)
--text-primary:     #F0F6FC   (main text)
--text-secondary:   #8B949E   (subtitles, metadata)
--text-narration:   #CDD5E0   (agent narration text — softer white)
--border-subtle:    #30363D   (dividers, card borders)
```
3.3 Component Library to Build in Figma
Component	Description
`AgentNarrationBubble`	The core card — avatar left, animated text right, timestamp
`StepStatusPill`	Inline pill: Pending / In Progress / Done / Failed
`ApprovalCard`	Full-bleed card with options to Accept / Modify / Reject
`FlightOptionCard`	Flight card: airline logo, time, stops, price, carbon tag
`CabBookingCard`	Cab card: type, ETA, fare estimate, driver info placeholder
`ItineraryTimeline`	Vertical timeline of the full day with times
`ExpenseSummarySheet`	Bottom sheet: itemized cost breakdown
`AlertBanner`	Sticky top banner for delays / disruptions
`TripInputBar`	Bottom input bar: text field + mic button + send
`ProgressRail`	Horizontal 8-step progress indicator at top
`CalendarPreview`	Mini calendar card showing booked slot
`ReminderToast`	Push-style toast that appears on travel day
---
4. APP ARCHITECTURE — SCREENS & FLOWS
Screen Map
```
App Launch
    └── Home / Dashboard
            ├── New Trip → Trip Intent Screen
            │       └── Agent Activation → Agent Live Screen (CORE)
            │               ├── Step 1: Calendar Check
            │               ├── Step 2: Flight Search
            │               ├── Step 3: Flight Options → [APPROVAL GATE]
            │               ├── Step 4: Flight Booked
            │               ├── Step 5: Cab Booking → [APPROVAL GATE]
            │               ├── Step 6: Itinerary Built
            │               ├── Step 7: Calendar Added
            │               ├── Step 8: Expense Summary → [APPROVAL GATE]
            │               └── Trip Confirmed Screen
            ├── My Trips → Trip Detail Screen
            └── Settings → Integrations / Preferences
```
---
5. SCREEN-BY-SCREEN SPECIFICATION
---
SCREEN 1: HOME / DASHBOARD
Purpose: Entry point. Shows upcoming trips and quick-start prompt.
Layout:
Top: App logo left, notification bell + profile avatar right
Hero section: Greeting ("Good morning, Arjun") + current date
Quick prompt card: Large rounded input area — "Where are you headed?" with mic icon
Below: "Upcoming Trips" horizontal scroll cards
Bottom nav: Home | My Trips | Settings
Figma Make Notes:
The input card should have a subtle pulsing glow animation on idle to invite interaction
Upcoming trip cards use `FlightOptionCard` variant (compact)
---
SCREEN 2: TRIP INTENT SCREEN
Purpose: User describes the trip. Agent extracts intent.
Layout:
Full screen, dark background
Top: Back arrow + "New Trip" title
Center: Large conversational text input (multiline)
Pre-filled example text in ghost style: "I have a meeting in Mumbai on the 15th. Morning flight, back same evening."
Smart chips below input: [Mumbai] [Apr 15] [Morning Flight] [Same Day Return] — auto-extracted, tappable to edit
Bottom: "Let TripMind plan this →" primary CTA button (amber, full width)
Voice input button: floating mic, bottom right
Figma Make Notes:
Chips animate in one by one as user types (staggered slide-in)
CTA button is disabled until at least destination + date chips are present
---
SCREEN 3: AGENT LIVE SCREEN (The Core Experience)
Purpose: The central screen where the agent narrates and executes the entire trip planning. User stays on this screen through all 8 agent steps.
3A. Layout Structure
```
┌─────────────────────────────────┐
│  ← Back    TripMind Agent  ⚙️   │  ← Top Bar
│  [■■■■■□□□] Step 3 of 8        │  ← ProgressRail
├─────────────────────────────────┤
│                                 │
│   AGENT NARRATION FEED          │  ← Scrollable feed (grows downward)
│   (AgentNarrationBubbles)       │
│                                 │
├─────────────────────────────────┤
│  CURRENT ACTION CARD            │  ← Sticky bottom card (context-aware)
│  (FlightOptionCard /            │
│   ApprovalCard / StatusCard)    │
├─────────────────────────────────┤
│  [Ask me anything...]   🎤  ➤  │  ← TripInputBar
└─────────────────────────────────┘
```
3B. Agent Narration Feed — Detailed Spec
Each agent action produces an `AgentNarrationBubble`. These stack chronologically.
AgentNarrationBubble anatomy:
```
┌──────────────────────────────────────────┐
│ 🤖  [TripMind]              10:42 AM     │
│                                          │
│  "Let me start by checking your Google   │
│   Calendar for April 15th to make sure   │
│   there are no conflicts before I search │
│   for flights..."                        │
│                                          │
│  [ ● Checking Google Calendar... ]       │  ← inline status pill
└──────────────────────────────────────────┘
```
Avatar: Small animated TripMind logo (subtle breathing animation while active)
Text: Typewriter animation, ~40ms per character
Status pill updates in real time
Completed bubbles: teal checkmark replaces status pill
3C. Step-by-Step Agent Narration Scripts + UI States
---
STEP 1 — Calendar Check
Narration (typewriter):
> "First things first — let me peek at your Google Calendar for April 15th. I want to make sure we pick flights that don't clash with your meeting time and that I can add your trip back without conflicts."
UI State: Progress rail step 1 glows amber. Calendar API call animation (spinning calendar icon).
Outcome Card: Mini calendar preview showing April 15 with "Team Meeting: 2:00 PM – 4:00 PM" highlighted. Agent notes: "Your meeting is at 2 PM. I'll target a morning arrival in Mumbai before 11 AM and evening return after 5 PM."
---
STEP 2 — Flight Search
Narration:
> "Now I'm searching for morning flights from Kochi (COK) to Mumbai (BOM) on April 15th. I'm filtering for departures between 5 AM and 9 AM so you land with enough buffer before your 2 PM meeting. I'm checking IndiGo, Air India, and Vistara via MakeMyTrip."
UI State: Three airline logos animate in. Loading shimmer on results area.
---
STEP 3 — Flight Options → APPROVAL GATE
Narration:
> "Great news — I found 3 solid options. I'd recommend the 6:20 AM IndiGo flight. It gets you to Mumbai by 8:10 AM, giving you nearly 6 hours before your meeting. The fare is ₹4,850 and it's non-stop. Want me to go with this, or would you prefer a different option?"
UI State: APPROVAL GATE — agent pauses. Progress rail step 3 pulses amber with a "Waiting for you" label.
Current Action Card becomes: `FlightOptionCard` × 3 (swipeable carousel)
Each card shows:
Airline logo + name
Departure → Arrival time
Duration
Non-stop / 1 stop badge
Price (₹)
"Why I recommend this" expandable chip (agent reasoning)
[Select This Flight] button
Bottom: "Modify preferences" text link
---
STEP 4 — Flight Booked
Narration (after user taps Select):
> "Perfect choice. I'm booking the 6:20 AM IndiGo flight (6E-342) right now via MakeMyTrip. Applying your saved payment method — HDFC Visa ending in 4821. This will take about 10 seconds..."
UI State: Booking animation (plane taking off, progress bar). Then:
> "Done! ✅ Your flight is confirmed. PNR: XY7K29. Confirmation sent to your email. Seats 14A assigned — window seat as per your preference."
Outcome Card: Compact confirmed ticket card with PNR, QR code placeholder, and "View E-ticket" link.
---
STEP 5 — Cab Booking → APPROVAL GATE
Narration:
> "Now let me sort your ground transport. You land at T2 at 8:10 AM. I'm adding a 20-minute buffer for deplaning and baggage (you're traveling light, so 15 min is probably enough, but I'd rather be safe). I'll book a cab for 8:30 AM pickup from T2 Arrivals."
> "For the return, your meeting ends at 4 PM. The venue is BKC. BOM is about 45 min away in evening traffic — I'm recommending a 5:00 PM cab to catch your 7:15 PM return flight. That's a 2-hour 15-minute buffer. Comfortable."
UI State: APPROVAL GATE — dual cab cards shown (Arrival cab + Departure cab).
`CabBookingCard` shows:
Cab type (Sedan / SUV)
Pickup time + location
Drop location
Estimated fare
Estimated travel time
Source app (Uber / Ola — integrated)
[Confirm Both Cabs] / [Modify]
---
STEP 6 — Itinerary Built
Narration:
> "Your full day is taking shape. Here's how April 15th looks — I've built a detailed itinerary with buffers baked in. Everything is synced to your preferences."
UI State: `ItineraryTimeline` slides up — full vertical timeline:
```
04:45 AM  🔔 Wake-up reminder (auto-set)
05:20 AM  🚕 Cab to COK Airport (30 min)
06:00 AM  ✈️  Arrive COK — Check-in opens
06:20 AM  ✈️  Flight 6E-342 departs
08:10 AM  🛬  Land BOM T2
08:30 AM  🚕  Cab pickup — BOM T2 Arrivals
09:30 AM  📍  Arrive at meeting venue (BKC)
            [Buffer: 4.5 hrs before meeting]
02:00 PM  💼  Meeting begins
04:00 PM  💼  Meeting ends
05:00 PM  🚕  Cab to BOM T2
05:45 PM  ✈️  Arrive BOM — Security/Check-in
07:15 PM  ✈️  Return flight departs
09:00 PM  🛬  Land COK
```
Tap any item to see agent reasoning for that time slot.
---
STEP 7 — Calendar Sync
Narration:
> "I'm adding all of this to your Google Calendar now — the flights, both cab pickups, and I've blocked your full day as 'Travel: Mumbai'. I've also set 3 reminders: the night before, 2 hours before cab, and 30 minutes before cab."
UI State: `CalendarPreview` card shows April 15 with all events populated. Green checkmarks animate in.
---
STEP 8 — Expense Summary → APPROVAL GATE
Narration:
> "Here's your complete trip cost breakdown before I close out. Total estimated spend is ₹9,340. Your company travel policy allows ₹15,000 for a same-day Mumbai trip, so you're well within budget. Shall I submit this for pre-approval to your manager?"
UI State: APPROVAL GATE — `ExpenseSummarySheet` (bottom sheet):
```
TRIP EXPENSE SUMMARY — Apr 15

✈️  Flight (COK → BOM, 6E-342)    ₹4,850
✈️  Return Flight (BOM → COK)      ₹3,200
🚕  Cab — BOM Arrival              ₹  650
🚕  Cab — BOM to Airport           ₹  640
─────────────────────────────────────────
TOTAL                              ₹9,340

Policy limit: ₹15,000 ✅ Within budget

[ Submit for Pre-Approval ]   [ Skip ]
```
---
SCREEN 4: TRIP CONFIRMED
Purpose: The "done" state. Beautiful, satisfying confirmation.
Layout:
Subtle confetti animation (restrained, 2 seconds only)
Large checkmark icon (teal, animated draw)
"Mumbai Trip — April 15 is all set."
Summary strip: DEP 6:20 AM | RTN 7:15 PM | ₹9,340
Three action buttons:
[View Full Itinerary]
[View E-tickets]
[Share Itinerary]
Bottom: "I'll remind you tomorrow evening and on travel morning."
---
SCREEN 5: TRAVEL DAY — SMART REMINDERS
These appear as push notifications + in-app toasts on April 14th evening and April 15th morning:
Night before (April 14, 9 PM):
> "Your Mumbai trip is tomorrow. Wake up by 4:45 AM. I'll remind you again at 4:45 AM. Your cab is booked for 5:20 AM. Flight check-in is open — want me to check you in now?"
Morning of (April 15, 4:45 AM):
> "Good morning! Time to get ready. Your cab arrives in 35 minutes. Weather in Mumbai today: 31°C, partly cloudy. Cabin baggage only — no check-in needed."
Pre-cab (April 15, 5:10 AM):
> "Your cab is 10 minutes away. Driver: Ramesh, Maruti Swift, KL-07-AB-1234. Track live in the app."
`ReminderToast` component overlays on top of any screen. Dismissible. Has "Got it" and "Details" actions.
---
SCREEN 6: DISRUPTION HANDLING — FLIGHT DELAYED
Purpose: Agent detects a delay and proactively re-plans.
Trigger: Flight status API detects delay.
`AlertBanner` appears (red, sticky top):
> "⚠️ Your 6:20 AM flight is delayed by 90 minutes. New departure: 7:50 AM. New arrival: 9:40 AM. I'm re-checking your day..."
Agent Narration resumes:
> "The delay means you'll now arrive in Mumbai at 9:40 AM instead of 8:10 AM. With the 30-minute cab ride to BKC, you'd reach the venue at ~10:45 AM — still 3 hours before your 2 PM meeting. You're fine. But let me push your arrival cab pickup to 10:00 AM."
> "Done. Cab rescheduled to 10:00 AM. I've also notified your meeting host that you're delayed but on track."
Bottom options: [View Updated Itinerary] | [Change Departure Time] | [Cancel Trip]
---
6. NAVIGATION & INTERACTION MODEL
Bottom Navigation (4 tabs)
Tab	Icon	Screen
Home	House	Dashboard
Trips	Suitcase	My Trips list
Agent	Sparkle (animated)	Active agent session
Settings	Gear	Preferences & integrations
Gesture System
Swipe left on FlightOptionCard → dismiss / next option
Swipe up on any step bubble → expand details / reasoning
Long press on itinerary item → edit / remove
Swipe down on Agent Live Screen → minimize to floating pip (trip continues in background)
Floating Agent PiP (Picture-in-Picture)
When minimized: A small pill at top of screen shows "TripMind working… Step 4 of 8" with a pulse animation. Tap to re-expand.
---
7. INTEGRATIONS ARCHITECTURE (For Dev Handoff Context)
Integration	Purpose	API Partner
Google Calendar	Read meetings, write trip events	Google Calendar API
MakeMyTrip	Flight search + booking	MMT Partner API
Uber / Ola	Cab booking	Uber for Business / Ola Corporate API
Gmail	Send confirmations, e-tickets	Gmail API
Flight Status	Real-time delay detection	FlightAware / AviationStack
Expense Tools	Pre-approval submission	Concur / Zoho Expense API
Payment	Auto-pay saved cards	Razorpay / Saved cards vault
Note for UI Design: Every integration should show its source logo inline when the agent uses it. E.g., when checking calendar, show Google Calendar icon. When booking flight, show MakeMyTrip logo. This builds trust and transparency.
---
8. APPROVAL GATES — UX SPECIFICATION
There are 3 mandatory approval gates where the agent must pause and get explicit user confirmation before proceeding. These are non-negotiable UX requirements.
Gate	Trigger	What user approves
Gate 1	Flight options ready	Select specific flight + price
Gate 2	Cab plan ready	Confirm both cab bookings
Gate 3	Expense summary	Total spend + pre-approval submission
Approval Card Design Rules:
Full-width card, elevated surface
Amber left border (3px) to signal "needs attention"
Clear price/commitment displayed prominently
Primary action: Amber fill button
Secondary: Ghost button ("Modify" or "Skip")
Agent avatar shows "waiting" state — subtle slow blink
Progress rail pauses (amber pulse on current step)
---
9. ACCESSIBILITY REQUIREMENTS
All tap targets: minimum 48×48pt
Agent narration text: minimum 16pt, line-height 1.6
Color contrast: all text passes WCAG AA (4.5:1 minimum)
Voice input available on every screen (mic button)
All status changes announced via accessibility labels (for screen readers)
Reduced-motion mode: replace animations with instant transitions
---
10. EMPTY & ERROR STATES
State	Screen	UI Treatment
No trips yet	Home	Illustrated empty state + "Plan your first trip" CTA
Calendar read failed	Agent Step 1	Agent narrates: "I couldn't access your calendar. You can grant permission or tell me your meeting time manually."
No flights found	Agent Step 2	Agent: "No morning flights available on that date. Want me to check the next morning or a different time window?"
Payment failed	Booking	Alert banner + "Try another payment method" sheet
Flight fully cancelled	Travel day	Full-screen disruption view with re-booking options
---
11. FIGMA FILE STRUCTURE RECOMMENDATION
```
TripMind Design System
├── 🎨 Foundations
│   ├── Colors (tokens)
│   ├── Typography scale
│   ├── Spacing & grid (8pt system)
│   └── Elevation / shadows
├── 🧩 Components
│   ├── AgentNarrationBubble
│   ├── StepStatusPill
│   ├── ApprovalCard
│   ├── FlightOptionCard
│   ├── CabBookingCard
│   ├── ItineraryTimeline
│   ├── ExpenseSummarySheet
│   ├── AlertBanner
│   ├── ReminderToast
│   ├── TripInputBar
│   ├── ProgressRail
│   └── CalendarPreview
├── 📱 Screens
│   ├── 01 – Home Dashboard
│   ├── 02 – Trip Intent Input
│   ├── 03A – Agent Live: Steps 1-2
│   ├── 03B – Agent Live: Gate 1 (Flights)
│   ├── 03C – Agent Live: Steps 4-5
│   ├── 03D – Agent Live: Gate 2 (Cabs)
│   ├── 03E – Agent Live: Steps 6-7
│   ├── 03F – Agent Live: Gate 3 (Expense)
│   ├── 04 – Trip Confirmed
│   ├── 05A – Reminder Toast: Night Before
│   ├── 05B – Reminder Toast: Morning Of
│   ├── 06 – Disruption / Flight Delayed
│   └── 07 – My Trips List
└── 🔄 Prototype Flows
    ├── Happy Path (full 8-step)
    ├── Approval modification flow
    └── Disruption / delay flow
```
---
12. PROTOTYPE INTERACTIONS FOR FIGMA
Interaction	Trigger	Animation
Narration bubble appears	Step start	Slide up + fade, 300ms ease-out
Text typewriter effect	On appear	Custom text reveal, 40ms/char
Status pill: pending → active	Step start	Color + icon crossfade, 200ms
Status pill: active → done	Step complete	Scale bounce + teal color, 400ms
Progress rail advances	Step complete	Segment fill left→right, 500ms
ApprovalCard entrance	Gate trigger	Slide up from bottom, spring
Flight carousel swipe	User gesture	1:1 drag with snap
Itinerary timeline reveal	Step 6 complete	Staggered item slide-in, 80ms delay
Alert banner entrance	Delay detected	Drop from top, red flash, 400ms
Floating PiP	Minimize	Scale to pill, top-right, 350ms
---
13. FIGMA MAKE PROMPT (Ready to Use)
> **"Design a premium dark-mode mobile app called TripMind — an AI travel agent for business professionals. The core screen is an Agent Live Screen where an AI narrates every step of planning a one-day business trip in natural language, using a chat-feed of cards called AgentNarrationBubbles. The agent walks through 8 steps: calendar check, flight search, flight selection (approval gate), booking confirmation, cab booking (approval gate), itinerary building, calendar sync, and expense summary (approval gate). Use a dark base (#0D1117), amber accent (#F5A623), teal success color (#00C9A7), Syne for headings and DM Sans for body text. Components needed: AgentNarrationBubble, FlightOptionCard (swipeable carousel), ApprovalCard (amber left border), ItineraryTimeline (vertical, full-day), ExpenseSummarySheet (bottom sheet), AlertBanner (disruption), ReminderToast, ProgressRail (8-step top bar), and TripInputBar (bottom). Design for iPhone 14 Pro frame. The visual tone is premium fintech meets travel concierge — calm, trustworthy, and elegant. Every agent action card must show which integration it's using (Google Calendar logo, MakeMyTrip logo, Uber logo). Include prototype connections for the full happy path and the flight delay disruption flow."**
---
Document prepared for Figma Make handoff.  
Version 1.0 — April 2026
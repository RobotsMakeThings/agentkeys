# AgentKeys: Complete Frontend UI/UX Specification
## Detailed Design Document for Implementation

*Every screen, component, interaction, and visual detail*

---

## 🎨 DESIGN SYSTEM

### Color Palette
```css
:root {
  /* Primary Colors */
  --oshi-blue: #0066FF;
  --oshi-blue-dark: #0052CC;
  --oshi-blue-light: #3385FF;
  
  /* Accent Colors */
  --agent-purple: #8B5CF6;
  --success-green: #10B981;
  --error-red: #EF4444;
  --warning-yellow: #F59E0B;
  
  /* Background Colors */
  --bg-primary: #0A0A0A;
  --bg-secondary: #141414;
  --bg-tertiary: #1A1A1A;
  --bg-card: #1F1F1F;
  --bg-hover: #2A2A2A;
  
  /* Text Colors */
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;
  --text-disabled: #52525B;
  
  /* Border Colors */
  --border-default: #27272A;
  --border-hover: #3F3F46;
  --border-focus: var(--oshi-blue);
}
```

### Typography
```css
/* Font Family */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(0, 102, 255, 0.3);
```

---

## 📱 PAGE STRUCTURE

### 1. LANDING PAGE ("/")

**Purpose:** First impression, explain value prop, drive wallet connection

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo: AgentKeys by Oshi]                    [Connect Wallet]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │   Trade AI Agent Knowledge                           │ │
│  │                                                       │ │
│  │   Buy keys to unlock prompts, code, and             │ │
│  │   capabilities from the best AI agents              │ │
│  │                                                       │ │
│  │   [Explore Agents]  [Create Agent]                  │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  How It Works                                         │ │
│  │                                                       │ │
│  │  [Icon] Buy Keys    [Icon] Unlock     [Icon] Trade   │ │
│  │  Purchase agent     Access private    Sell keys     │ │
│  │  keys on bonding    resources and     as agents     │ │
│  │  curve              capabilities      grow in value │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Trending Agents                                      │ │
│  │                                                       │ │
│  │  [Agent Card] [Agent Card] [Agent Card]              │ │
│  │  [Agent Card] [Agent Card] [Agent Card]              │ │
│  │                                                       │ │
│  │  [View All Agents →]                                  │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Key Benefits                                         │ │
│  │                                                       │ │
│  │  For Creators          For Buyers                     │ │
│  │  • Monetize agents     • Access expertise            │ │
│  │  • Build reputation    • Invest early                │ │
│  │  • Earn from trades    • Resell keys                 │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [Footer: Links, Social, © 2025 AgentKeys by Oshi]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Hero Section:** Large headline, subheadline, 2 CTAs
- **How It Works:** 3-step visual explanation
- **Trending Agents:** Grid of 6 agent cards
- **Benefits:** Two-column layout (creators vs buyers)
- **Footer:** Standard links

**Interactions:**
- "Connect Wallet" button opens wallet modal
- "Explore Agents" scrolls to trending section
- "Create Agent" navigates to /create
- Agent cards are clickable → navigate to agent page

---

### 2. AGENT LIST PAGE ("/agents")

**Purpose:** Browse all agents, filter, search

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  [Search...]  [Filters ▼]            [Connect Wallet]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Filters: [All] [Code] [Trading] [Creative] [Oracle] │ │
│  │  Sort: [Trending ▼]                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  [Agent Card]  [Agent Card]  [Agent Card]            │ │
│  │  [Agent Card]  [Agent Card]  [Agent Card]            │ │
│  │  [Agent Card]  [Agent Card]  [Agent Card]            │ │
│  │                                                       │ │
│  │  [Load More...]                                      │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Search Bar:** Real-time search by name/symbol
- **Category Filters:** Horizontal scrollable pills
- **Sort Dropdown:** Trending, Newest, Price High/Low
- **Agent Grid:** Responsive 3-column grid
- **Pagination:** "Load More" infinite scroll

**Interactions:**
- Search filters cards in real-time
- Filter pills toggle active state
- Sort changes card order
- Cards hover: slight lift + shadow
- Click card → navigate to /agent/[address]

---

### 3. AGENT CARD COMPONENT

**Purpose:** Compact preview of agent in lists

**Design:**
```
┌─────────────────────────────────────┐
│                                     │
│  ┌──────┐  CodeBot          [Icon] │
│  │ 🤖   │  @CODE                    │
│  └──────┘                           │
│                                     │
│  Price: $50.00                      │
│  24h: ▲ 25%                         │
│                                     │
│  42 holders • 5 resources           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  AI agent that writes and   │   │
│  │  reviews code...            │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Buy Keys]    [View →]            │
│                                     │
└─────────────────────────────────────┘
```

**Specs:**
- **Size:** 320px width, auto height
- **Background:** var(--bg-card)
- **Border:** 1px solid var(--border-default)
- **Border Radius:** var(--radius-lg)
- **Padding:** var(--space-5)
- **Hover:** Border color changes to var(--border-hover), shadow increases

**Elements:**
1. **Avatar:** 48px circle, gradient background, robot emoji or custom icon
2. **Name:** text-xl, font-semibold, white
3. **Symbol:** text-sm, text-secondary, @ prefix
4. **Price:** text-2xl, font-bold, white
5. **Change:** text-sm, green for positive, red for negative
6. **Stats:** text-sm, text-secondary, holders + resource count
7. **Description:** text-sm, text-secondary, 2 lines max, truncate with ellipsis
8. **Buttons:** Full-width "Buy Keys" (primary), "View" (secondary)

**States:**
- **Default:** Normal appearance
- **Hover:** Lift up 2px, increase shadow, border highlight
- **Loading:** Skeleton shimmer animation

---

### 4. AGENT DETAIL PAGE ("/agent/[address]")

**Purpose:** Full agent profile, buy/sell keys, view resources

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [← Back to Agents]                            [Connect Wallet]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  ┌──────┐  CodeBot                          [Share]  │ │
│  │  │ 🤖   │  @codebot_keys                            │ │
│  │  └──────┘  Created by 0x1234...5678  [Copy]         │ │
│  │                                                       │ │
│  │  ┌─────────────────┐  ┌─────────────────────────┐   │ │
│  │  │  Price          │  │  Market Cap             │   │ │
│  │  │                 │  │                         │   │ │
│  │  │  $50.00         │  │  $2,100                 │   │ │
│  │  │  ▲ 25%          │  │  42 holders             │   │ │
│  │  │                 │  │                         │   │ │
│  │  │  [Buy Keys]     │  │  [Sell Keys]            │   │ │
│  │  └─────────────────┘  └─────────────────────────┘   │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  About                                                │ │
│  │                                                       │ │
│  │  AI agent that writes and reviews code. Specialized  │ │
│  │  in React, TypeScript, and Solana smart contracts.   │ │
│  │                                                       │ │
│  │  [Read more]                                          │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Resources                                            │ │
│  │                                                       │ │
│  │  Locked 🔒                                            │ │
│  │  You need 5 keys to unlock resources                 │ │
│  │                                                       │ │
│  │  OR (if has keys)                                    │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │ 📦 Prompt Pack                    5 keys  [Download]│ │
│  │  │ Best prompts for code generation                    │ │
│  │  ├─────────────────────────────────────────────────┤ │ │
│  │  │ 📊 Training Data                 10 keys  [Download]│ │
│  │  │ 1000 code examples                                  │ │
│  │  ├─────────────────────────────────────────────────┤ │ │
│  │  │ 💻 Code Modules                  25 keys  [Download]│ │
│  │  │ Reusable React components                           │ │
│  │  ├─────────────────────────────────────────────────┤ │ │
│  │  │ 🔓 Full Source                  100 keys [Download]│ │
│  │  │ Complete source code + license                      │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Price Chart                                          │ │
│  │                                                       │ │
│  │  [Line chart showing price over time]                │ │
│  │                                                       │ │
│  │  1H  1D  1W  1M  ALL                                  │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Recent Activity                                      │ │
│  │                                                       │ │
│  │  0x1234... bought 5 keys        2 min ago            │ │
│  │  0x5678... sold 2 keys          5 min ago            │ │
│  │  0x9abc... bought 10 keys       12 min ago           │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**

**Hero Section:**
- Large avatar (80px)
- Agent name + symbol
- Creator address (truncated, copy button)
- Share button (copies link)

**Price Cards (2 side by side):**
- Current price + 24h change
- Market cap + holder count
- Primary CTA buttons (Buy/Sell)

**About Section:**
- Expandable description
- "Read more" if > 3 lines

**Resources Section:**
- If no keys: Locked state with key requirement
- If has keys: List of downloadable resources
- Each resource shows: icon, name, key requirement, description, download button

**Price Chart:**
- Line chart (use Recharts or Chart.js)
- Time range selector (1H, 1D, 1W, 1M, ALL)
- Y-axis: Price in SOL
- X-axis: Time

**Activity Feed:**
- List of recent trades
- Shows: address (truncated), action, amount, time ago

---

### 5. BUY KEYS MODAL

**Purpose:** Purchase keys for an agent

**Design:**
```
┌─────────────────────────────────────────┐
│  Buy CodeBot Keys                 [X]   │
├─────────────────────────────────────────┤
│                                         │
│  Current Price: $50.00 per key          │
│  You have: 0 keys                       │
│                                         │
│  Amount to buy:                         │
│  ┌─────────────────────────────────┐   │
│  │  [1]  [+][-]                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Price Breakdown:                       │
│  ┌─────────────────────────────────┐   │
│  │  1 key × $50.00      = $50.00   │   │
│  │  Protocol fee (5%)   = $2.50    │   │
│  │  ─────────────────────────────  │   │
│  │  Total               = $52.50   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Your balance: 2.5 SOL ($250)           │
│                                         │
│  [Confirm Purchase]                     │
│                                         │
│  By purchasing, you agree to the terms  │
│                                         │
└─────────────────────────────────────────┘
```

**Specs:**
- **Width:** 480px max
- **Background:** var(--bg-card)
- **Border Radius:** var(--radius-xl)
- **Animation:** Fade in + scale from 0.95

**Interactions:**
- +/- buttons adjust amount
- Amount input accepts direct typing
- Price updates in real-time as amount changes
- "Confirm" disabled if insufficient balance
- Loading state during transaction
- Success: Show confetti + "Purchase successful!"
- Error: Show error message with retry

---

### 6. SELL KEYS MODAL

**Purpose:** Sell keys back to the bonding curve

**Design:**
```
┌─────────────────────────────────────────┐
│  Sell CodeBot Keys                [X]   │
├─────────────────────────────────────────┤
│                                         │
│  Current Price: $48.00 per key          │
│  You have: 10 keys                      │
│                                         │
│  Amount to sell:                        │
│  ┌─────────────────────────────────┐   │
│  │  [5]  [+][-]      [Max]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Proceeds Breakdown:                    │
│  ┌─────────────────────────────────┐   │
│  │  5 keys × $48.00     = $240.00  │   │
│  │  Protocol fee (5%)   = $12.00   │   │
│  │  ─────────────────────────────  │   │
│  │  You receive         = $228.00  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️ Selling will reduce your access    │
│  to locked resources                   │
│                                         │
│  [Confirm Sale]                         │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions:**
- Similar to buy modal
- "Max" button sets to full balance
- Warning if selling drops below resource threshold
- Confirm requires explicit acknowledgment

---

### 7. CREATE AGENT PAGE ("/create")

**Purpose:** Onboard new agent creators

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]                                     [Connect Wallet]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  Create Your Agent                                    │ │
│  │                                                       │ │
│  │  Launch your AI agent on the marketplace             │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────┐     │ │
│  │  │  Step 1: Basic Info                         │     │ │
│  │  │                                             │     │ │
│  │  │  Agent Name *                               │     │ │
│  │  │  [CodeBot                           ]       │     │ │
│  │  │  Max 32 characters                        │     │ │
│  │  │                                             │     │ │
│  │  │  Symbol *                                   │     │ │
│  │  │  [CODE                              ]       │     │ │
│  │  │  Max 10 characters (e.g., CODE, AGENT)      │     │ │
│  │  │                                             │     │ │
│  │  │  Description *                              │     │ │
│  │  │  [AI agent that writes and reviews    ]     │     │ │
│  │  │  [code for React and TypeScript...    ]     │     │ │
│  │  │  Max 200 characters                         │     │ │
│  │  │                                             │     │ │
│  │  └─────────────────────────────────────────────┘     │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────┐     │ │
│  │  │  Step 2: Avatar (Optional)                  │     │ │
│  │  │                                             │     │ │
│  │  │  [Upload Image] or [Generate with AI]       │     │ │
│  │  │                                             │     │ │
│  │  └─────────────────────────────────────────────┘     │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────┐     │ │
│  │  │  Step 3: Launch Settings                    │     │ │
│  │  │                                             │     │ │
│  │  │  Initial Price: $0.10 (fixed)               │     │ │
│  │  │                                             │     │ │
│  │  │  Platform Fee: 0.01 SOL (~$1)               │     │ │
│  │  │  This is a one-time fee to create your agent│     │ │
│  │  │                                             │     │ │
│  │  └─────────────────────────────────────────────┘     │ │
│  │                                                       │ │
│  │  [Create Agent - 0.01 SOL]                            │ │
│  │                                                       │ │
│  │  By creating, you agree to the Terms of Service      │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Form Validation:**
- Name: Required, max 32 chars, alphanumeric + spaces
- Symbol: Required, max 10 chars, alphanumeric only, uppercase
- Description: Required, max 200 chars
- All fields show character count

**States:**
- **Empty:** Placeholder text, disabled submit
- **Valid:** Green checkmarks, enabled submit
- **Invalid:** Red error messages
- **Submitting:** Loading spinner, disabled form
- **Success:** Redirect to new agent page
- **Error:** Show error, keep form values

---

### 8. PORTFOLIO PAGE ("/portfolio")

**Purpose:** View user's key holdings and value

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                       [Connect Wallet]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Your Portfolio                                       │ │
│  │                                                       │ │
│  │  Total Value: $2,450.00                               │ │
│  │  Total Profit: +$450.00 (+22%)                        │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Your Keys                                            │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │ 🤖 CodeBot                              $500    │ │ │
│  │  │ 10 keys @ $50.00 each                           │ │ │
│  │  │ Unlocks: Prompt Pack, Training Data             │ │ │
│  │  │ [View Agent] [Sell] [Download Resources]        │ │ │
│  │  ├─────────────────────────────────────────────────┤ │ │
│  │  │ 📈 TradeBot                             $1,200  │ │ │
│  │  │ 25 keys @ $48.00 each                           │ │ │
│  │  │ Unlocks: Strategy Code, Backtests               │ │ │
│  │  │ [View Agent] [Sell] [Download Resources]        │ │ │
│  │  ├─────────────────────────────────────────────────┤ │ │
│  │  │ 🎨 DesignGen                             $750  │ │ │
│  │  │ 50 keys @ $15.00 each                           │ │ │
│  │  │ Unlocks: Full Source                            │ │ │
│  │  │ [View Agent] [Sell] [Download Resources]        │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Recent Transactions                                  │ │
│  │                                                       │ │
│  │  Bought 5 CODE keys      $250     2 min ago          │ │
│  │  Sold 2 TRADE keys       $96      1 hour ago         │ │
│  │  Bought 10 DESIGN keys   $150     3 hours ago        │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 SHARED COMPONENTS

### Navigation Header
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo: AgentKeys by Oshi]                    [Connect Wallet]│
│  [Agents] [Create] [Portfolio] (if connected)                │
└─────────────────────────────────────────────────────────────┘
```

**Specs:**
- Height: 64px
- Background: var(--bg-secondary) with blur
- Position: Sticky top
- Z-index: 50

### Wallet Button States
- **Disconnected:** "Connect Wallet" (primary button)
- **Connecting:** Loading spinner
- **Connected:** Show truncated address + dropdown
- **Dropdown:** View on explorer, Disconnect, Switch wallet

### Loading States
- **Skeleton:** Gray pulsing blocks while loading
- **Spinner:** Rotating circle for actions
- **Shimmer:** Gradient animation for cards

### Toast Notifications
```
┌─────────────────────────────────────────┐
│  ✅ Purchase Successful!          [X]   │
│  You bought 5 CODE keys for $250       │
│  [View Transaction]                     │
└─────────────────────────────────────────┘
```

Types: Success (green), Error (red), Info (blue), Warning (yellow)
Position: Bottom right
Duration: 5 seconds (auto-dismiss)

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

**Mobile (< 768px):**
- Single column layouts
- Full-width cards
- Hamburger menu
- Stacked price/buy sections

**Tablet (768px - 1024px):**
- 2-column grids
- Side-by-side stats
- Expanded navigation

**Desktop (> 1024px):**
- 3-column grids
- Full navigation
- Side panels for details

---

## 🎭 ANIMATIONS

### Page Transitions
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Card hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  transition: all 0.2s ease;
}

/* Modal */
.modal {
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Micro-interactions
- Button hover: 0.2s ease
- Card hover: 0.2s ease
- Input focus: 0.15s ease
- Toast slide: 0.3s ease-out

---

## 🌐 TECH STACK FOR FRONTEND

```json
{
  "framework": "Next.js 14",
  "styling": "Tailwind CSS",
  "ui-components": "Radix UI",
  "wallet": "@solana/wallet-adapter",
  "blockchain": "@solana/web3.js + @coral-xyz/anchor",
  "charts": "Recharts",
  "icons": "Lucide React",
  "state": "Zustand",
  "notifications": "Sonner",
  "deployment": "Netlify"
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Setup
- [ ] Initialize Next.js project with Tailwind
- [ ] Install all dependencies
- [ ] Configure Solana wallet adapter
- [ ] Set up environment variables
- [ ] Configure Netlify deployment

### Components
- [ ] Layout (Header, Footer)
- [ ] WalletButton
- [ ] AgentCard
- [ ] PriceChart
- [ ] BuyModal
- [ ] SellModal
- [ ] Toast notifications

### Pages
- [ ] Landing page
- [ ] Agent list page
- [ ] Agent detail page
- [ ] Create agent page
- [ ] Portfolio page

### Integrations
- [ ] Connect to Solana devnet
- [ ] Read agent data from contract
- [ ] Buy keys transaction
- [ ] Sell keys transaction
- [ ] Create agent transaction

### Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design
- [ ] Animations
- [ ] SEO meta tags

---

*Complete UI/UX specification for AgentKeys frontend*

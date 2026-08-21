# Handoff: Civara Jewels Website

## Overview
A fine-jewellery brand website for **Civara Jewels** (tagline: "Pure. Precious. Perfect."). Three pages: a marketing home page, a product detail page (enquiry-based, **no checkout/orders**), and an **AI Studio** — a 3-step flow where customers describe a custom piece in words, review AI-generated concepts, and send a commission to the goldsmiths (inspired by riolls.com).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. Recreate these designs in the target codebase's existing environment (React, Next.js, Vue, etc.) using its established patterns and libraries. If no environment exists yet, choose an appropriate framework (Next.js + Tailwind is a good fit) and implement there.

The `.dc.html` files use a custom template runtime (`support.js`, `{{ }}` holes, `<sc-for>`/`<sc-if>` loops/conditionals, and a `class Component` logic block at the bottom of each file). Read the markup + inline styles for layout/visuals and the logic class for state/behavior — ignore the runtime plumbing.

`image-slot.js` renders `<image-slot>` drag-and-drop placeholders. In production these are simply `<img>` elements; every slot's `placeholder` attribute describes the intended photo.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final. Recreate pixel-perfectly. Product photography is placeholder — real photos to be supplied by the brand.

## Design Tokens

### Colors
- `#faf7f0` — page background (ivory)
- `#f5efe2` — alternate section background (warm cream)
- `#fdfbf6` — input/card background
- `#171310` — dark sections (hero band, footer, primary buttons)
- `#211c15` — body text (near-black)
- `#5f5748` — secondary text
- `#8a8172` — muted text / labels
- `#6e6553` — footer fine print
- `#bfb49c` — footer body text (on dark)
- `#f3ecdd` — headings on dark
- `#a8843c` — gold accent (links hover, borders, eyebrows) on light bg
- `#c9a45c` — gold accent on dark bg (buttons, footer headings)
- `#e0bd75` — gold button hover
- `#eadfc9` / `#d8caac` — light borders / dividers
- `#2a241b` — dark section borders; dark button hover
- Metal swatches: yellow `#d4a94e`, white `#dcd8ce`, rose `#d99a7f`

### Typography
- Display serif: **Cormorant Garamond** (Google Fonts), weight 500, italic for quotes
- Body/UI sans: **Jost** (Google Fonts), weights 300 (body) / 400 (UI)
- Scale: H1 58–76px / 1.05–1.08; section H2 36–44px; card serif 19–28px; body 13–17px / 1.7–1.9
- Eyebrow labels: 11px, uppercase, letter-spacing 0.28–0.32em, gold
- Nav links: 13px, uppercase, letter-spacing 0.13em
- Buttons: 13px, uppercase, letter-spacing 0.22em
- Wordmark: Cormorant Garamond 23px, letter-spacing 0.3em — "CIVARA" black + "JEWELS" gold

### Spacing & shape
- Section padding: 90–110px vertical, 56px horizontal
- Grid gaps: 26–28px (product grids), 20px (categories)
- Buttons: square corners, 15–17px × 36–42px padding, 1px borders
- Pills (chips, cart, nav CTA): border-radius 999px
- No shadows anywhere; hierarchy via background alternation (ivory ↔ cream ↔ dark)
- Thin gold rule dividers: 56–64px wide, 1px, `#a8843c`

## Screens

### 1. Home (`Civara Jewels Home.dc.html`)
1. **Announcement bar** — dark `#171310`, gold 11px uppercase text: "Pure. Precious. Perfect. — Complimentary insured shipping across India".
2. **Nav** — ivory, bottom border. Wordmark left; center links (Rings, Necklaces, Earrings, Bracelets, Bridal, ✦ AI Studio in gold); right pill CTA "Book a viewing" (inverts to dark on hover).
3. **Hero** — centered on cream: gold eyebrow "The Signature Edit", 76px serif "Light, held close to the skin.", gold rule, 17px light paragraph, two CTAs (outlined gold "Explore the edit" filling gold on hover; text link "✦ Design with AI" with underline).
4. **New arrivals** — heading row + "View all pieces" link; 4-col grid of product cards (320px image, centered name 15px, serif price 19px). Cards link to Product Detail.
5. **Categories** — cream; centered heading; 6-col grid (220px image, serif 21px name, "N pieces" 11px uppercase). Rings 64, Necklaces 48, Earrings 52, Bracelets 31, Bridal 27, Pendants 39.
6. **AI Studio band** — dark, 2-col (text / image). 54px serif "You imagine it. AI designs it. We craft it in gold.", 3 outline chips (Engagement rings, Pendants, Bridal sets), gold filled CTA "Begin designing" + text link "How it works →". Links to AI Studio page.
7. **Philosophy** — 2-col: staggered image pair (second offset 48px down) / text with 44px serif "Jewellery that lives with the body — not on it."
8. **Testimonials** — cream; 3 ivory cards: large gold "“", 20px italic serif quote, short gold rule, attribution 12px uppercase (Ananya R. · Mumbai; Kavya S. · Bengaluru; Meera D. · Delhi).
9. **Footer** — dark, 4-col: logo image + blurb / Collections links / Services links (incl. ✦ AI Studio) / Contact (phone, email, WhatsApp, atelier hours). Bottom bar: © + tagline.

### 2. Product Detail (`Product Detail.dc.html`)
- Same nav + breadcrumb (Home / Rings / Elara solitaire).
- **2-col layout**: left gallery (560px main image + 3×170px thumbs); right info column (max 520px):
  - Eyebrow "The Solitaire Edit", 48px serif "Elara solitaire", serif price 28px (₹84,500)
  - Description paragraph
  - **Metal picker** — 3 boxes (Yellow/White/Rose gold); selected = gold border + cream bg
  - **Ring size picker** — 44×44px boxes, sizes 10–16, same selected style; "size guide" link
  - CTAs stacked: dark "Enquire on WhatsApp", outlined gold "Book a private viewing", note "We craft to order — no online checkout."
  - **Accordion** ×3 (Materials & certification / Craft & delivery / Care & lifetime service); one open at a time, +/− toggle in gold
- **Related** — cream, "You may also admire", 4-card grid.
- Slim dark footer with back link + tagline.

### 3. AI Studio (`AI Studio.dc.html`)
- Nav variant (Collections / ✦ AI Studio active / Contact).
- **Intro** — cream, centered: 58px serif "Describe it in words. Wear it in gold."
- **Stepper** — 3 numbered circles (Describe / Concepts / Review) joined by 70px rules; active = gold outline, done = gold filled, upcoming = 45% opacity.
- **Step 1 — Describe** (max-width 820px):
  - Piece type pills: Ring, Pendant, Earrings, Bracelet, Bridal set (single-select)
  - Brief textarea (min 150px) with placeholder example; 3 dashed suggestion chips that fill the textarea
  - Metal picker with color swatch dots; centre stone picker (Natural diamond, Lab-grown diamond, Moissanite, Coloured gem)
  - Footer row: reassurance line + dark gold-text button "✦ Generate concepts"
- **Step 2 — Concepts**: 1.8s shimmer loading state ("Sketching your piece…"), then heading + echoed brief in italics, 3 concept cards (The Faithful ₹86,000 / The Refined ₹79,500 / The Bold ₹94,000), each with image, name, description, estimate. Click to select (gold border + "✦ Selected"). "← Refine the brief" back link; "Continue with selection" disabled (beige) until a card is picked.
- **Step 3 — Review**: 2-col — concept image / commission summary (piece, metal, stone, estimate, crafting time 2–3 weeks), copy about designer follow-up, CTAs "Send to our goldsmiths" + "Discuss on WhatsApp", back link.
- **How it works** — dark band, 4 numbered columns (Describe / AI concepts / Refine together / Crafted in gold).

## Interactions & Behavior
- All selectable chips/boxes: 1px `#d8caac` border default → `#a8843c` border + `#f5efe2` bg selected; cursor pointer.
- Buttons: outlined-gold fills gold with ivory text on hover; dark buttons lighten to `#2a241b`; gold-filled lightens to `#e0bd75`. Transitions ~150ms.
- Links: default `#211c15`, hover `#a8843c`.
- Accordion: single-open, controlled by title key.
- AI generate: on click → step 2 with loading state, 1.8s simulated delay → concepts. In production this calls an image-generation backend; concepts return image + name + description + price estimate.
- Currency: all three pages expose a `currency` prop (₹ INR / $ USD / € EUR); prices stored in INR, converted (÷84 USD, ÷91 EUR) and locale-formatted.
- No cart/checkout — conversions are WhatsApp enquiry, email, and "Book a viewing".

## State Management
- **Product Detail**: `metal`, `size`, `open` (accordion key).
- **AI Studio**: `step` (1–3), `generating` (bool), `type`, `metal`, `stone`, `brief` (string), `picked` (concept name). "Continue" gated on `picked`.
- Data fetching (production): product catalogue, AI concept generation endpoint, enquiry submission (WhatsApp deep link / email).

## Assets
- `assets/civara-logo.jpeg` — Civara Jewels logo (gold ring + wordmark on black), used in footer. Ask the brand for a transparent/light version for light backgrounds.
- Fonts: Cormorant Garamond + Jost via Google Fonts.
- All product/editorial photos are placeholders; each `<image-slot placeholder="…">` describes the required shot.

## Files
- `Civara Jewels Home.dc.html` — home page
- `Product Detail.dc.html` — product page (Elara solitaire)
- `AI Studio.dc.html` — AI design studio flow
- `image-slot.js`, `support.js` — prototype runtime only; do not port

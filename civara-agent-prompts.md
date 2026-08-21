# CIVARA JEWELS — AGENT PROMPT PACK

Repository: `civara-jewels` (Next.js 14 App Router · TypeScript · Tailwind · deployed on Vercel)
Design system to preserve in every prompt below:

```
Cream background      #FAF7F0
Body text (warm bone) #211C15
Champagne gold        #C9A961
Deep gold on cream    #9E7F3C
Void hover surface    #241F1B
Cream on dark         #FBF7F0
Serif display         Cormorant Garamond
Sans / eyebrow        Jost
Border-radius scale   pill for CTAs, 0 for image tiles
Motion vocabulary     ease-out, 400–700ms, no bouncy easings
```

Rule for every prompt: **do not invent colours, fonts, or copy tone. Stay inside the tokens above.** Voice is quiet luxury — never announce features, never say "amazing," never emoji.

---

## TIER 0 — Ship this week. Site is bleeding trust.

### P0-1 · Wire up the "Book a Viewing" CTA
```
TARGET   components/header/BookViewingButton.tsx (and any duplicate in mobile drawer)
BUG      The header <button>Book a viewing</button> has no onClick. Confirmed:
         no modal opens, no route change, no wa.me link fires.
GOAL     Make the button open a modal <BookViewingDialog /> with fields:
           - Name (required)
           - Phone with +91 default (required, validate 10-digit IN)
           - Preferred city (Mumbai / Delhi / Virtual concierge HD)
           - Preferred date (date picker, min = today + 2 days)
           - Piece of interest (optional, free text)
           - Notes (optional textarea)
         On submit, POST to /api/viewings AND open a wa.me deep link
         pre-filled with a formatted summary so the concierge gets the
         request twice (email + WhatsApp) and it never gets lost.
CONSTRAINTS
         - Modal uses Radix Dialog or Headless UI Dialog.
         - Focus trap, ESC to close, backdrop click to close, scroll lock.
         - Inputs use the champagne-gold underline treatment already used
           on the newsletter footer (do not import a random form library).
         - Success state: replace form with a single line
           "Received. A private concierge will confirm within 4 hours."
         - No third-party analytics fire before submit.
ACCEPT   1. Clicking BOOK A VIEWING opens the modal on desktop AND inside
            the mobile hamburger drawer.
         2. Empty submit shows inline field errors (no toast spam).
         3. On success, WhatsApp opens in a new tab with the pre-filled msg.
         4. Lighthouse a11y ≥ 95 on the page with modal open.
```

### P0-2 · Fix the H1 word-soup
```
TARGET   components/hero/AnimatedHeadline.tsx (homepage hero)
BUG      Each word is wrapped in a <span> with no whitespace between
         siblings. document.querySelector('h1').innerText returns
         "Quietsolitairesandhallmarkedgoldheirloomsmadetooutlastus."
         Google indexes one nonsense token. Screen readers read one
         nonsense token.
GOAL     Preserve the reveal animation but restore semantic spacing.
FIX      Insert a real space between spans in the DOM, OR render one
         hidden <span aria-hidden="false">&nbsp;</span> between words,
         OR keep the visible spans and add a visually-hidden full text
         node as the accessible name of the heading.
ACCEPT   1. innerText of the h1 reads with normal spaces.
         2. Reveal animation still plays word-by-word.
         3. NVDA / VoiceOver reads the sentence naturally.
         4. View-source shows the sentence as text (search engines see it).
```

### P0-3 · Kill the empty product cards on the homepage
```
TARGET   app/(marketing)/page.tsx  and  data/featured-products.ts
BUG      3 of 4 "Featured Solitaires & Bands" cards have no <img>.
         Cards render a hollow star icon on a beige box next to
         ₹1,12,000 and ₹1,95,000 pricing. Trust dies here.
GOAL     Either supply real photos or filter the tile out. No empty
         display cases.
IMPLEMENTATION
         a) Update the seed data to only surface products where
            product.images.length > 0.
         b) Add a Zod check that throws in dev if any Featured product
            has no primary image. Fail loud, not silent.
         c) While photography is being shot, gate the section behind
            <FeaturedSection minCount={4}> — hide the whole section
            if fewer than 4 real products exist.
ACCEPT   1. No card on the homepage ever renders without an image.
         2. Removing images in the seed data hides the section, not
            renders a placeholder.
         3. Console warns in dev if the section is being hidden.
```

### P0-4 · Fix Elara PDP hero — empty white 700px box
```
TARGET   app/products/[slug]/page.tsx  →  <ProductGallery />
BUG      /products/elara-solitaire renders a blank 700px hero.
         The same image URL loads fine on the homepage tile
         (/images/elara-solitaire-main.jpg, 1024x1024).
         So the file exists — the <Image> wrapper is broken.
DIAGNOSE Likely causes:
         - next/image with fill but no parent position:relative
         - aspect-ratio container waiting for width/height that never arrive
         - product.images typed as string[] but consumer expects {src, alt}[]
GOAL     Restore the hero image, plus scaffold a proper gallery:
           - Main image (with next/image, priority, sizes attribute)
           - 3–5 thumbnails, click-to-swap
           - Hover-zoom on desktop (2x, follow cursor)
           - Lifestyle "on-hand" shot as thumbnail #2 by convention
           - Mobile: swipeable horizontal gallery with pagination dots
ACCEPT   1. /products/elara-solitaire shows the ring image on load.
         2. Thumbnails swap the main image with a 200ms crossfade.
         3. Hover-zoom does not steal scroll or trap the cursor.
         4. Mobile gallery reports no CLS.
```

### P0-5 · Reconcile Elara price mismatch
```
TARGET   data/products/*.ts, components/product-card, product page
BUG      Homepage card shows ₹84,500 for Elara Solitaire.
         Product page shows ₹69,600 for the same item.
         Two sources of truth → catastrophic trust event.
GOAL     One product record is the single source of truth. Every
         surface reads from it — never from a hardcoded card override.
FIX      1. Delete any hardcoded price from card mock data.
         2. Card price = product.priceINR (formatted server-side).
         3. Add a unit test that fails if any home-page card price
            diverges from the product record.
ACCEPT   1. Elara shows the same price in every surface.
         2. Grep for hardcoded "₹" prices returns only formatter code.
```

### P0-6 · Meta / OG / Twitter cards — link previews are naked
```
TARGET   app/layout.tsx and app/products/[slug]/page.tsx
BUG      No og:image, og:title, og:description, twitter:card.
         WhatsApp preview of any Civara URL will be a bare domain.
         For a jewellery brand this is fatal — referral is the channel.
GOAL     Ship complete Metadata objects on:
         - Root layout (site-wide defaults)
         - Each product page (product-specific)
         - Each collection page (category-specific)
         - Journal posts
DETAILS
         Root defaults:
           title:       "Civara Jewels — Fine Jewellery Atelier"
           description: "Heirlooms in hallmarked 18k recycled gold and
                         certified diamonds. Made to order. Private
                         viewings in Mumbai, Delhi, and virtual HD."
           og:image:    /og/civara-og-default.jpg  (1200×630, warm cream,
                        the yellow-gold solitaire on beige stone)
           twitter:card:summary_large_image
           canonical:   per-page
         Product pages: use product name, price line, and the primary
         image as og:image; add product-schema (see P0-7).
ACCEPT   1. WhatsApp preview of https://civarajewels.com renders
            image + title + description.
         2. Twitter card validator returns "summary_large_image" clean.
         3. LinkedIn Post Inspector renders correctly.
         4. Every product page has a unique <title> and og:image.
```

### P0-7 · Structured data — Product schema per PDP
```
TARGET   app/products/[slug]/page.tsx
GOAL     Emit JSON-LD for:
           - Organization (root layout, once)
           - Product (per PDP) with brand, image[], sku, offers,
             priceCurrency:"INR", availability, url
           - BreadcrumbList (per PDP)
CONSTRAINTS
         - No fake AggregateRating. Do NOT invent reviews. Ship the
           Review schema only when real reviews exist.
         - Emit as <script type="application/ld+json"> in <head>.
         - Validate every build against schema.org via a CI step
           (structured-data-testing-tool or Google's validator API).
ACCEPT   1. Rich Results test passes for /products/elara-solitaire.
         2. Breadcrumb chip appears in Google preview within 2 weeks.
```

---

## TIER 1 — Next sprint. Layout + PDP hardening.

### P1-1 · Rebuild the Collections bento grid
```
TARGET   components/home/CollectionsGrid.tsx
BUG      Grid overflows its parent. Container is 570px wide; child
         tiles are positioned at x=24, 325, 627 with widths 269 and
         571 — extending to 896px. Result at 1280–1920px viewports:
         "NECKLACES" clipped to "ECKLACES", "BRIDAL" clipped to "IDAI",
         a huge empty right column, wrong rhythm.
GOAL     A predictable, responsive, editorial bento grid.
IMPLEMENTATION
         Desktop (≥1024px):
           display: grid
           grid-template-columns: repeat(3, 1fr)
           grid-auto-rows: 22vw   (min 260px, max 420px)
           gap: 24px
           Bento pattern (6 tiles):
             Rings      → col-span-2, row-span-1
             Necklaces  → col-span-1, row-span-1
             Earrings   → col-span-1, row-span-1
             Bracelets  → col-span-2, row-span-1
             Bridal     → col-span-1, row-span-2  (tall statement tile)
             Pendants   → col-span-2, row-span-1
         Tablet (768–1023px): 2 columns, all tiles col-span-1
         Mobile (<768px):    1 column stack, full-bleed images
CONSTRAINTS
         - Each tile is a <Link>; image uses next/image fill.
         - Label overlay is bottom-left, Cormorant, tracking wide,
           deep-gold on a subtle bottom-to-top gradient scrim.
         - Hover: image scales 1.03 over 600ms, label shifts up 4px.
ACCEPT   1. No horizontal overflow at any viewport 320–2560px.
         2. Every label is fully visible at every breakpoint.
         3. Grid maintains 3-2-1 column progression cleanly.
         4. Lighthouse CLS on this section = 0.
```

### P1-2 · Empty-state skeletons across the app
```
TARGET   components/ui/Skeleton.tsx + all product/collection cards
GOAL     Replace the hollow-star empty state with a subtle shimmer
         skeleton in cream/champagne. Never ship a placeholder that
         looks like a missing asset.
IMPLEMENTATION
         - <Skeleton variant="card" aspectRatio="4/5" />
         - Shimmer gradient: from #FAF7F0 via #F3EBD8 to #FAF7F0
         - 1.6s ease-in-out infinite
         - prefers-reduced-motion: static tint, no animation
ACCEPT   1. Loading a slow product page shows shimmer, never a star.
         2. Motion honours prefers-reduced-motion.
```

### P1-3 · Product-page price breakdown block
```
TARGET   components/product/PriceBreakdown.tsx  (new)
GOAL     Indian fine-jewellery buyers expect the arithmetic. Show it.
LAYOUT   A quiet 4-row block below the main price:
           Metal (18k, 4.20g)      ₹30,450
           Diamonds (0.50ct, VS1)  ₹32,000
           Making charges          ₹4,800
           GST (3%)                ₹2,017
           ─────────────────────────────────
           Total                   ₹69,267
TYPE     Cormorant for numbers, Jost mono-tabular for labels.
         Numbers right-aligned. Tabular-nums.
CONSTRAINTS
         - The 24K/gold-rate ticker currently rendered in Fira Mono
           MUST be replaced with the same serif type family. Match
           the price. No monospace anywhere customer-facing.
         - For 18k products, show the 18k rate, not 24k.
         - Ticker updates should NOT reflow the layout (reserve space).
ACCEPT   1. Every PDP shows a proper breakdown.
         2. No monospace font renders on any consumer page (audit CSS).
         3. Ticker updating price does not cause layout shift.
```

### P1-4 · Ring-size UX rebuild
```
TARGET   components/product/RingSizeSelector.tsx
BUG      Currently exposes only sizes 10–16.
         Indian standard ring sizes run 1–30. US 3–13. Serious
         jewellery buyers will not settle for 7 options.
GOAL
         - Expand to Indian sizes 6–25 (default) with US toggle.
         - "Not sure of your size?" link → opens size guide modal
           with printable ring-sizer PDF + WhatsApp request for a
           complimentary sizing kit.
         - Show currently selected size prominently.
         - Out-of-stock sizes are visible but disabled with strike.
ACCEPT   1. Toggle between IN / US updates all labels instantly.
         2. Size-guide modal opens with printable PDF link.
         3. "Request a sizer" opens WhatsApp with a pre-filled message.
```

### P1-5 · Sticky WhatsApp concierge (mobile-first)
```
TARGET   components/floating/WhatsAppConcierge.tsx
GOAL     A discreet floating CTA at bottom-right on mobile.
         Champagne-gold circle, WhatsApp glyph, subtle drop-shadow.
         Not a chat widget — a deep-link opener.
CONSTRAINTS
         - Only visible on <768px.
         - Hides while a modal or drawer is open (no z-index war).
         - No pulse animation. Luxury restraint.
         - Anchor: href="https://wa.me/919999900000?text=…product context"
         - When on a PDP, pre-fill message includes the product name
           and URL. When on collection/home, generic viewing enquiry.
ACCEPT   1. Renders only on mobile.
         2. Product context is injected into the wa.me text param.
         3. Tap opens WhatsApp directly, no interstitial.
```

---

## TIER 2 — Content & trust build (4–6 weeks).

### P2-1 · Craft & provenance page
```
TARGET   app/(atelier)/craft/page.tsx  (new route)
GOAL     A long-form single page telling the truth about materials:
         1. Where the gold comes from: RJC-certified refiner name.
         2. Which lab certifies the diamonds: GIA and/or IGI, with
            example certificate photograph.
         3. The bench-jeweller workflow with a 60–90s film.
         4. Hallmarking process: BIS 750 stamp macro photo.
         5. Sourcing policy: Kimberley-Process compliance statement
            and (if applicable) lab-grown alternatives.
CONTENT  Do not ship placeholder copy. If facts are missing, prompt
         the founder for exact refiner and lab names before build.
LAYOUT   Editorial: full-bleed image, then two-column text, repeat.
         Cormorant for headers, Jost for body.
ACCEPT   1. Every claim on the page is fact-checked against real
            supplier contracts.
         2. Page ranks in Google for "Civara Jewels sourcing" within 30d.
```

### P2-2 · Hallmark & certificate strip on every PDP
```
TARGET   components/product/CertificationStrip.tsx  (new)
GOAL     Directly below the price breakdown:
           [BIS 750 hallmark icon]  Hallmarked 18k recycled gold
           [GIA icon]               GIA-certified diamond · view cert →
           [Shield icon]            Lifetime service · view policy →
         Each row expands on tap to reveal a photograph of the actual
         certificate for that piece.
CONSTRAINTS
         - Never claim GIA on a piece that only has IGI, and vice versa.
         - Certificate PDFs stored in Supabase Storage, served via
           signed URLs with 5-minute TTL.
ACCEPT   1. Every product's certification photo matches its record.
         2. Tapping "view cert" opens the actual scan, not a stock image.
```

### P2-3 · Shop-by-occasion entry doors
```
TARGET   app/(shop)/occasions/[occasion]/page.tsx
GOAL     Five landing pages, same catalogue, different curation:
           /occasions/engagement
           /occasions/wedding
           /occasions/anniversary
           /occasions/milestone
           /occasions/everyday
         Each has its own hero, its own edit of 8–12 pieces, and its
         own emotional copy. Do not just tag-filter; hand-curate.
ACCEPT   1. Each occasion page has a unique hero image and copy.
         2. Products can appear on more than one occasion.
         3. Occasion pages open from the main nav under "Curated Edits."
```

### P2-4 · Diamond & metal education hub
```
TARGET   app/(atelier)/education/*
GOAL     Four pages a serious buyer expects:
           /education/4cs              — cut, colour, clarity, carat
           /education/diamond-shapes   — round vs oval vs emerald etc.
           /education/metals           — 18k yellow/rose/white/platinum
           /education/care             — daily wear & professional service
         Link inline from every PDP: "Learn about this cut →"
CONSTRAINTS
         - Editorial tone, not encyclopaedic dump.
         - Real macro photography of Civara pieces, not stock.
         - One page = one lesson; do not merge.
ACCEPT   1. Every PDP contains at least one inline link into education.
         2. Bounce rate on PDPs drops in the first month.
```

### P2-5 · Journal — three real pieces before public launch
```
TARGET   app/journal/*
GOAL     Do not launch the Journal empty. Write and publish:
           1. "Founder's Note: Why quiet luxury" — 600 words
           2. "The making of an Elara" — photo essay, 8–10 images
           3. "How to inherit jewellery" — 900 words
         Each post has a hero image, TOC on desktop, share-to-WhatsApp.
ACCEPT   1. Three posts live before /journal is linked from the nav.
         2. RSS feed at /journal/rss.xml validates.
```

### P2-6 · Newsletter capture in the footer
```
TARGET   components/footer/NewsletterCapture.tsx
COPY     Header: "First look."
         Sub:    "The next atelier release, delivered before the site."
         Field:  email · CTA: "Join the list"
         Small:  "One email a month. Unsubscribe with one tap."
CONSTRAINTS
         - Never promise a discount. Luxury doesn't do coupons.
         - Champagne underline treatment. No boxed input.
         - Store in a real ESP (Buttondown, Loops, or Resend Audiences)
           — not localStorage.
ACCEPT   1. Successful submit shows "Welcome. First release lands soon."
         2. Double opt-in is enforced.
         3. GDPR-safe: consent text visible before submit.
```

### P2-7 · Physical presence signals
```
TARGET   app/viewings/page.tsx  and  components/footer
GOAL     Even without a public store, name the neighbourhoods.
         "By appointment · Bandra, Mumbai · Khan Market, Delhi ·
          Virtual concierge worldwide (HD)"
         Add a simple map (Mapbox static image, no interactive JS)
         with two pins on /viewings.
ACCEPT   1. Footer shows the two cities and the virtual option.
         2. /viewings shows a static map + address line + phone + WhatsApp.
```

### P2-8 · Press / seen-in strip (only when real)
```
TARGET   components/home/PressStrip.tsx
GOAL     A thin muted band on the homepage: "Featured in" +
         2–5 credible logos (Vogue India, Harper's Bazaar, GQ, etc.)
CONSTRAINTS
         - Do not fabricate. Ship only when at least two real features
           exist. Better to have empty section than fake credibility.
         - Logos in single-tone champagne, no colour.
ACCEPT   1. Ships behind a feature flag until real press exists.
```

---

## TIER 3 — Performance & housekeeping.

### P3-1 · Font waterfall diet
```
TARGET   app/layout.tsx  (next/font configuration)
FINDING  document.fonts.size === 70. Only 12 are actually used.
GOAL     Cut declared font faces by at least half.
FIX      In next/font:
           const cormorant = Cormorant_Garamond({
             subsets: ["latin"],
             weight: ["400","500","600"],   // was: default (all)
             style: ["normal","italic"],
             display: "swap",
             variable: "--font-serif"
           });
           const jost = Jost({
             subsets: ["latin"],
             weight: ["300","400","500"],
             display: "swap",
             variable: "--font-sans"
           });
ACCEPT   1. document.fonts.size drops below 30.
         2. LCP improves ≥ 500ms on 4G throttle.
         3. No visual regression on any page.
```

### P3-2 · Real Lighthouse pass and budget
```
TARGET   .lighthouserc.json + CI
GOAL     Publish a performance budget and enforce it in CI.
BUDGETS  LCP ≤ 2.5s (4G Fast), CLS ≤ 0.05, INP ≤ 200ms,
         Total JS ≤ 200KB gz on homepage.
ACCEPT   1. PRs fail if any budget is broken.
         2. First real Lighthouse run posted in PR comments.
```

### P3-3 · Sitemap, robots, canonical audit
```
TARGET   app/sitemap.ts, app/robots.ts, per-page metadata
GOAL     Ship a real sitemap.xml (dynamic, driven by product/collection
         data), a real robots.txt, and canonical URLs on every page.
ACCEPT   1. /sitemap.xml lists every product, collection, and static page.
         2. Google Search Console indexes ≥ 90% of submitted URLs.
```

---

## VOICE EDITS — fifteen minutes of work, huge return.

Find and replace across `content/` and JSX literals:

| From                                                              | To                                                              |
|-------------------------------------------------------------------|-----------------------------------------------------------------|
| "Every creation converts to a private viewing"                    | "Every piece is made to order. Enquire, view, own."             |
| "architectonic technical concept"                                 | "sketch and technical brief for our master goldsmiths"          |
| "Our AI Studio drafts…"                                           | "Civara Studio drafts…" (hide the AI word entirely, keep AI)    |
| "AI STUDIO" (nav)                                                 | "STUDIO"                                                        |
| "Launch AI Studio"                                                | "Enter the Studio"                                              |
| "Every piece is created in recycled 18k gold and certified…"     | "Made in hallmarked 18k recycled gold. Set with certified diamonds." |

Luxury does not foreground its tooling. Let the AI be the invisible engine.

---

## HOW TO RUN THESE PROMPTS

For Antigravity / Claude Code / Cursor:

1. Paste the prompt as-is; do not edit the ACCEPT criteria.
2. Ask the agent to open a branch per prompt: `fix/p0-1-book-viewing-cta`.
3. Require a PR per prompt with the acceptance list as a checklist.
4. Do not merge P1 or P2 work until every P0 is on `main`.

Order of execution today:
```
P0-1 → P0-2 → P0-3 → P0-4 → P0-5 → P0-6 → P0-7
```

That is the smallest set of changes that turns Civara Jewels from a beautiful shopfront with broken doors into a site a first-time visitor will actually book a viewing on.

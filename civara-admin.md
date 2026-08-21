# MASTER PROMPT — BUILD THE JEWELRY ADMIN PANEL

You are **Antigravity Gemini 3.7 Flash**, acting as a senior full-stack architect, database engineer, security engineer, and UI/UX engineer.

You are working on an existing jewelry e-commerce website.

Your job is to **inspect the existing codebase first and then build a complete, production-ready Admin Panel that integrates with the existing website without breaking the public-facing website.**

This is NOT a mockup task.

Do not create a static dashboard with fake data.

Build the actual working system with:

- SQLite database
- Real CRUD operations
- Real product management
- Real image management
- Real pricing management
- Real category management
- Real inventory foundation
- Secure admin access
- IP-based admin access control
- Admin authentication
- Public website integration

---

# 1. CRITICAL ARCHITECTURE REQUIREMENT

## DATABASE

Use:

**SQLite**

Do NOT use:

- Supabase
- Firebase
- MongoDB
- PostgreSQL
- MySQL
- Any external database service

The website will have a relatively small number of jewelry designs and product images, so SQLite is the intended database.

Use a proper SQLite ORM/query layer if the existing stack supports one.

If the project already has a database abstraction, inspect it first and integrate cleanly rather than unnecessarily replacing the entire architecture.

Use:

- migrations
- proper foreign keys
- indexes
- parameterized queries
- normalized relational tables

Enable:

```sql
PRAGMA foreign_keys = ON;
```

---

# 2. FIRST: INSPECT THE EXISTING PROJECT

Before modifying anything, inspect the repository thoroughly.

Determine:

- Framework
- React/Next.js/Vite/etc.
- Routing architecture
- Existing API architecture
- Existing product components
- Existing product data
- Existing image handling
- Existing styling system
- Existing authentication
- Existing deployment configuration
- Existing environment variables
- Existing database setup, if any

Do NOT rewrite the existing application unnecessarily.

Do NOT replace working components simply because you prefer another architecture.

Build the Admin Panel around the existing project.

---

# 3. CURRENT JEWELRY CATEGORIES

The website currently has these six jewelry categories:

```text
1. Rings
2. Bracelets
3. Necklace
4. Pendant
5. Bridal
6. Earrings
```

These must exist as initial categories in the database.

IMPORTANT:

Do NOT hardcode these categories permanently into the frontend.

The admin must be able to create additional categories later.

For example:

```text
Rings
Bracelets
Necklace
Pendant
Bridal
Earrings
+
Future categories
```

The category system must therefore be database-driven.

---

# 4. PRODUCT / DESIGN MODEL

Every jewelry item should be treated as a **Design/Product**.

Each design should have:

### Basic Information

```text
Product Name
SKU
Category
Description
Short Description
Status
Featured
Sort Order
```

### Jewelry Information

```text
Jewelry Type
Metal
Purity
Weight
Stone Type
Stone Weight
Making Charges
Other Charges
```

### Pricing

```text
Pricing Mode
Product Price
Sale Price
Metal Rate Reference
```

### Inventory

```text
SKU
Stock Quantity
Stock Status
```

### Images

Every design MUST support:

# 6 TO 8 PHOTOS PER DESIGN

This is a hard requirement.

Do NOT build the product system around a single image.

Do NOT limit the product gallery to 3 or 4 images.

The Admin Panel must allow:

```text
Minimum recommended gallery: 6 images
Maximum gallery: 8 images
```

For every design.

Example:

```text
Design: Diamond Ring

Photo 1 → Main / Cover
Photo 2 → Front
Photo 3 → Side
Photo 4 → Back
Photo 5 → Detail / Stone
Photo 6 → Lifestyle
Photo 7 → Additional
Photo 8 → Additional
```

The exact meaning of each image can be defined by the admin.

---

# 5. IMAGE MANAGEMENT — VERY IMPORTANT

Build a proper product image gallery.

Every product must have support for:

```text
image_1
image_2
image_3
image_4
image_5
image_6
image_7
image_8
```

But do NOT literally create eight separate database columns.

Use a dedicated relational table such as:

```text
product_images
```

with fields such as:

```text
id
product_id
image_url / image_path
sort_order
is_primary
alt_text
created_at
updated_at
```

This allows the gallery to remain flexible.

---

# 6. ADMIN IMAGE UPLOAD EXPERIENCE

The admin should be able to upload **6–8 photos for one design in a single workflow**.

Example:

```text
ADD NEW DESIGN

Product Name
SKU
Category
Description
Pricing
Inventory

PRODUCT PHOTOS

┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Photo 1│ │ Photo 2│ │ Photo 3│ │ Photo 4│
│  MAIN  │ │        │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘

┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Photo 5│ │ Photo 6│ │ Photo 7│ │ Photo 8│
│        │ │        │ │ OPTIONAL│ │ OPTIONAL│
└────────┘ └────────┘ └────────┘ └────────┘
```

Requirements:

- Drag-and-drop upload
- Multi-image selection
- Image preview
- Reorder images
- Set primary image
- Delete image
- Replace image
- Add image
- Image alt text
- Upload progress
- Validation
- Mobile-friendly upload UI

The first image should normally become the primary product image.

Allow the admin to change which image is primary.

---

# 7. IMAGE VALIDATION

Implement sensible image validation.

Accept common formats such as:

```text
JPG
JPEG
PNG
WEBP
```

Validate:

- File type
- File size
- Image dimensions

Do not allow arbitrary executable files to be uploaded.

Optimize/compress images where appropriate without visibly damaging jewelry photography.

Because this is a jewelry website, image quality is important.

Do not aggressively compress product images.

---

# 8. PUBLIC PRODUCT GALLERY

The public product page must display the complete gallery.

If a design has:

```text
8 images
```

the customer should be able to view all 8.

If it has:

```text
6 images
```

display all 6.

Do not create empty image slots on the public website.

The product gallery should support:

- Main image
- Thumbnail gallery
- Swipe on mobile
- Desktop gallery
- Image zoom if the existing design supports it
- Smooth image switching
- Proper responsive sizing

Do not distort jewelry images.

Maintain the correct aspect ratio.

---

# 9. CURRENT RING SIZE REQUIREMENT

Rings require special size handling.

Current ring size configuration:

```text
Minimum Size: 3
Maximum Size: 15
Increment: 0.5
```

Therefore generate:

```text
3
3.5
4
4.5
5
5.5
6
6.5
7
7.5
8
8.5
9
9.5
10
10.5
11
11.5
12
12.5
13
13.5
14
14.5
15
```

The admin should be able to modify this later.

Do not hardcode only the current sizes.

---

# 10. RING PRICING RULE

Current business rule:

> All ring sizes have the same price.

Therefore:

```text
Size 3      → Same price
Size 3.5    → Same price
Size 4      → Same price
Size 4.5    → Same price
...
Size 15     → Same price
```

Do NOT automatically change the price based on ring size.

However, design the schema so size-specific pricing can be introduced later.

Use a pricing configuration such as:

```text
SAME_PRICE
```

Current ring behavior:

```text
pricing_mode = SAME_PRICE
```

---

# 11. METAL / PURITY RATES

Create a dedicated **Metal Rates** management system.

Initial rates:

```text
18 KT  → ₹69,999
14 KT  → ₹55,999
10 KT  → ₹42,999
Silver → ₹26,999
```

Treat these as configurable rates.

Do NOT hardcode them inside frontend components.

Store them in SQLite.

Admin must be able to:

- Add rate
- Edit rate
- Disable rate
- Add new purity
- Add new metal
- View current rate
- View rate history

---

# 12. RATE HISTORY

Do not simply overwrite old rates.

If:

```text
18 KT = ₹69,999
```

changes to:

```text
18 KT = ₹72,500
```

store the change historically.

Create something like:

```text
metal_rates
metal_rate_history
```

Rate history should record:

```text
Metal
Purity
Old Rate
New Rate
Changed At
Changed By
IP Address
```

This is important for jewelry pricing auditability.

---

# 13. PRODUCT PRICING SYSTEM

Separate the concepts of:

### Metal Rate

Example:

```text
18 KT = ₹69,999
```

from:

### Product Price

A jewelry design may have a manually entered final price.

Therefore support:

```text
PRICE_MODE = MANUAL
```

and:

```text
PRICE_MODE = CALCULATED
```

## Manual Pricing

Admin directly enters:

```text
₹XX,XXX
```

## Calculated Pricing

Allow future support for:

```text
Metal Weight
×
Metal Rate
+
Making Charges
+
Stone Charges
+
Other Charges
=
Final Price
```

Do not force calculated pricing if the business wants to enter the final price manually.

The admin should clearly see which pricing mode is active.

---

# 14. PRODUCT CRUD

Create complete product management:

```text
Create
Read
Update
Delete
Duplicate
Archive
Publish
Unpublish
```

Admin should be able to:

- Add design
- Edit design
- Duplicate design
- Delete design
- Archive design
- Publish design
- Unpublish design
- Change category
- Change price
- Change images
- Change inventory
- Change SKU

---

# 15. PRODUCT STATUS

Support:

```text
Draft
Published
Archived
Out of Stock
```

Only:

```text
Published
```

products should appear on the public website.

Draft and archived products must not accidentally appear publicly.

---

# 16. CATEGORY MANAGEMENT

Create a category management section.

Initial categories:

```text
Rings
Bracelets
Necklace
Pendant
Bridal
Earrings
```

Admin actions:

```text
Create category
Edit category
Archive category
Reorder categories
Enable / Disable category
```

Optional category fields:

```text
Name
Slug
Description
Image
Sort Order
Status
```

Do not allow deleting a category if active products depend on it without a safe reassignment/confirmation flow.

---

# 17. INVENTORY

Create an inventory foundation.

Every product should support:

```text
SKU
Stock Quantity
Stock Status
```

For rings, optionally support size-specific inventory:

```text
3      → 2
3.5    → 1
4      → 0
4.5    → 3
```

For other jewelry categories, normal product-level inventory is sufficient initially.

Do not over-engineer inventory unless the existing website already requires it.

---

# 18. ADMIN DASHBOARD

Build a clean professional dashboard.

Dashboard should display:

```text
Total Designs
Published Designs
Draft Designs
Categories
Low Stock
Current Metal Rates
Recently Updated Designs
```

Example:

```text
TOTAL DESIGNS       48
PUBLISHED           41
DRAFT                7
CATEGORIES           6

18 KT       ₹69,999
14 KT       ₹55,999
10 KT       ₹42,999
SILVER      ₹26,999
```

Also provide:

```text
Recent Activity
```

---

# 19. ADMIN NAVIGATION

Use a scalable structure:

```text
ADMIN

Dashboard

Catalog
  ├── All Designs
  ├── Add Design
  └── Categories

Pricing
  ├── Metal Rates
  └── Rate History

Inventory
  ├── Stock
  └── Ring Sizes

Media
  └── Product Images

Activity
  └── Audit Logs

Settings
  ├── Admin Access
  └── General Settings
```

Keep navigation simple and professional.

---

# 20. ADMIN ACCESS — IP ONLY

This is a CRITICAL requirement.

The Admin Panel must only be accessible from approved IP addresses.

Configure:

```env
ADMIN_ALLOWED_IPS=YOUR_IP_ADDRESS
```

Support multiple addresses:

```env
ADMIN_ALLOWED_IPS=IP_1,IP_2,IP_3
```

The IP configuration must remain server-side.

NEVER expose it in:

- frontend JavaScript
- HTML
- public API responses
- browser local storage
- client-side environment variables

---

# 21. FOOTER ADMIN PANEL LINK

On the public website footer:

Show:

```text
Admin Panel
```

ONLY when the current visitor's IP is an allowed admin IP.

For everyone else:

```text
Do not display Admin Panel
```

But remember:

**Hiding the footer link is NOT security.**

The actual `/admin` route must still be protected.

If an unauthorized user manually visits:

```text
/admin
```

return:

```text
403 Forbidden
```

Do not show the login screen to unauthorized IPs if strict IP-only access is required.

---

# 22. ADMIN SECURITY ARCHITECTURE

Use multiple security layers:

```text
Visitor
   ↓
IP Allowlist
   ↓
Authentication
   ↓
Authorization
   ↓
Admin Session
   ↓
Admin Dashboard
```

Unauthorized IP:

```text
Visitor
   ↓
IP Check
   ↓
FAIL
   ↓
403
```

Every admin API endpoint must independently enforce authorization.

Never assume that protecting `/admin` automatically protects:

```text
/api/admin/*
```

Protect the API layer as well.

---

# 23. IP DETECTION

The application may be deployed behind:

- Vercel
- Cloudflare
- CDN
- Reverse proxy

Implement client-IP detection correctly.

Do NOT blindly trust arbitrary client-provided:

```text
X-Forwarded-For
```

Use the deployment platform's trusted IP mechanism where applicable.

Create a reusable server-side utility such as:

```text
isAdminIP(request)
```

Use it consistently across:

- Admin pages
- Admin APIs
- Footer admin-link visibility
- Authentication endpoints
- Admin image endpoints
- Product APIs
- Pricing APIs

---

# 24. ADMIN AUTHENTICATION

IP allowlisting should be the first security layer.

Also implement admin authentication.

Use:

- Secure password hashing
- Argon2id or bcrypt
- HTTP-only cookies
- Secure cookies in production
- SameSite protection
- Session expiration
- Logout
- Rate limiting
- Failed-login protection

Never store plaintext passwords.

Never put admin credentials into source code.

Use environment variables/secrets for initial credentials/configuration.

---

# 25. SQLITE DATABASE STRUCTURE

Use a normalized schema.

At minimum consider:

```text
admins
categories
products
product_images
product_variants
ring_sizes
metal_rates
metal_rate_history
inventory
audit_logs
```

Potential relationship:

```text
categories
    ↓
products
    ↓
product_images

products
    ↓
product_variants

products
    ↓
inventory

metal_rates
    ↓
metal_rate_history
```

Do not store all product information in one huge JSON object.

Use relational tables where appropriate.

---

# 26. PRODUCT IMAGE DATABASE STRUCTURE

Use:

```text
product_images
```

with fields such as:

```text
id
product_id
path/url
sort_order
is_primary
alt_text
created_at
updated_at
```

This allows 6–8 images today while remaining extensible.

Do NOT create:

```text
image1
image2
image3
image4
image5
image6
image7
image8
```

as eight product database columns.

---

# 27. SEARCH AND FILTERING

Admin product listing should support:

### Search

- Product name
- SKU

### Filters

- Category
- Metal
- Purity
- Status
- Stock
- Featured

### Sorting

- Newest
- Oldest
- Price low → high
- Price high → low
- Name A → Z
- Name Z → A

---

# 28. AUDIT LOGS

Create an audit log.

Track:

```text
Admin Login
Failed Login
Product Created
Product Updated
Product Deleted
Product Published
Product Archived
Price Changed
Metal Rate Changed
Category Created
Category Updated
Image Added
Image Deleted
Inventory Changed
```

Record:

```text
Timestamp
Action
Entity
Entity ID
Admin
IP Address
```

This is especially important because the system manages jewelry prices.

---

# 29. PUBLIC WEBSITE INTEGRATION

The public website should read product data from the SQLite-backed backend.

Architecture:

```text
ADMIN PANEL
     ↓
SQLite
     ↓
Backend/API
     ↓
PUBLIC WEBSITE
```

Do NOT maintain separate hardcoded product data inside frontend components.

When the admin:

```text
adds a product
```

it should become available to the public website when published.

When the admin:

```text
changes price
```

the public website should use the updated price.

When the admin:

```text
changes product images
```

the public product gallery should reflect those images.

When the admin:

```text
archives a product
```

it should disappear from the public catalog.

---

# 30. PERFORMANCE

Keep the admin panel fast.

Requirements:

- Lazy-load large image previews where appropriate
- Use responsive image sizes
- Avoid loading all product images on the dashboard
- Paginate large product lists
- Optimize SQLite queries
- Add indexes
- Avoid unnecessary API requests
- Avoid unnecessary client-side state
- Avoid unnecessary animation

The public website must remain performant after adding the admin system.

---

# 31. RESPONSIVE ADMIN UI

The admin panel must work on:

```text
Desktop
Laptop
Tablet
Mobile
```

Desktop should be the primary optimized experience.

Use:

- Clean sidebar
- Responsive tables
- Search
- Filters
- Modals/drawers
- Confirmation dialogs
- Clear save/cancel buttons
- Loading states
- Empty states
- Error states
- Success notifications

---

# 32. ADMIN IMAGE UX

For each design, show:

```text
DESIGN PHOTOS — 6/8
```

If only 6 photos are uploaded:

```text
6 / 8 photos
```

If 8 are uploaded:

```text
8 / 8 photos
```

Allow the admin to see immediately whether the design has the required gallery.

For example:

```text
✓ 6 photos uploaded
✓ Primary image selected
✓ Gallery ready
```

or:

```text
⚠ Only 4 photos uploaded
Recommended: 6–8 photos
```

Do not prevent saving a draft with fewer than six images unless the existing business requirements explicitly require it.

But before publishing, consider warning the admin if fewer than six photos exist.

---

# 33. DESIGN FORM STRUCTURE

Use a logical form:

```text
ADD DESIGN

━━━━━━━━━━━━━━━━━━━━
BASIC INFORMATION
━━━━━━━━━━━━━━━━━━━━

Design Name
SKU
Category
Description
Status

━━━━━━━━━━━━━━━━━━━━
JEWELRY DETAILS
━━━━━━━━━━━━━━━━━━━━

Metal
Purity
Weight
Stone Type
Stone Weight

━━━━━━━━━━━━━━━━━━━━
PRICING
━━━━━━━━━━━━━━━━━━━━

Pricing Mode
Metal Rate
Product Price
Sale Price
Making Charges
Other Charges

━━━━━━━━━━━━━━━━━━━━
PRODUCT PHOTOS
━━━━━━━━━━━━━━━━━━━━

6–8 Images

━━━━━━━━━━━━━━━━━━━━
INVENTORY
━━━━━━━━━━━━━━━━━━━━

Stock
SKU
Stock Status

━━━━━━━━━━━━━━━━━━━━
PUBLISHING
━━━━━━━━━━━━━━━━━━━━

Draft / Published
Featured
Sort Order

[ SAVE DESIGN ]
```

Make the form easy to understand.

---

# 34. RING-SPECIFIC FORM

When category is:

```text
Rings
```

show additional:

```text
Ring Size Configuration
```

Example:

```text
Minimum Size
3

Maximum Size
15

Increment
0.5

Pricing
Same for all sizes
```

For other categories, do not show unnecessary ring-size controls.

---

# 35. FUTURE-PROOF CATEGORY SYSTEM

The system currently has:

```text
Rings
Bracelets
Necklace
Pendant
Bridal
Earrings
```

But it should be possible to add:

```text
Bangles
Chains
Nose Pins
Mangalsutra
Anklets
Brooches
Custom Jewelry
```

without changing application code.

The database/category management system should handle this.

---

# 36. DO NOT BREAK THE PUBLIC WEBSITE

This is extremely important.

Before making changes:

- Inspect existing components.
- Reuse existing design system.
- Reuse existing API conventions.
- Reuse existing image components.
- Reuse existing fonts/styles where appropriate.

Do not redesign the public website unless explicitly requested.

Do not modify unrelated pages.

Do not remove existing functionality.

---

# 37. ERROR HANDLING

Unauthorized requests:

```text
403 Forbidden
```

Invalid admin login:

```text
Invalid credentials
```

Missing product:

```text
404 Product Not Found
```

Validation failure:

Return clear field-level errors.

Database failure:

Show a safe user-facing error.

NEVER expose:

- SQL queries
- stack traces
- server filesystem paths
- secrets
- environment variables
- internal implementation details

---

# 38. SECURITY CHECKLIST

Implement:

- IP allowlisting
- Authentication
- Authorization
- Secure sessions
- Password hashing
- HTTP-only cookies
- SameSite cookies
- CSRF protection where applicable
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- Secure headers
- 403 handling
- Audit logging
- Secure image uploads
- Server-side admin authorization

---

# 39. INITIAL SEED DATA

Seed these categories:

```text
Rings
Bracelets
Necklace
Pendant
Bridal
Earrings
```

Seed these metal rates:

```text
18 KT → ₹69,999
14 KT → ₹55,999
10 KT → ₹42,999
Silver → ₹26,999
```

Seed ring configuration:

```text
Minimum = 3
Maximum = 15
Increment = 0.5
Pricing = SAME_PRICE
```

These are initial values only.

Everything should be editable from the Admin Panel.

---

# 40. FINAL TESTING

Before saying the work is complete, actually test the implementation.

## IP ACCESS TEST

Test:

```text
Allowed IP
→ Footer Admin Panel visible
→ /admin accessible
→ Admin APIs accessible
```

Test:

```text
Unauthorized IP
→ Footer Admin Panel hidden
→ /admin returns 403
→ Admin APIs return 403
```

## PRODUCT TEST

Create a test ring with:

```text
6 photos
```

Verify:

- All six save correctly
- First image becomes primary
- Images can be reordered
- Images can be deleted
- Public product page displays all six

Then test:

```text
8 photos
```

Verify all eight display correctly.

## CATEGORY TEST

Verify all six categories exist:

```text
Rings
Bracelets
Necklace
Pendant
Bridal
Earrings
```

Create a new category from Admin Panel and verify it appears on the public website/catalog where appropriate.

## RING TEST

Verify:

```text
3
3.5
4
4.5
...
15
```

Verify all sizes have the same price.

## PRICE TEST

Verify:

```text
18 KT = ₹69,999
14 KT = ₹55,999
10 KT = ₹42,999
Silver = ₹26,999
```

Change one rate and verify the new value reaches the public website.

## PERSISTENCE TEST

Restart the application.

Verify:

- Products remain
- Categories remain
- Images remain
- Rates remain
- Inventory remains
- Audit logs remain

---

# 41. IMPORTANT DEVELOPMENT RULE

Do NOT stop after creating the UI.

The Admin Panel must be connected to the real SQLite database.

Every button must perform the intended operation.

Every form must save real data.

Every image operation must persist.

Every price change must persist.

Every product change must reflect on the public website.

---

# 42. FINAL ARCHITECTURE

The final architecture should conceptually look like:

```text
                    PUBLIC WEBSITE
                          │
                          │
                    Product API
                          │
                          ▼
                    ┌──────────┐
                    │  SQLite  │
                    └──────────┘
                          ▲
                          │
                    Admin API
                          ▲
                          │
                 Authentication
                          ▲
                          │
                    IP Allowlist
                          ▲
                          │
                  ┌──────────────┐
                  │ ADMIN PANEL  │
                  └──────────────┘
```

The Admin Panel manages:

```text
Products
Categories
6–8 Product Images
Pricing
Metal Rates
Rate History
Ring Sizes
Inventory
Publishing
Audit Logs
```

---

# 43. DEFINITION OF DONE

The task is complete only when all of the following are true:

- [ ] SQLite is the actual database
- [ ] No Supabase is used
- [ ] Current six jewelry categories exist
- [ ] Categories are database-driven
- [ ] Admin can add new categories
- [ ] Admin can create products/designs
- [ ] Admin can edit products/designs
- [ ] Admin can delete/archive products
- [ ] Every design supports 6–8 photos
- [ ] Multiple photos can be uploaded in one workflow
- [ ] Images can be reordered
- [ ] Primary image can be selected
- [ ] Images can be deleted/replaced
- [ ] Public product gallery displays all uploaded images
- [ ] Rings support half-size increments
- [ ] Ring sizes support 3–15 initially
- [ ] Ring sizes have same price currently
- [ ] Metal rates are editable
- [ ] Initial rates are seeded correctly
- [ ] Rate history is maintained
- [ ] Product pricing is editable
- [ ] Inventory foundation exists
- [ ] Products can be published/unpublished
- [ ] Admin authentication works
- [ ] IP allowlisting works
- [ ] Unauthorized IPs receive 403
- [ ] Admin footer link only appears for allowed IPs
- [ ] Admin APIs are independently protected
- [ ] Audit logs work
- [ ] Data survives application restart
- [ ] Existing public website functionality remains intact
- [ ] No fake/mock functionality remains
- [ ] No hardcoded product catalog exists
- [ ] No secrets are exposed client-side

---

# FINAL INSTRUCTION TO ANTIGRAVITY

**Do not guess.**

First inspect the existing repository and understand its architecture.

Then make an implementation plan.

Then implement the Admin Panel incrementally.

After implementation:

1. Run the application.
2. Run the database/migrations.
3. Test all CRUD operations.
4. Test the 6–8 image gallery.
5. Test ring sizes.
6. Test metal rates.
7. Test IP restrictions.
8. Test unauthorized API access.
9. Test public website integration.
10. Fix all errors found during testing.
11. Verify that existing public pages still work.
12. Only then report the implementation as complete.

If you encounter an architectural conflict with the existing application, **inspect and adapt the implementation instead of blindly replacing existing systems.**

The goal is a **real, secure, maintainable jewelry e-commerce Admin Panel backed by SQLite**, not a visual prototype.
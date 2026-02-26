# SmartPandit Admin Panel - Full Implementation Plan

## Current State Audit (Feb 2026)

### ✅ ALREADY DONE (keep & enhance)
- MongoDB Models: Puja, Product, Booking, Order, Pandit, AstrologyRequest, Offer, Banner, Slider, AuditLog, Notification, Customer, User, Transaction, Review, Blog, Coupon, Setting, AdminUser
- Base Repository pattern with pagination
- Analytics service (getDashboardStats)
- Admin Layout (Sidebar + Header + Auth guard)
- Dashboard page with stats + revenue chart
- Bookings page with table + assign form + status change
- Pujas CRUD (list + form + edit)
- Products CRUD (list + form + edit)
- Astrology list + assign form
- Pandits list page (basic)
- Offers CRUD
- Banners CRUD
- Sliders CRUD
- Audit Logs list
- UI components: Table, Button, Card, Badge, Select, Input, Dialog, etc.

### ❌ MISSING / NEEDS BUILDING
1. **WhatsApp utility** - Generate prefilled WhatsApp links
2. **Reusable AdminTable** - Configurable columns, filters, search, CSV export, pagination
3. **Analytics Model** - Visitor tracking, page views, events
4. **Enhanced Dashboard** - More widgets (visitors, store revenue, astrology revenue, conversion), booking trend chart, traffic chart
5. **Team/Pandit page overhaul** - Role field, WhatsApp quick button, skills/area
6. **Booking WhatsApp assign** - WhatsApp icon instead of complex assign flow
7. **Astrology WhatsApp assign** - Same pattern
8. **Orders admin page** - Full list with status update, tracking ID
9. **Users admin page** - List with details
10. **Notifications admin** - Send notification form
11. **Sidebar update** - Add Team, Reviews, Coupons, Blogs, Calendar
12. **Global search** - Search across entities
13. **Soft delete** - Already have deletedAt on models, need UI toggle
14. **CSV Export** - On all tables

## Implementation Order

### Phase 1: Foundation (WhatsApp + AdminTable + Analytics Model)
### Phase 2: Dashboard Enhancement  
### Phase 3: Core Pages (Team, Bookings, Astrology, Orders)
### Phase 4: CMS + Notifications
### Phase 5: Sidebar + Global Search + Polish

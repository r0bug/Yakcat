# YakCat - Consignment Mall Catalog System

A modern, production-ready web application for consignment mall vendors to manage and showcase their items with **working image uploads**, messaging, forums, and event management.

## 🌐 Live Production Site

**[https://webcat.yakimafinds.com](https://webcat.yakimafinds.com)**

## Why YakCat?

Built from scratch to replace WebCat's broken image functionality. YakCat uses a proven, production-ready stack where **everything just works**.

## ✅ Fully Implemented Features

### Core Functionality
- **Working Image Uploads** - Reliable image handling with Uploadthing (replaced broken Cloudflare R2)
- **Item Management** - Create, edit, and delete items with up to 6 images per item
- **Quick Capture** - Bulk upload multiple items at once
- **Search & Browse** - Browse items by category, search by keywords
- **Mobile Responsive** - Works seamlessly on all devices

### User Features
- **Authentication** - Secure JWT-based login system
- **My Items** - Personal dashboard for vendors to manage their listings
- **Messaging** - Send and receive messages between users
- **Forum** - Community discussion board
- **Events Calendar** - View and manage upcoming events

### Admin Features
- **Admin Dashboard** - Central hub with statistics and quick actions
- **User Management** - View all users, change roles, delete accounts
- **Item Management** - Moderate and manage all items across the platform
- **Site Settings** - Configure site-wide settings and preferences

## Tech Stack

- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript** - Type safety throughout
- **Prisma** - Modern ORM with PostgreSQL
- **Neon** - Cloud PostgreSQL database
- **Uploadthing** - Simple, reliable image uploads that actually work
- **Tailwind CSS** - Utility-first styling
- **JWT** - Secure authentication
- **Vercel** - One-click deployments

## Default Login Credentials

### Admin Account
- Email: `john@yakimafinds.com`
- Password: `[Set your own secure password]`

### Test Accounts
- **Vendor**: `vendor@test.com` / `[Set password]`
- **Staff**: `staff@test.com` / `[Set password]`

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/r0bug/Yakcat.git
cd yakcat-new
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
# Database - Neon PostgreSQL
DATABASE_URL="your-neon-connection-string"

# Authentication
JWT_SECRET="your-jwt-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Uploadthing - Get free API keys at uploadthing.com
UPLOADTHING_TOKEN="your-uploadthing-token"
```

### 3. Set up Database

```bash
npx prisma migrate dev
npx prisma db seed  # Optional: seed with test data
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Custom Domain with CNAME

1. Add CNAME record pointing to `cname.vercel-dns.com`
2. Add domain in Vercel project settings
3. Wait for DNS propagation

## Key Improvements Over WebCat

| Feature | WebCat (Old) | YakCat (New) |
|---------|--------------|--------------|
| Image Upload | ❌ Broken R2 uploads | ✅ Uploadthing works perfectly |
| Image Display | ❌ 404 errors | ✅ Images display reliably |
| Authentication | ❌ Complex, often fails | ✅ Simple JWT, always works |
| Deployment | ❌ Complex multi-service | ✅ Single Next.js app |
| Database | ❌ Branching issues | ✅ Simple migrations |
| Admin Tools | ❌ Missing | ✅ Full admin dashboard |
| Performance | ❌ Slow | ✅ Fast |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get item by ID
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item
- `GET /api/my-items` - Get user's items

### Messages
- `GET /api/messages` - Get received messages
- `POST /api/messages` - Send message
- `GET /api/messages/sent` - Get sent messages

### Forum
- `GET /api/forum` - Get forum posts
- `POST /api/forum` - Create forum post

### Events
- `GET /api/events` - Get events
- `POST /api/events` - Create event

### Admin
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/[id]` - Update user role
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/items` - Get all items (admin view)
- `GET /api/admin/settings` - Get site settings
- `POST /api/admin/settings` - Update site settings
- `GET /api/admin/stats` - Get dashboard statistics

## User Roles

- **ADMIN** - Full access to all features and admin dashboard
- **STAFF** - Can manage all items and moderate content
- **VENDOR** - Can manage their own items and use standard features

## License

MIT
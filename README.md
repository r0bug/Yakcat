# YakCat - Modern Marketplace for Consignment Malls

A fast, modern web application for consignment mall vendors to list and manage their items with **working image uploads from day one**.

## Why YakCat?

Unlike the previous WebCat implementation that struggled with basic image functionality, YakCat is built on a proven, production-ready stack where **images just work**.

## Tech Stack

- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript** - Type safety throughout
- **Prisma** - Modern ORM with great DX
- **PostgreSQL** - Reliable relational database
- **Uploadthing** - Simple, reliable image uploads that actually work
- **Tailwind CSS** - Utility-first styling
- **Vercel** - One-click deployments

## Features

✅ **Working Image Uploads** - Upload and display images immediately  
✅ Add items with up to 6 images  
✅ Quick capture mode for mobile  
✅ Item catalog with search  
✅ Vendor management  
✅ Responsive design  

## Getting Started

### 1. Clone and Install

```bash
cd ~/Projects
git clone https://github.com/r0bug/Yakcat.git
cd Yakcat
npm install
```

### 2. Set up PostgreSQL

You can use either:
- Local PostgreSQL installation
- Docker: `docker run --name yakcat-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`
- Cloud service like [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free tier)

### 3. Configure Environment

Create `.env.local`:

```env
# Database - Update with your PostgreSQL connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/yakcat"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Uploadthing - Get free API keys at uploadthing.com
UPLOADTHING_TOKEN="your-token"
UPLOADTHING_SECRET="your-secret"
```

### 4. Set up Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Images will work immediately - no complex configuration needed.

## Key Differences from WebCat

| Feature | WebCat (Raindrop) | YakCat (Next.js) |
|---------|-------------------|------------------|
| Image Upload | ❌ Broken | ✅ Works |
| Image Display | ❌ CORS errors | ✅ Works |
| Deployment | ❌ Complex, fails often | ✅ One-click |
| Development | ❌ Slow, many services | ✅ Fast, single app |
| Database | ❌ Branching errors | ✅ Simple migrations |

## Coming Soon

- [ ] User authentication
- [ ] Advanced search
- [ ] Messaging system
- [ ] Forum/discussions
- [ ] Calendar events

## License

MIT
# BloX - Modern Blog Platform

A full-featured, modern blog platform built with Next.js 15, MongoDB, and NextAuth.js. Create, publish, and engage with beautiful blog posts in a community-driven environment.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Rich Text Editor** - Write with a powerful WYSIWYG editor supporting formatting, images, code blocks, and more
- **User Authentication** - Secure sign up/sign in with NextAuth.js
- **User Dashboard** - Manage your posts, bookmarks, and profile
- **Admin Panel** - Full admin control over posts and users
- **Comments System** - Engage with readers through comments with like/dislike functionality
- **Bookmarks** - Save your favorite posts for later reading
- **Tag-based Organization** - Filter and discover content by tags
- **Search** - Find posts quickly with full-text search
- **Dark/Light Theme** - Beautiful themes that adapt to your preference
- **Responsive Design** - Optimized for all screen sizes
- **Image Uploads** - Cloudinary integration for seamless image management
- **Post Analytics** - Track views and engagement on your content

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) with App Router & Turbopack
- **Database:** [MongoDB](https://mongodb.com) with [Mongoose](https://mongoosejs.com)
- **Authentication:** [NextAuth.js](https://next-auth.js.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Animations:** [Motion](https://motion.dev) (Framer Motion)
- **UI Components:** [Radix UI](https://radix-ui.com)
- **Icons:** [Lucide React](https://lucide.dev)
- **Rich Text Editor:** React Quill
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs)
- **Image Hosting:** [Cloudinary](https://cloudinary.com)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Cloudinary account (for image uploads)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-blog.git
   cd nextjs-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── posts/         # Post CRUD operations
│   │   ├── comments/      # Comment management
│   │   ├── bookmarks/     # Bookmark functionality
│   │   └── admin/         # Admin endpoints
│   ├── blog/              # Blog pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   └── auth/              # Auth pages (signin/signup)
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── home/             # Homepage sections
│   ├── comments/         # Comment components
│   └── dashboard/        # Dashboard components
├── models/               # Mongoose models
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
└── public/               # Static assets
```
## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

# Travel Tab 🌍

A modern travel planning and management application built with Next.js, featuring user authentication and a sleek interface for organizing your travel experiences.

## ✨ Features

- **User Authentication** - Secure login and registration system
- **Modern UI** - Built with Tailwind CSS and Radix UI components
- **Database Integration** - PostgreSQL with Prisma ORM
- **Type Safety** - Full TypeScript support with Zod validation
- **Responsive Design** - Mobile-first approach with beautiful animations

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.2 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.x
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** bcryptjs for password hashing
- **Validation:** Zod schemas
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18.x or later
- npm, yarn, pnpm, or bun
- PostgreSQL database

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd travel-tab
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/travel_tab"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
travel-tab/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── db.ts              # Database connection
│   │   ├── utils.ts           # Utility functions
│   │   └── validation.ts      # Zod schemas
│   └── assets/                # Static assets
├── package.json
└── README.md
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following models:

- **User**: Stores user information including email, full name, and hashed passwords

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more deployment options.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🔗 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - Learn about Prisma ORM
- [Tailwind CSS](https://tailwindcss.com/docs) - Learn about utility-first CSS
- [TypeScript](https://www.typescriptlang.org/docs) - Learn about TypeScript

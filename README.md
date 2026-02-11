<div align="center">

# 🏢 PT Maju Jaya - BNSP Dashboard

### Modern Admin Dashboard for Professional Certification Management

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6.37-6c47ff?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**PT Maju Jaya** merupakan badan independen yang bertanggung jawab sebagai otoritas sertifikasi personil dan bertugas melaksanakan sertifikasi kompetensi profesi bagi tenaga kerja.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**
- **Clerk.js Integration** - Enterprise-grade authentication with session management
- **Organization-Based Multi-Tenancy** - Secure user grouping and isolation
- **Proxy Middleware** - Next.js 16 proxy pattern for route protection
- **Role-Based Access Control (RBAC)** - 6-level hierarchy with granular permissions

### 👥 **User Management**
- **Complete CRUD Operations** - Create, read, update, and delete users
- **Advanced Data Table** - Sorting, filtering, pagination, and column reordering
- **Role Management** - Hierarchical role system (Admin → Eksekutif → Direktur → Manajer → Supervisor → Karyawan)
- **Permission Controls** - Field-level and action-level authorization
- **Profile Management** - Beautiful profile views with edit capabilities

### 📊 **Dashboard & Analytics**
- **Overview Dashboard** - Real-time user statistics by role
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Theme System** - Multiple color presets (Neutral, Tangerine, Neo Brutalism, Soft Pop)
- **Dark Mode** - Full light/dark theme support

### 🎨 **UI/UX Excellence**
- **shadcn/ui Components** - Modern, accessible component library
- **Lucide Icons** - Beautiful, consistent iconography
- **Smooth Animations** - Enhanced user experience with micro-interactions
- **Drag & Drop** - Column reordering in data tables

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and React Compiler
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19.2](https://react.dev/)** - Latest React with concurrent features

### Styling & UI
- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component system
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Authentication & Authorization
- **[Clerk.js v6.37](https://clerk.com/)** - Complete authentication solution
  - Session management & JWT tokens
  - Organization membership
  - Role-based access control
  - Email verification & password reset

### Data Management
- **[TanStack Table](https://tanstack.com/table)** - Powerful table library
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight client state
- **[Axios](https://axios-http.com/)** - HTTP client

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant form management
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Developer Experience
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/lint-staged/lint-staged)** - Pre-commit linting

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**
- **Clerk Account** ([sign up here](https://clerk.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bnsp-dashboard.git
   cd bnsp-dashboard
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
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_ORGANIZATION_ID=org_...

   # Clerk Sign-In Configuration
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/v2/login"
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/dashboard/overview"
   ```

   > [!IMPORTANT]
   > Get your Clerk credentials from the [Clerk Dashboard](https://dashboard.clerk.com/)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                  # Protected routes
│   │   ├── api/clerk/           # User management APIs
│   │   ├── auth/v2/             # Authentication pages
│   │   └── dashboard/           # Dashboard pages
│   └── layout.tsx               # Root layout with Clerk
├── components/                   # Shared UI components
│   ├── data-table/              # Reusable data table
│   └── ui/                      # shadcn components
├── config/                       # App configuration
├── data/                         # Data utilities & hooks
├── hooks/                        # Custom React hooks
├── navigation/                   # Navigation config
├── proxy.ts                      # Authentication middleware
└── stores/                       # Zustand stores
```

### Key Files

- **`src/proxy.ts`** - Authentication proxy middleware
- **`src/config/app-config.ts`** - Application configuration
- **`src/data/users.ts`** - User data hooks
- **`next.config.mjs`** - Next.js configuration

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Lint code with Biome
npm run format           # Format code with Biome
npm run check            # Check code style
npm run check:fix        # Fix code style issues

# Theme Generation
npm run generate:presets # Generate theme presets
```

---

## 🔐 Authentication & Roles

### Role Hierarchy

| Role | Level | Permissions |
|------|-------|-------------|
| **Admin** | 6 | Full control over all operations |
| **Eksekutif** | 5 | Executive-level management |
| **Direktur** | 4 | Director-level operations |
| **Manajer** | 3 | Manager-level control |
| **Supervisor** | 2 | Supervisor functions |
| **Karyawan** | 1 | Employee-level access |

### Authorization Rules

- **Self-Edit**: Users can edit their own basic info, but not their role
- **Role-Based**: Higher roles can manage users with lower roles
- **Promotion**: Users can promote others one level above current role
- **Demotion**: Users can demote others to any role below current level
- **Organization**: All users must belong to the configured organization

---

## 🎨 Theme Customization

The dashboard includes multiple theme presets:

- **Neutral** (Default) - Clean, professional look
- **Tangerine** - Vibrant, energetic theme
- **Neo Brutalism** - Bold, modern aesthetic
- **Soft Pop** - Gentle, colorful palette

Toggle between light and dark modes for each theme!

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `CLERK_ORGANIZATION_ID` | Organization ID | `org_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page URL | `/auth/v2/login` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Fallback redirect | `/` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Force redirect after login | `/dashboard/overview` |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style

- Use **Biome** for linting and formatting
- Follow **TypeScript** best practices
- Write **meaningful commit messages**
- Add **comments** for complex logic

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Authentication redirect loops**
```bash
# Solution: Check environment variables
- Verify NEXT_PUBLIC_CLERK_SIGN_IN_URL matches /auth/v2/login
- Ensure all Clerk env vars are set correctly
- Restart dev server after changing .env
```

**Issue: Role changes not reflecting**
```bash
# Solution: Clear cache and verify organization
- Check CLERK_ORGANIZATION_ID in .env
- Verify role in Clerk Dashboard
- Clear browser cache and re-login
```

More troubleshooting tips in [.bot/project.md](/.bot/project.md)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👏 Credits

- **Original Template**: [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) by arhamkhnz
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Clerk.js](https://clerk.com/)
- **Icons**: [Lucide](https://lucide.dev/)

---

## 📞 Support

For support and questions:

- 📧 Email: [admin@majujaya.go.id](mailto:admin@majujaya.go.id)
- 📞 Phone: [(021) 50202609](tel:+622150202609)
- 🏢 Office: Jl. Letjen M.T. Haryono No.Kav. 52 3, RT.3/RW.4, Cikoko, Kec. Pancoran, Jakarta Selatan 13630

---

<div align="center">

**Built with ❤️ for PT Maju Jaya**

**Sertifikasikan Profesimu!** 🎓

[⬆ Back to Top](#-pt-maju-jaya---bnsp-dashboard)

</div>

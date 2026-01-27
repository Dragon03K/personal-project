# Influencer & Business Management System

A comprehensive MERN-stack (Next.js, MongoDB, Gemini AI) application for managing influencer marketing campaigns, business details, and AI-driven interactions.

## 🚀 Features

- **Admin Approval System**: Secure login flow where new users require admin approval before accessing the dashboard.
- **AI-Powered Chat Assistant**:
  - Summarize influencer profiles from URLs.
  - Suggest suitable influencers for specific businesses using real database context.
  - Save and resume chat sessions.
  - Token-efficient and concise responses.
- **Influencer Management**: Add, view, and organize influencer data (Instagram IDs, Niches, Categories, etc.).
- **Business Management**: Track business categories, contact information, and local addresses.
- **Modern UI/UX**: Built with Next.js 15+, Tailwind CSS, and Shadcn UI components for a premium feel.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Next.js API Routes, Mongoose (MongoDB).
- **AI Integration**: Google Gemini (generative-ai).
- **Security**: JWT Authentication with Jose, Bcrypt.js for password hashing, and custom middleware for access control.

## 📋 Prerequisites

- Node.js 20+
- MongoDB Database (Atlas or Local)
- Google Gemini API Key

## ⚙️ Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd afzal-project
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add the following:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

- `/app`: Next.js App Router (pages and API routes).
- `/components`: Reusable UI components (shadcn/ui).
- `/lib`: Utility functions and database connection logic.
- `/models`: Mongoose schemas for Users, Influencers, Businesses, and Chat Sessions.
- `/public`: Static assets.
- `proxy.ts`: Middleware for authentication and role-based access control.

## 📝 Usage

1. **Login**: Existing users can log in; new users will be marked as "Pending Approval".
2. **Admin Dashboard**: Admins can approve users in the "User Management" tab.
3. **AI Chat**: Navigate to "AI Chat" to ask questions about influencers or businesses. The AI uses database context to provide accurate matches.
4. **Data Management**: Use the "Add" and "Details" pages to manage your influencer and business lists.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

---

Built with ❤️ by [Your Name/Afzal]

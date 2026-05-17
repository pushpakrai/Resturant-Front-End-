<div align="center">
  <img src="./public/logo.svg" alt="Cafe Diamond Queen Logo" width="120" />
  <h1>💎 Cafe Diamond Queen — Frontend UI</h1>
  <p><strong>A Cinematic, AI-Powered, 3D E-Commerce Restaurant Experience</strong></p>

  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Three.js](https://img.shields.io/badge/Three.js-3D-black.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animated-FF0055.svg?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

  [Live Demo](https://resturant-front-end.onrender.com) | [Backend Repository](https://github.com/pushpakrai/Restaurant-Back-End-)
</div>

---

## 🌟 Overview
The frontend of **Cafe Diamond Queen** is designed to deliver an unparalleled, premium digital dining experience. Built with a "Diamond Noir" aesthetic (Midnight Obsidian, Champagne Cream, and Gold Leaf), it leverages 3D rendering, sophisticated micro-animations, and AI integration to elevate standard restaurant e-commerce into a luxury brand interaction.

## ✨ Key Features
- **🌐 3D Interactive Hero**: Built with React Three Fiber (`@react-three/drei`), featuring an interactive, physics-based floating diamond geometry.
- **🤖 AI Concierge & Custom Chef**: Direct integration with the backend Gemini 2.0 AI models allowing users to chat about the menu or generate completely custom, unique dishes.
- **🛡️ Secure JWT Authentication**: Full client-side route protection, role-based rendering (Admin vs Guest), and secure cookie/local-storage management.
- **🛒 Dynamic Cart & Checkout**: Real-time state management using React Context, seamless menu interactions, and instant loyalty point calculations.
- **📊 Admin Dashboard**: A specialized, secure portal for restaurant owners to view real-time revenue, incoming reservations, and user analytics charted with `Recharts`.
- **🎬 Cinematic Animations**: Smooth page transitions, scroll-reveals, and interactive hovers powered by Framer Motion.

## 🏗️ Architecture & Structure
The project follows a modular, scalable React architecture:

```text
src/
├── assets/          # Static assets, fonts, and global vectors
├── components/      # Reusable UI components (Navbar, 3D Hero, AI Chatbot)
├── config/          # Tenant-specific configurations and brand tokens
├── context/         # Global State Management (AuthContext, CartContext)
├── hooks/           # Custom React Hooks (useUnsplash, useAuth)
├── lib/             # Third-party library initializations (Axios APIs)
├── pages/           # High-level route components (Home, Menu, Admin, Auth)
├── utils/           # Helper functions (Loyalty calculations, formatting)
├── App.jsx          # Root component and Router configuration
└── index.css        # Tailwind directives and custom cinematic CSS classes
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/pushpakrai/Resturant-Front-End-.git
cd Resturant-Front-End-
```

2. Install dependencies
*(Note: Uses `--legacy-peer-deps` to ensure Three.js compatibility with React 18)*
```bash
npm install --legacy-peer-deps
```

3. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:10000/api
```

4. Run the Development Server
```bash
npm run dev
```

## 🛠️ Deployment
This frontend is configured with a `render.yaml` CI/CD blueprint for one-click deployment on **Render.com** (Static Site). 

Pushing to the `main` branch automatically triggers the build process:
```bash
npm install --legacy-peer-deps && vite build
```

## 📄 License
This project is proprietary and built for Cafe Diamond Queen.

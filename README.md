# Code Sensei - AI-Powered Code Review Assistant

![Screenshot 2025-04-10 154652](https://github.com/user-attachments/assets/44dbc973-68db-425a-ad8c-d4b88711e124)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://code-sensei-five.vercel.app/) 

Code Sensei is an intelligent code review application that helps developers improve their code quality through AI-powered analysis. Built with modern web technologies, it supports multiple programming languages and provides actionable feedback using Deepseek's AI capabilities.

## Features

- 🖥️ Multi-language code editor (JavaScript, Python, Java, PHP, CSS, HTML)
- 👥 OAuth authentication (Google & GitHub)
- 📋 Sidebar with code review histories
- 🤖 AI-powered code reviews using Deepseek API
- 🔒 Secure routes with JWT & middleware protection
- ✅ Client-side form validation with Vee-Validate/Yup
- 🎨 Syntax highlighting & dark theme support
- 🏪 Centralized state management with Pinia
- 📝 Real-time code analysis feedback
- 🗄️ MongoDB storage for user data & histories
- 📊 Clean and responsive UI with Tailwind CSS
- 🔐 Secure code processing with DOMPurify
- 📚 Markdown-formatted review results

## Technologies

### Frontend
- **Vue.js 3** - Reactive framework
- **Vue Router** - Navigation & route protection
- **Pinia** - State management
- **CodeMirror 6** - Code editor component
- **Vee-Validate/Yup** - Form validation
- **Tailwind CSS** - Responsive styling framework
- **highlight.js** - Syntax highlighting
- **vue3-lottie** - Lottie animation integration
- **nprogress** - Page loading progress bar
- **vue-toastification** - Toast notification system
- **Axios** - HTTP client with interceptors
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework with middleware
- **Passport.js** - Google & GitHub authentication
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure token authentication
- **Nodemailer** - Email verification system
- **Deepseek API** - AI analysis engine
- **MongoDB Atlas** - Cloud database service
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js ≥18.x
- npm ≥9.x
- Deepseek API key
- MongoDB Atlas URI
- Google OAuth Client ID/Secret
- GitHub OAuth Client ID/Secret
- JWT Secret Key
- credentials for email service

### Installation

1. **Clone repository**
```bash
git clone https://github.com/dhiabj/CodeSensei.git
cd CodeSensei
```

2. **Configure environment**
```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

3. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

4. **Start development servers**
```bash
# Run backend (from backend directory)
nodemon server

# Run frontend (from frontend directory)
npm run dev
```

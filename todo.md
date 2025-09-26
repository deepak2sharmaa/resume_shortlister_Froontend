BesResumes Shortlister - Development Plan
MVP Implementation Plan
Core Pages & Components (8 files max)
src/pages/SignUp.tsx - Sign up form with validation
src/pages/Login.tsx - Login form
src/pages/ForgotPassword.tsx - Forgot password form
src/pages/Dashboard.tsx - Main dashboard with navbar, resume uploader, candidate list
src/components/OTPModal.tsx - Reusable OTP verification modal
src/components/Navbar.tsx - Dashboard navigation bar
src/lib/validations.ts - Form validation utilities
src/App.tsx - Updated routing configuration
Key Features Implementation
Authentication Flow: SignUp → Login → OTP → Dashboard
Password Reset: ForgotPassword → OTP Modal → Login
Dashboard: Navbar + Resume Uploader + Candidate Management
Responsive Design: Mobile-first with TailwindCSS
Form Validations: Password matching, mobile format, email format
Navigation: React Router with proper redirects
Data Storage Strategy
Use localStorage for user data and candidates (no backend required)
Mock OTP verification (always accept “123456”)
File handling for PDF uploads with preview
UI Components Used
shadcn/ui: Button, Input, Card, Dialog, Form, Alert
Custom responsive layouts with Tailwind
Mobile-friendly modals and navigation
This keeps the implementation focused and achievable within the 8-file limit while delivering all core functionality.
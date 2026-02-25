# Victor Springs Frontend 🏡

Welcome to the frontend repository of the Victor Springs real estate application! This application provides a modern, responsive, and intuitive interface for tenants seeking new homes and landlords looking to manage their properties. 

It is built utilizing modern React paradigms, powered by Vite for lightning-fast hot module replacement, and beautifully styled with Tailwind CSS.

## 🚀 Technologies Used
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Radix UI Primitives
- **Routing:** React Router v6
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Authentication:** JWT, Google OAuth (Hybrid Local/Social)
- **Map Integration:** MapBox GL JS
- **Image Uploads:** Cloudinary

## ✨ Key Features
- **Interactive Dashboards:** Distinct user experiences for Tenants, Landlords, and Site Administrators.
- **Hybrid Authentication:** Seamlessly login with email/password or Google Single Sign-on.
- **Magic Link Security:** Passwordless email verification and secure forgot password token links powered by Resend workflows.
- **Dynamic Property Listings:** Search, filter, and view detailed descriptions for hundreds of properties.
- **Media Optimization:** Responsive image grids utilizing cloud CDNs.

## 📦 Project Setup

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### 1. Clone the repository
```bash
git clone git@github.com:wachira567/victor.springs.frontend.git
cd victor.springs.frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a new `.env` file at the root of the project and populate the following keys. Refer to `.env.example` if available.

```env
# URL to your backend Flask API
VITE_API_BASE_URL=http://localhost:5000/api 

# Get this from your Google Cloud Console
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Get this from your Cloudinary Dashboard
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name

# Get this from your MapBox Dashboard
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
```

### 4. Start the Application
```bash
# Starts the Vite development server
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 📂 Project Structure
```
Frontend/
├── src/
│   ├── components/      # Reusable UI components (Navbar, Footer, ui primitives)
│   ├── contexts/        # React Context wrappers (AuthContext)
│   ├── pages/           # High-level route components (Dashboard, Login, Properties)
│   ├── sections/        # Granular page sections
│   ├── App.jsx          # Root Router configuration
│   └── main.jsx         # Application entry point and Provider wrappers
├── public/              # Static assets
└── tailwind.config.js   # Tailwind theme settings and plugins
```

## 🤝 Contribution Guidelines
When making PRs, ensure that you conform to the established linting and code styles. Verify that the production build resolves successfully prior to submitting.

```bash
# Test the production compiler
npm run build
```

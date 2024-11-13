# Virtual Physics Lab

<p align="center">
  <a href="https://www.mongodb.com/" target="_blank">
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </a>
  <a href="https://expressjs.com/" target="_blank">
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
  </a>
  <a href="https://react.dev/" target="_blank">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  </a>
  <a href="https://nextjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  </a>
  <a href="https://threejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  </a>
</p>

<div align="center">
  
  ![Project Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
  ![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
  ![License](https://img.shields.io/badge/License-Dz-yellow?style=for-the-badge)
  
</div>

A comprehensive web-based virtual physics laboratory for interactive pendulum experiments and learning.

## Overview

Virtual Physics Lab is an interactive web application designed to help students learn physics through hands-on virtual experiments, focusing on pendulum motion and related concepts. The project was developed as part of ITB TPB (Tahap Persiapan Bersama) coursework.

## Developer Contact

<p align="center">
  <a href="https://www.linkedin.com/in/dzulfaqor-ali-dipangegara-85bb241a1" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://github.com/dzulfaqorali196" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="mailto:dzulfaqor2003@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
  <a href="https://instagram.com/dzzulfaqorr" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</p>

**Developer:**
- Name: Dzulfaqor Ali
- NIM: 18222017
- Institution: Institut Teknologi Bandung

## Features

### 1. Interactive Simulation
- Real-time pendulum simulation with adjustable parameters
- Support for both 2D and 3D visualization modes
- Dynamic parameter controls for length, mass, and initial angle
- Real-time data visualization and measurements

### 2. Learning Management
- Structured learning modules with interactive content
- Video tutorials and explanations
- Progressive learning with quizzes and assessments
- Progress tracking and achievements

### 3. Analytics Dashboard
- Detailed experiment analysis
- Historical data visualization
- Performance metrics and statistics
- Data export functionality

### 4. Community Features
- Experiment sharing
- Discussion boards
- User leaderboards
- Social interaction between learners

### 5. User Management
- OAuth authentication (Google, GitHub)
- User profiles and preferences
- Progress tracking
- Customizable settings

### 6. UI
- Responsive
- Dark Mode Available
- Mobile Friendly

## Project Highlights

- 💻 Modern tech stack implementation
- 🎨 Clean and intuitive UI/UX design
- 📱 Fully responsive across all devices
- 🚀 Optimized performance
- 🔒 Secure authentication system
- 📊 Comprehensive analytics
- 🌐 Cross-browser compatibility

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **State Management**: 
  - Zustand for client-side state
  - Next-Auth for authentication state
- **UI Components**: 
  - shadcn/ui
  - Tailwind CSS
  - Framer Motion for animations
- **Data Visualization**: 
  - Recharts
  - Three.js (for 3D visualization)

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js

### Development Tools
- TypeScript
- ESLint
- Prettier
- PostCSS

## Performance Metrics

- ⚡ Lighthouse Score: 95+
- 🔄 Time to Interactive: < 2s
- 📱 Mobile Responsiveness: 100%
- 🔒 Security Score: A+

## Project Structure

```plaintext
project/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── user/         # User-related endpoints
│   ├── auth/             # Authentication pages
│   ├── profile/          # User profile pages
│   ├── simulation/       # Pendulum simulation
│   ├── learn/           # Learning modules
│   ├── analytics/       # Data analysis
│   └── community/       # Community features
├── components/           # React components
│   ├── analytics/       # Analytics components
│   ├── auth/           # Authentication components
│   ├── simulation/     # Simulation components
│   ├── ui/            # UI components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
├── models/            # MongoDB schemas
└── types/             # TypeScript definitions
```

## Key Components

### Simulation Engine
- Real-time physics calculations
- WebGL rendering for 3D visualization
- Configurable parameters
- Data collection and analysis

### Learning Management
- Structured content delivery
- Interactive quizzes
- Progress tracking
- Achievement system

### Data Management
- MongoDB for data persistence
- User progress tracking
- Experiment history
- Analytics data

## Setup and Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

4. Run development server
```bash
npm run dev
```

## Deployment

The application is designed to be deployed as follows:
- Frontend: Static hosting (Vercel/Netlify/GitHub Pages)
- Backend: Serverless functions
- Database: MongoDB Atlas

## Screenshots

<details>
<summary>📸 Project Screenshots</summary>
<br>

<p align="center">
  <img src="assets/logo.png" width="800" alt="Logo" />
</p>

### Homepage
<p align="center">
  <img src="assets/screenshots/homepage.png" width="600" alt="Home Page">
</p>

### Simulation Interface
<p align="center">
  <img src="assets/screenshots/simulations.png" width="600" alt="Simulation">
</p>

### Learning Dashboard
<p align="center">
  <img src="assets/screenshots/learning.png" width="600" alt="Learning">
</p>

### Analytics View
<p align="center">
  <img src="assets/screenshots/analytic.png" width="600" alt="Analytics">
</p>

</details>

## Implementation Status

### Completed Features
- ✅ User authentication and authorization
- ✅ Pendulum simulation (2D/3D)
- ✅ Interactive learning modules
- ✅ Community features
- ✅ Analytics dashboard
- ✅ Responsive design

### Pending Implementation
- ⏳ Complete state persistence for quiz results
- ⏳ Expanded experiment types
- ⏳ Advanced analytics features
- ⏳ Real-time collaboration features

## Future Roadmap

- 📱 Mobile application development
- 🤝 Real-time collaboration features
- 🔍 Advanced search functionality
- 🌐 Multi-language support
- 🤖 AI-powered learning assistance
- 📊 Enhanced analytics dashboard

## Contributing

This project is part of academic coursework. While it's not open for direct contributions, feedback and suggestions are welcome through the following channels:
- Opening issues for bugs or feature requests
- Submitting pull requests for bug fixes
- Providing feedback through discussions

## Acknowledgments

Special thanks to:
- The shadcn/ui team for the component library
- The open-source community for invaluable resources
- Fellow students for testing and feedback

## License

This project is created for academic purposes at ITB. All rights reserved.

---

<div align="center">
  <p>Made with ❤️ by Dzulfaqor Ali</p>
  <p>© 2024 Institut Teknologi Bandung. All Rights Reserved.</p>
  
  ![Visitors](https://visitor-badge.laobi.icu/badge?page_id=dzulfaqor.virtual-physics-lab)
</div>
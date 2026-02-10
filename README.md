# 🌱 STUA - Sustainable Transport Usage Analyzer

**STUA** is a web application that helps users track, analyze, and reduce their carbon footprint from daily transportation. By comparing emissions across different transport modes, STUA empowers individuals to make informed, eco-friendly travel decisions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-blue)

---

## ✨ Features

- 🗺️ **Trip Planning**: Enter origin, destination, and date to analyze your journey
- 📊 **Emission Comparison**: Compare CO₂ emissions across walking, cycling, public transit, and personal vehicles
- 🚗 **Vehicle Management**: Add your personal vehicles for accurate emission tracking
- 📈 **Analytics Dashboard**: Visualize your environmental impact over time
- 🏆 **Community Rankings**: See how your sustainability efforts compare anonymously
- 🌿 **Sustainability Guide**: Learn best practices for eco-friendly travel
- 🎓 **First-Time Onboarding**: Guided walkthrough for new users

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Google Maps API** for route planning
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **React DatePicker** for date selection

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Firebase Admin** for OAuth
- **bcrypt** for password hashing

### Data Source
- **DEFRA (UK)** Greenhouse Gas Conversion Factors for emission calculations

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Maps API Key
- Firebase Project (for OAuth, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/STUA.git
   cd STUA
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/stua
   JWT_SECRET=your_jwt_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_APP_BACKEND_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

4. **Seed emission factors** (First time only)
   ```bash
   cd backend
   node data/seedEmissions.js
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 📖 Usage

### 1. Sign Up / Login
- Create an account or log in with email/password
- OAuth login via Google (Firebase) is also supported

### 2. Plan a Trip
- Navigate to **Trips** page
- Enter your origin and destination
- Select travel date
- Click "Analyze Eco-Impact"

### 3. Compare & Log
- View emission comparisons for different transport modes
- Add your personal vehicles for accurate tracking
- Select the mode you used and click "I used this mode"

### 4. View Analytics
- Check your **Dashboard** for trip history
- Visit **Analysis** page for detailed insights:
  - Total emissions and distance traveled
  - Mode breakdown (pie chart)
  - Emission trends over time
  - Community ranking

### 5. Learn & Improve
- Visit **Sustainability** tab for eco-friendly travel tips
- Track your carbon savings compared to baseline

---

## 📁 Project Structure

```
STUA/
├── backend/
│   ├── config/          # Database, Firebase config
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── context/     # React Context (Auth)
│   │   └── App.jsx      # Main app component
│   └── index.html
└── PROJECT_DOCUMENTATION.md
```

---

## 🔐 Security

- **JWT Authentication**: Access tokens with refresh token rotation
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: Middleware-based authorization
- **CORS**: Configured for frontend-backend communication
- **Environment Variables**: Sensitive data stored in `.env` files

---

## 🌍 Emission Calculation

STUA uses verified emission factors from **DEFRA (UK Government)**:
- **Baseline**: Average car emissions (150g CO₂/km)
- **Modes**: Walking (0g), Cycling (0g), Bus (80g), Train (35g), Car (varies by fuel/size)
- **Formula**: `Emission (kg) = Distance (km) × Emission Factor (kg/km)`

All values are estimates based on standardized factors and may vary in real-world conditions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **DEFRA** for emission conversion factors
- **Google Maps API** for route planning
- **React** and **Vite** communities
- All contributors and users making sustainable choices

---

## 📧 Contact

For questions or feedback, please open an issue or contact the maintainers.

**Made with 💚 for a greener planet**

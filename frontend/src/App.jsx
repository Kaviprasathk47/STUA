import React from 'react'
import LoginPage from './pages/loginPage/login.jsx';
import SignUpPage from './pages/signUpPage/signUpPage.jsx';
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element = {<LoginPage />} />
      <Route path="/" element = {<SignUpPage />} />
    </Routes>
  )
}

export default App

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import { Navigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} /> 
         <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App

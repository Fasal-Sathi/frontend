import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import ChatBot from "./components/ChatBot";
import BackToTop from "./components/BackToTop";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import RiceDiseaseDetection from "./pages/RiceDiseaseDetection";
import AvailableSchemes from "./pages/AvailableSchemes";

function AppRoutes(){
  const location=useLocation();
  return <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
    <Route path="/" element={<PageTransition><Home/></PageTransition>}/>
    <Route path="/prediction" element={<ProtectedRoute><PageTransition><Prediction/></PageTransition></ProtectedRoute>}/>
    <Route path="/rice-disease-detection" element={<PageTransition><RiceDiseaseDetection/></PageTransition>}/>
    <Route path="/available-schemes" element={<PageTransition><AvailableSchemes/></PageTransition>}/>
    <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile/></PageTransition></ProtectedRoute>}/>
    <Route path="/help" element={<PageTransition><Help/></PageTransition>}/>
    <Route path="/login" element={<PageTransition><Login/></PageTransition>}/>
    <Route path="/signup" element={<PageTransition><Login signup/></PageTransition>}/>
    <Route path="/otp" element={<PageTransition><OTP/></PageTransition>}/>
  </Routes></AnimatePresence>
}
export default function App(){
  const [modal,setModal]=useState(false); const [target,setTarget]=useState("/prediction");
  const openLogin=(to="/prediction")=>{setTarget(to);setModal(true)};
    return <><Navbar onLogin={openLogin}/><main className="pt-[91px] max-[760px]:pt-[77px] min-h-screen"><AppRoutes/></main><Footer/><LoginModal open={modal} onClose={() => setModal(false)} redirectTo={target}/><ChatBot/><BackToTop/></>
}

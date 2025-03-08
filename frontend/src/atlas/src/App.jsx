import { useState } from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Navbar from "./navbar.jsx";
import Home from "./pages/Home.jsx";
import Parameter from "./pages/Parameter.jsx";
import CalculPage from "./pages/CalculPage.jsx";
import Solo from "./pages/Solo.jsx";

import "../public/logo.png";
import Calculator from "./Calcul.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Parameter" element={<Parameter />} />
          <Route path="/CalculPage" element={<CalculPage />} />
          <Route path="/Solo" element={<Solo />} />

        </Routes>
      </Router>
 
    </>
  );
}

export default App;

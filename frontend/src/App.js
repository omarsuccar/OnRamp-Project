import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookie from "js-cookie";
import Loginpage from "./pages/Loginpage";
import Menu from "./menu";
import Signuppageapplicant from "./pages/SignuppageApplicant";
import Signuppagerecruiter from "./pages/SignuppageRecruiter";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = Cookie.get("user");
    const company = Cookie.get("company");
    return !!(user || company);
  });

  useEffect(() => {
    // Function to check authentication status
    const checkAuthStatus = () => {
      const user = Cookie.get("user");
      const company = Cookie.get("company");
      setIsAuthenticated(!!(user || company));
    };

    // Set up an event listener or any other method to detect when cookies change
    window.addEventListener("storage", checkAuthStatus);

    // Clean up listener on unmount
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  useEffect(() => {
    // Update authentication status when cookies change
    const handleCookieChange = () => {
      const user = Cookie.get("user");
      const company = Cookie.get("company");
      setIsAuthenticated(!!(user || company));
    };

    // Set up cookie change detection
    handleCookieChange();

    // Set up an interval to check for cookie changes periodically
    const intervalId = setInterval(handleCookieChange, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/applicant/signup"
          element={
            isAuthenticated ? <Navigate to="/menu" /> : <Signuppageapplicant />
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/menu" /> : <Loginpage />}
        />
        <Route
          path="/menu"
          element={isAuthenticated ? <Menu /> : <Navigate to="/login" />}
        />
        <Route
          path="/company/signup"
          element={
            isAuthenticated ? <Navigate to="/menu" /> : <Signuppagerecruiter />
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/menu" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/menu" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

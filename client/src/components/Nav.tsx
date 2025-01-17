import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import auth from "../utils/auth";

const Nav = () => {
  const currentPage = useLocation().pathname;

  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    checkLogin();
  }, [loginCheck]);

  const handleLogoffSubmit = () => {
    auth.logout();
  };

  const getTitle = () => {
    if (currentPage === "/ShiftHistory") {
      return "Report History";
    } else if (currentPage === "/") {
      if (!loginCheck) {
        return "Login to Create a Shift Report";
      } else {
        return "Report";
      }
    } else {
      return "Page Not Found";
    }
  };

  return (
    <header className="navbar navbar-expand-md navbar-dark sticky-top navbar-custom">
      <nav className="navItem">
        <Link
          to="/"
          className={currentPage === "/" ? "nav-link active" : "nav-link"}
        >
          Create a Report
        </Link>
        <Link
          to="/ShiftHistory"
          className={
            currentPage === "/ShiftHistory"
              ? "nav-bottom nav-link active"
              : "nav-bottom nav-link"
          }
        >
          View History
        </Link>
        <Link
          to="/OTS"
          className={
            currentPage === "/OTS"
              ? "nav-bottom nav-link active"
              : "nav-bottom nav-link"
          }
          style={{
            display:
              loginCheck && auth.getRole() === "supervisor" ? "block" : "none",
          }}
        >
          OTS
        </Link>
      </nav>
      <div className="loginText">
        <h1 className="navbar-title">{getTitle()}</h1>
        <h2
          className="navbar-subtitle"
          style={{
            display: !loginCheck && currentPage === "/" ? "block" : "none",
          }}
        >
          Or Select View History to View Production History
        </h2>
      </div>

      <Link
        to="/CreateAccount"
        className={
          currentPage === "/CreateAccount"
            ? "nav-bottom nav-link active"
            : "nav-bottom nav-link"
        }
        style={{
          display:
            loginCheck && auth.getRole() === "supervisor" ? "block" : "none",
        }}
      >
        Create an Account
      </Link>
      <button
        className="logoff"
        style={{ display: loginCheck ? "block" : "none" }}
        onClick={handleLogoffSubmit}
      >
        Logoff
      </button>
    </header>
  );
};

export default Nav;

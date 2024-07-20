import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faHotel,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../axios/axiosConfig";
import "./Adminsidebar.css"; // Import your custom CSS file for additional styling

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991); // Check if screen is small on initial load

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  // Listen to window resize to update screen size status
  window.addEventListener("resize", () => {
    setIsSmallScreen(window.innerWidth <= 991);
  });

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/auth/protected-route")
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error("Verification error:", error);
        navigate("/"); // Redirect to login if verification fails
      });
  }, [navigate]);

  const handleLogout = () => {
    axios
      .post("http://localhost:5002/api/auth/logout")
      .then((res) => {
        if (res.data === "Logged out successfully") {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <>
      {isSmallScreen && (
        <Navbar expand="lg" variant="dark" bg="primary" className="fixed-top">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleSidebar}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`${isOpen ? "show" : ""}`}
          >
            <Nav className="ml-auto">
              <NavLink
                to={"/"}
                className="text-light text-decoration-none my-2"
              >
                Home
              </NavLink>
              <NavLink
                to={"/admin/client"}
                className="text-light text-decoration-none my-2"
              >
                Company Registration
              </NavLink>
              <NavLink
                to={"/admin/member"}
                className="text-light text-decoration-none my-2"
              >
                Member Registration
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
      {!isSmallScreen && (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <div className="sidebar-toggle" onClick={toggleSidebar}></div>
          <Nav className="flex-column text-dark">
            <h4 className="text-light text-decoration-none mx-3 my-3">
              Welcome
            </h4>
            <NavLink
              to={"/admin/client"}
              className="text-light text-decoration-none mx-3 my-3"
            >
              <FontAwesomeIcon icon={faHotel} className="me-2" /> Company
              Registration
            </NavLink>
            <NavLink
              to={`/admin/member`}
              className="text-light text-decoration-none mx-3 my-3"
            >
              <FontAwesomeIcon icon={faAddressCard} className="me-2" /> Member
              Registration
            </NavLink>
            <NavLink
              to={`/admin/clientdeatil`}
              className="text-light text-decoration-none mx-3 my-3"
            >
              <FontAwesomeIcon icon={faAddressCard} className="me-2" /> Client
              Details
            </NavLink>
            <NavLink
              onClick={handleLogout}
              to={`/`}
              className="text-light text-decoration-none mx-3 my-3"
            >
              <FontAwesomeIcon icon={faUser} className="me-2" /> Logout
            </NavLink>
          </Nav>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;

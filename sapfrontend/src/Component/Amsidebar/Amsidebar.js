import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faMoneyBill,
  faRectangleList,
  faTicket,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Nav, Navbar } from "react-bootstrap";
import "./Amsidebar.css"; // Import your custom CSS file for additional styling
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../axios/axiosConfig";

const Amsidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991); // Check if screen is small on initial load

  const navigate = useNavigate();
  const { id } = useParams();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
      {/* Navbar for small devices */}
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
              <Nav.Link as={Link} to={`/manager/${id}`} className="text-light">
                Ticket Summary
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={`/manager/tickets/${id}`}
                className="text-light"
              >
                Tickets
              </Nav.Link>
              <Nav.Link
                onClick={handleLogout}
                as={Link}
                to={`/`}
                className="text-light"
              >
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}

      {/* Sidebar for large devices */}
      {!isSmallScreen && (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {/* <FontAwesomeIcon icon={isOpen ? faTimes : faBars} /> */}
          </div>
          <Nav className="flex-column text-dark">
            <h3 className="text-light text-decoration-none mx-3 my-3">
              Welcome
            </h3>
            <Nav.Link
              as={Link}
              to={`/manager/${id}`}
              className="text-light text-decoration-none mx-3 my-2"
            >
              <FontAwesomeIcon icon={faRectangleList} className="me-2" />
              TicketSummary
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={`/manager/tickets/${id}`}
              className="text-light text-decoration-none mx-3 my-2"
            >
              <FontAwesomeIcon icon={faTicket} className="me-2" />
              Tickets
            </Nav.Link>
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

export default Amsidebar;

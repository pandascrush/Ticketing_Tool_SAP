import React, { useState } from "react";
import { Nav, Navbar, NavLink } from "react-bootstrap";
import "./Sidebar.css"; // Import your custom CSS file for additional styling
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTicket } from "@fortawesome/free-solid-svg-icons";

const Sidebarnew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991); // Check if screen is small on initial load

  const { id, com, cshort } = useParams();
  const decodedId = atob(id);
  const decodedCom = atob(com);
  const decodedShort = atob(cshort);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Listen to window resize to update screen size status
  window.addEventListener("resize", () => {
    setIsSmallScreen(window.innerWidth <= 991);
  });

  return (
    <>
      {/* Navbar for small devices */}
      {isSmallScreen && (
        <Navbar expand="lg" variant="dark" bg="primary" className="fixed-top">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleSidebar}/>
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`${isOpen ? "show" : ""}`}>
            <Nav className="ml-auto">
            <Nav.Link as={Link} to={`/`}>
               Logout
              </Nav.Link>
              <Nav.Link as={Link} to={`/client/${id}/${com}/${cshort}`}>
                Ticket Booking
              </Nav.Link>
              <Nav.Link as={Link} to={`/client/ticketstatus/${id}`}>
                Ticket Status
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
            <h3 className="text-light mx-3 my-3">Welcome</h3>
          <Nav.Link as={Link}
              to={`/`} className="text-light text-decoration-none mx-3 my-2" >
               <FontAwesomeIcon icon={faHome} className="me-2" />Home </Nav.Link>
            <Nav.Link
              as={Link}
              to={`/client/${id}/${com}/${cshort}`}
              className="text-light text-decoration-none mx-3 my-2" >
               <FontAwesomeIcon icon={faTicket} className="me-2 " />
              TicketBooking
            </Nav.Link>
           
            <Nav.Link as={Link} to={"/ticketstatus"} className="text-light text-decoration-none mx-3 my-2" >
               <FontAwesomeIcon icon={faTicket} className="me-2" />TicketStatus
            </Nav.Link> 
          </Nav>
        </div>
      )}
    </>
  );
};

export default Sidebarnew;

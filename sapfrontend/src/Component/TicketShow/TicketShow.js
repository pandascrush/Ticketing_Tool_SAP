import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Ticketshow.module.css"; // Import CSS module

function TicketShow() {
  const { id, com } = useParams();
  const decodedId = atob(id);
  const Company_name = atob(com);

  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [loading, setLoading] = useState(false); // State to track loading status

  useEffect(() => {
    axios
      .get(
        `http://localhost:5002/api/tickets/getAMTicketDetail/${decodedId}/${Company_name}`
      )
      .then((res) => {
        setTickets(res.data); // Assuming res.data contains an array of tickets with client emails
      })
      .catch((error) => {
        console.error("Error fetching ticket details:", error);
      });

    axios
      .get(`http://localhost:5002/api/internal/getInternal/${decodedId}`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, [decodedId, Company_name]);

  const handleAssign = (ticket) => {
    const employeeName = selectedEmployees[ticket.ticket_id];
    const selectedEmployee = employees.find((emp) => emp.name === employeeName);

    if (selectedEmployee) {
      const consultantMail = selectedEmployee.email;
      const clientMail = ticket.email; // Assuming client_email is a field in the ticket

      console.log(
        `Assigning ticket ${ticket.ticket_id} to employee ${employeeName} ${consultantMail} ${clientMail}`
      );

      setLoading(true); // Set loading state when starting the assignment process

      axios
        .post(`http://localhost:5002/api/tickets/assign`, {
          clientMail,
          consultantMail,
          ticketId: ticket.ticket_id,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Ticket assigned, emails sent, and status updated successfully.") {
            alert("Ticket Assigned Successfully");
          } else if (res.data.message === "Error sending email to client.") {
            alert("Error sending email to client.");
          } else if (res.data.message === "Error sending email to consultant.") {
            alert("Error sending email to consultant.");
          } else if (res.data.message === "Error updating ticket status.") {
            alert("Error updating ticket status.");
          }
        })
        .catch((error) => {
          console.error("Error assigning ticket:", error);
        })
        .finally(() => {
          setLoading(false); // Reset loading state after API call completes
        });
    }
  };

  const handleEmployeeChange = (ticketId, employeeName) => {
    setSelectedEmployees((prevSelectedEmployees) => ({
      ...prevSelectedEmployees,
      [ticketId]: employeeName,
    }));
  };

  return (
    <>
      {tickets.map((ticket) => (
        <div key={ticket.ticket_id} className={`card m-4 ${styles.cardcolor} p-2`}>
          <label>
            <b>Company name</b>
          </label>
          <p>{ticket.company_name}</p>
          <label>
            <b>Ticket Body:</b>
          </label>
          <p>{ticket.ticket_body}</p>
          <div className="d-flex justify-content-between align-items-center">
            <select
              className="form-select"
              value={selectedEmployees[ticket.ticket_id] || ""}
              onChange={(e) =>
                handleEmployeeChange(ticket.ticket_id, e.target.value)
              }
            >
              <option value="">Select the Employee</option>
              {employees.map((emp) => (
                <option key={emp.emp_id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={`btn btn-primary m-2 ${styles.ticketbutton}`}
              onClick={() => handleAssign(ticket)}
              disabled={!selectedEmployees[ticket.ticket_id] || loading}
            >
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                "Assign"
              )}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default TicketShow;

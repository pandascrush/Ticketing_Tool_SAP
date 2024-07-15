import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Ticketshow.css";

function TicketShow() {
  const { id, com } = useParams();
  const decodedId = atob(id);
  const Company_name = atob(com);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5002/api/tickets/getAMTicketDetail/${decodedId}/${Company_name}`
      )
      .then((res) => {
        setTickets(res.data);
      })
      .catch((error) => {
        console.error("Error fetching ticket details:", error);
      });
  }, [decodedId]);

  return (
    <>
      {tickets.map((e) => (
        <div className="card m-4 cardcolor p-2">
          <label>
            <b>Company name</b>
          </label>
          <p> {e.company_name}</p>
          <label>
            <b>Ticket Body:</b>
          </label>
          <p>{e.ticket_body}</p>
          <div className="d-flex justify-content-between">
            <select className="form-select">
              <option>Select the Employee</option>
              <option value="Mr.Ram">Mr.Ram</option>
              <option value="Mr.Dev">Mr.Dev</option>
              <option value="Mr.Jim">Mr.Jim</option>
              <option value="Mr.Jam">Mr.Jam</option>
            </select>
            <input
              type="submit"
              value="Assign"
              className="btn btn-primary m-2"
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default TicketShow;

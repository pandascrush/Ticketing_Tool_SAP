import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./TicketsList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";

const TicketsList = () => {
  const { id, company } = useParams();
  const emp_id = atob(id);
  const company_name = atob(company);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5002/api/seniorcons/tickets/${emp_id}/${company_name}`
      )
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, [emp_id, company_name]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Tickets for {company_name}</h1>
      <ul className={styles.list}>
        {tickets.map((ticket) => (
          <li key={ticket.ticket_id} className={styles.listItem}>
            <h2 className={styles.subject}>{ticket.subject}</h2>
            <p className={styles.body}>{ticket.ticket_body}</p>
            <p className={styles.status}>
              Status: {ticket.status_name}
              {ticket.status_name === "In Progress" && (
                <FontAwesomeIcon icon={faSpinner} className={styles.loadingIcon} spin />
              )}
            </p>
            <p className={styles.timestamp}>
              Created At: {moment(ticket.timestamp).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A")}
            </p>
            {ticket.screenshot && (
              <div className={styles.screenshotContainer}>
                <label><b>Screenshot:</b></label>
                <img
                  src={ticket.screenshot}
                  alt="Screenshot"
                  className={styles.screenshot}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketsList;

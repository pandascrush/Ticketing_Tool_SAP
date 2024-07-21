import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./AccountManagerTicketTrack.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";

const AccountManagerTicketTrack = () => {
  const { am_id, ticket_id } = useParams();
  const decodedId = atob(am_id);
  const decodedTicketId = atob(ticket_id);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/tickets/track/${decodedId}/${decodedTicketId}`
        );
        setTickets(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [decodedId, decodedTicketId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tickets Assigned to You</h1>
      {loading && (
        <div className={styles.loading}>
          <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
          Loading...
        </div>
      )}
      <ul className={styles.list}>
        {tickets.map((ticket) => (
          <li key={ticket.ticket_id} className={styles.card}>
            <h2 className={styles.cardTitle}>{ticket.subject}</h2>
            <p className={styles.cardText}>{ticket.ticket_body}</p>
            {ticket.screenshot && (
              <div className={styles.screenshotContainer}>
                <label><b>Screenshot:</b></label>
                <img src={ticket.screenshot} alt="Screenshot" className={styles.screenshot} />
              </div>
            )}
            {ticket.corrected_file && (
              <a href={ticket.corrected_file} download className={styles.correctedFileLink}>
                Download Corrected File
              </a>
            )}
            <p className={styles.timestamp}>
              Created At: {moment(ticket.created_at).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A")}
            </p>
            <p>Consultant Email: {ticket.consultant_email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountManagerTicketTrack;

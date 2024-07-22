import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./AccountManagerTicketTrack.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import Modal from "react-modal";

// Make sure to bind modal to your appElement (for screen readers)
Modal.setAppElement("#root");

const AccountManagerTicketTrack = () => {
  const { am_id, ticket_id } = useParams();
  const decodedId = atob(am_id);
  const decodedTicketId = atob(ticket_id);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [sending, setSending] = useState(false); // New state for sending spinner

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
        alert("Error fetching tickets. Please try again later.");
      }
    };

    fetchTickets();
  }, [decodedId, decodedTicketId]);

  const handleOpenModal = (ticketId) => {
    setCurrentTicketId(ticketId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRemarks("");
  };

  const handleSendChanges = async () => {
    const consultantEmail = tickets.find(
      (ticket) => ticket.ticket_id === currentTicketId
    ).consultant_email;

    setSending(true); // Start spinner

    try {
      const response = await axios.post("http://localhost:5002/api/tickets/submitChanges", {
        am_id: decodedId,
        ticket_id: currentTicketId,
        consultant_email: consultantEmail,
        remarks,
      });

      setSending(false); // Stop spinner

      if (response.data.message === "Changes submitted and email sent successfully") {
        alert("Remarks sent successfully.");
        handleCloseModal();
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      setSending(false); // Stop spinner
      console.error("Error submitting changes:", error);
      alert("Error submitting remarks. Please try again later.");
    }
  };

  const handleApprove = async (ticketId) => {
    // Handle the approve action here
    alert(`Ticket ${ticketId} approved.`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tickets Assigned to You</h1>
      {loading && (
        <div className={styles.loading}>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={styles.loadingIcon}
          />
          Loading...
        </div>
      )}
      <ul className={styles.list}>
        {tickets.map((ticket) => (
          <li key={ticket.ticket_id} className={styles.card}>
            <h2 className={styles.cardTitle}>{ticket.subject}</h2>
            <p className={styles.cardText}>{ticket.ticket_body}</p>
            {ticket.corrected_file && (
              <a
                href={ticket.corrected_file}
                download
                className={styles.correctedFileLink}
              >
                Download Submission File
              </a>
            )}
            <p>Consultant Email: {ticket.consultant_email}</p>
            <button
              onClick={() => handleOpenModal(ticket.ticket_id)}
              className={styles.changeButton}
            >
              Changes
            </button>
            <button
              onClick={() => handleApprove(ticket.ticket_id)}
              className={styles.approveButton}
            >
              Approve
            </button>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Submit Changes</h2>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={handleSendChanges} className={styles.sendButton} disabled={sending}>
          {sending ? (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className={styles.loadingIcon}
            />
          ) : (
            "Send"
          )}
        </button>
        <button onClick={handleCloseModal} className={styles.closeButton}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default AccountManagerTicketTrack;

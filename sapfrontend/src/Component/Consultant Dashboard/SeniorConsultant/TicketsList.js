import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./TicketsList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";

const TicketsList = () => {
  const { id, company } = useParams();
  const emp_id = atob(id);
  const company_name = atob(company);
  const [tickets, setTickets] = useState([]);
  const [amid, setAmid] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/seniorcons/tickets/${emp_id}/${company_name}`)
      .then((response) => {
        setAmid(response.data[0].am_id);
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, [emp_id, company_name]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed.");
      setSelectedFile(null);
    } else {
      setFileError("");
      setSelectedFile(file);
    }
  };

  const handleFileButtonClick = (ticket_id) => {
    document.getElementById(`fileInput-${ticket_id}`).click();
  };

  const handleSubmit = (ticket) => {
    if (!selectedFile) {
      setFileError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("ticket_id", ticket.ticket_id);
    formData.append("subject", ticket.subject);
    formData.append("ticket_body", ticket.ticket_body);
    formData.append("screenshot", ticket.screenshot);
    formData.append("am_id", amid);
    formData.append("emp_id", emp_id);
    formData.append("corrected_file", selectedFile);

    axios
      .post("http://localhost:5002/api/seniorcons/correct", formData)
      .then((response) => {
        alert("Correction submitted successfully");
        setSelectedFile(null); // Clear the selected file after submission
      })
      .catch((error) => {
        console.error("Error submitting correction:", error);
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Tickets for {company_name}</h1>
      <ul className={styles.list}>
        {tickets.map((ticket) => (
          <li key={ticket.ticket_id} className={styles.listItem}>
            <div className={styles.ticketHeader}>
              <h2 className={styles.subject}>{ticket.subject}</h2>
              <p className={styles.status}>
                {ticket.status_name}
                {ticket.status_name === "In Progress" && (
                  <FontAwesomeIcon icon={faSpinner} className={styles.loadingIcon} spin />
                )}
              </p>
            </div>
            <p className={styles.body}>{ticket.ticket_body}</p>
            <p className={styles.timestamp}>
              Created At: {moment(ticket.timestamp).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A")}
            </p>
            {ticket.screenshot && (
              <div className={styles.screenshotContainer}>
                <label>
                  <b>Screenshot:</b>
                </label>
                <img src={ticket.screenshot} alt="Screenshot" className={styles.screenshot} />
              </div>
            )}
            <div className={styles.fileUploadContainer}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                id={`fileInput-${ticket.ticket_id}`}
                className={styles.fileInput}
              />
              {fileError && <p className={styles.error}>{fileError}</p>}
              <button
                onClick={() => handleFileButtonClick(ticket.ticket_id)}
                className={styles.chooseFileButton}
              >
                <FontAwesomeIcon icon={faFilePdf} className={styles.fileIcon} />
                {selectedFile ? selectedFile.name : "Choose File"}
              </button>
              {selectedFile && (
                <p className={styles.fileName}>{selectedFile.name}</p>
              )}
              <button
                onClick={() => handleSubmit(ticket)}
                className={styles.submitButton}
              >
                Submit Correction
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketsList;

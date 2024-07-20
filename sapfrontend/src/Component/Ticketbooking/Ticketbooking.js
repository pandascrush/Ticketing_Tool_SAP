import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import styles from "./Ticketbooking.module.css";

const TicketForm = () => {
  const { id, com, cshort } = useParams();
  const client_id = atob(id);
  const company_name = atob(com);
  const company_short_name = atob(cshort);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    subject: "",
    ticket_body: "",
    client_id: client_id,
    priority_id: "1",
    subdivision_id: "",
    screenshot: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/serve/${client_id}/services`)
      .then((res) => {
        const allSubdivisions = res.data.flatMap(
          (service) => service.subdivisions
        );
        setServices(allSubdivisions);
      })
      .catch((e) => {
        alert("Server is down...");
      });
  }, [client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, screenshot: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("ticket_body", formData.ticket_body);
    formDataToSend.append("client_id", formData.client_id);
    formDataToSend.append("priority_id", formData.priority_id);
    formDataToSend.append("subdivision_id", formData.subdivision_id);
    formDataToSend.append("screenshot", formData.screenshot);

    try {
      const response = await axios.post(
        `http://localhost:5002/api/tickets/create/${company_name}/${company_short_name}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Ticket created successfully:", response.data);

      if (
        response.data.message === "Ticket created successfully and emails sent."
      ) {
        alert("Ticket Created Successfully. Check your mail");
      } else if (
        response.data.message ===
        "Ticket created, but failed to send email to account manager."
      ) {
        alert("Ticket created, but failed to send email to account manager");
      } else if (
        response.data.message ===
        "Ticket created, but failed to send email to client."
      ) {
        alert("Ticket created, but failed to send email to client.");
      }

      setFormData(initialFormData); // Reset form data
      setLoading(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert("No email information found.");
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.totalbg}>
      <h1 className="text-center my-4">CREATE YOUR TICKET</h1>
      <div className="d-flex flex-column justify-content-center align-items-center px-5">
        <div className={styles.shadowcard}>
          {loading && (
            <div className={styles.loadingOverlay}>
              <ReactLoading type="spin" color="#000" height={30} width={30} />
            </div>
          )}
          <div className={`card p-3 ${styles.shadowcard}`}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className={`form-control ${styles.uniformWidth}`}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ticket Body</label>
                <textarea
                  name="ticket_body"
                  value={formData.ticket_body}
                  onChange={handleChange}
                  className={`form-control ${styles.uniformWidth}`}
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Priority</label>
                <select
                  name="priority_id"
                  value={formData.priority_id}
                  onChange={handleChange}
                  className={`form-control ${styles.uniformWidth}`}
                >
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Project</label>
                <select
                  name="subdivision_id"
                  value={formData.subdivision_id}
                  onChange={handleChange}
                  className={`form-control ${styles.uniformWidth}`}
                  required
                >
                  <option value="">Select a Subdivision</option>
                  {services.map((subdivision) => (
                    <option
                      key={subdivision.subdivision_id}
                      value={subdivision.subdivision_id}
                    >
                      {subdivision.subdivision_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Screenshot</label>
                <input
                  type="file"
                  name="screenshot"
                  onChange={handleFileChange}
                  className={`form-control ${styles.uniformWidth}`}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`mt-2 btn ${styles.ticketbutton}`}
              >
                {loading ? (
                  <span className={styles.spinner}></span>
                ) : (
                  "Create Ticket"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import styles from "./TicketStatus.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons"; // Import PDF icon

function TicketStatus() {
  const { id } = useParams();
  const decodedId = atob(id);
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/tickets/status/${decodedId}`);
        if (res.data.message) {
          setErrorMessage(res.data.message);
        } else {
          setTicketData(res.data);
        }
      } catch (err) {
        console.error("Server Error:", err);
        setErrorMessage("Server Error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [decodedId]);

  // Function to handle attachment download
  const handleDownload = async (attachmentUrl, fileName) => {
    try {
      const response = await axios.get(attachmentUrl, {
        responseType: 'blob', // Ensure response type is blob (binary data)
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Set the download attribute with the filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };

  return (
    <Container className={styles.ticketStatusContainer} fluid>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errorMessage ? (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      ) : ticketData.length > 0 ? (
        <Row>
          {ticketData.map((ticket) => (
            <Col key={ticket.ticket_id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className={styles.ticketCard} border="light" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: '0.3s' }}>
                <Card.Body>
                  <Card.Title className={styles.ticketTitle}>
                    Ticket No: {ticket.ticket_id}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Service: {ticket.service_name}
                  </Card.Subtitle>
                  <Card.Text className={styles.ticketBody} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ticket.ticket_body}
                  </Card.Text>
                  <Card.Text className={styles.statusName} style={{ fontWeight: 'bold', color: '#007bff' }}>
                    Status: {ticket.status_name}
                  </Card.Text>
                  {ticket.screenshot && (
                    <Button
                      variant="primary"
                      onClick={() => handleDownload(`${ticket.screenshot}`, `screenshot-${ticket.ticket_id}.${ticket.screenshot.split('.').pop()}`)}
                    >
                      Download Attachment
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No ticket data available
        </Alert>
      )}
    </Container>
  );
}

export default TicketStatus;

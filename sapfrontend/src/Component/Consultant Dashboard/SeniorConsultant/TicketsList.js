import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Badge,
  Box,
  Input,
  Alert,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";

const TicketsList = () => {
  const { id, company } = useParams();
  const emp_id = atob(id);
  const company_name = atob(company);
  const [tickets, setTickets] = useState([]);
  const [amid, setAmid] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [ticketCounts, setTicketCounts] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/seniorcons/tickets/${emp_id}/${company_name}`)
      .then((response) => {
        setAmid(response.data[0].am_id);
        setTickets(response.data);
        response.data.forEach((ticket) => {
          fetchTicketSubmissionCount(ticket.ticket_id);
        });
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, [emp_id, company_name]);

  const fetchTicketSubmissionCount = (ticket_id) => {
    axios
      .get(`http://localhost:5002/api/seniorcons/ticketSubmissionCount/${ticket_id}`)
      .then((response) => {
        setTicketCounts((prevCounts) => ({
          ...prevCounts,
          [ticket_id]: response.data.count,
        }));
      })
      .catch((error) => {
        console.error("Error fetching ticket submission count:", error);
      });
  };

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
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Tickets for {company_name}
      </Typography>
      <List>
        {tickets.map((ticket) => (
          <ListItem key={ticket.ticket_id}>
            <Card variant="outlined" style={{ width: "100%" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" component="h2">
                    {ticket.subject}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                      {ticket.status_name}
                    </Typography>
                    {ticket.status_name === "In Progress" || ticket.status_name === "Answered" && (
                      <Link to={`/seniorcons/submissionChanges/${btoa(amid)}/${btoa(ticket.ticket_id)}`}>
                        <IconButton aria-label="notifications">
                          <Badge badgeContent={ticketCounts[ticket.ticket_id]} color="primary">
                            <FontAwesomeIcon icon={faBell} />
                          </Badge>
                        </IconButton>
                      </Link>
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" component="p">
                  {ticket.ticket_body}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Created At: {moment(ticket.timestamp).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A")}
                </Typography>
                {ticket.screenshot && (
                  <Box mt={2}>
                    <Typography variant="body2" component="p">
                      <b>Screenshot:</b>
                    </Typography>
                    <img src={ticket.screenshot} alt="Screenshot" style={{ maxWidth: "100%" }} />
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    id={`fileInput-${ticket.ticket_id}`}
                    style={{ display: "none" }}
                  />
                  {fileError && <Alert severity="error">{fileError}</Alert>}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleFileButtonClick(ticket.ticket_id)}
                    startIcon={<FontAwesomeIcon icon={faFilePdf} />}
                    style={{ marginBottom: "8px" }}
                  >
                    {selectedFile ? selectedFile.name : "Choose File"}
                  </Button>
                  {selectedFile && (
                    <Typography variant="body2" color="textSecondary">
                      {selectedFile.name}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleSubmit(ticket)}
                    disabled={!selectedFile}
                  >
                    Submit Correction
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TicketsList;

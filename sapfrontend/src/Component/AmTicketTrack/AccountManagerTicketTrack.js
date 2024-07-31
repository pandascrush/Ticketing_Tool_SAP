import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Modal,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/system";

// Define the theme
const theme = createTheme({
  palette: {
    background: {
      paper: "#ffffff",
    },
  },
  shadows: ["none", "0px 3px 5px rgba(0,0,0,0.3)"],
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

const StyledContainer = styled(Container)({
  marginTop: "20px",
});

const StyledCard = styled(Card)({
  marginBottom: "20px",
});

const StyledButton = styled(Button)({
  margin: "5px",
});

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  outline: "none",
}));

const AccountManagerTicketTrack = () => {
  const { am_id, ticket_id } = useParams();
  const decodedId = atob(am_id);
  const decodedTicketId = atob(ticket_id);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        axios
          .get(
            `
          http://localhost:5002/api/tickets/track/${decodedId}/${decodedTicketId}
        `
          )
          .then((response) => {
            setTickets(response.data);
            console.log(response.data);
            setLoading(false);
          });
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

    setSending(true);

    try {
      const response = await axios.post(
        "http://localhost:5002/api/tickets/submitChanges",
        {
          am_id: decodedId,
          ticket_id: currentTicketId,
          consultant_email: consultantEmail,
          remarks,
        }
      );

      setSending(false);

      if (
        response.data.message ===
        "Changes submitted and email sent successfully"
      ) {
        alert("Remarks sent successfully.");
        handleCloseModal();
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      setSending(false);
      console.error("Error submitting changes:", error);
      alert("Error submitting remarks. Please try again later.");
    }
  };

  const handleApprove = async (ticketId) => {
    const ticket = tickets.find((t) => t.ticket_id === ticketId);
    const consultantEmail = ticket.consultant_email;
    const clientEmail = ticket.client_email; // Assuming client_email is part of the ticket data
    const corrected_file = ticket.corrected_file;
    const subject = ticket.subject;
    const ticket_body = ticket.ticket_body;

    try {
      const response = await axios.post(
        "http://localhost:5002/api/tickets/approve",
        {
          am_id: decodedId,
          ticket_id: ticketId,
          consultant_email: consultantEmail,
          client_email: clientEmail,
          subject: subject,
          corrected_file: corrected_file,
          ticket_body: ticket_body,
        }
      );

      if (response.data.message === "Email sent successfully") {
        alert("Approval emails sent to consultant and client.");
      } else if (response.data.message === "Error sending email") {
        alert("Check Your Connection");
        console.log(response.data.message);
      } else if (response.data.message === "Missing required fields") {
        console.log("Missing required fields");
      } else if (response.data.message === "Error updating ticket status") {
        alert("Error updating ticket status");
      } else {
        console.log("server issue");
      }
    } catch (error) {
      console.error("Error sending approval emails:", error);
      alert("Error sending emails. Please try again later.");
    }
  };

  const formatToIST = (utcDateString) => {
    const date = new Date(utcDateString);
    const istOffset = 5.5 * 60; // IST offset in minutes (5 hours 30 minutes)
    const istDate = new Date(date.getTime() + istOffset * 60 * 1000);
    return istDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <Typography variant="h4" gutterBottom style={{ margin: '20px 0', color: '#1E3A8A' }}>
          Submission
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {tickets.map((ticket) => (
              <StyledCard key={ticket.ticket_id}>
                <CardContent>
                  <Typography variant="h5">{ticket.subject}</Typography>
                  <Typography variant="body2">{ticket.ticket_body}</Typography>
                  {ticket.corrected_file && (
                    <Button
                      href={ticket.corrected_file}
                      download
                      startIcon={<DownloadIcon />}
                    >
                      Download Submission File
                    </Button>
                  )}
                  <Typography variant="body2">
                    Consultant Email: {ticket.consultant_email}
                  </Typography>
                  <Typography variant="body2">
                    created_at:{" "}
                    {ticket.created_at ? formatToIST(ticket.created_at) : "N/A"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(ticket.ticket_id)}
                  >
                    Changes
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    onClick={() => handleApprove(ticket.ticket_id)}
                  >
                    Approve
                  </StyledButton>
                </CardActions>
              </StyledCard>
            ))}
          </Box>
        )}

        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <StyledModalBox>
            <Typography variant="h6">Submit Changes</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              variant="outlined"
              margin="normal"
              label="Remarks"
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleSendChanges}
                disabled={sending}
                startIcon={sending && <FontAwesomeIcon icon={faSpinner} spin />}
              >
                {sending ? "Sending..." : "Send"}
              </StyledButton>
              <StyledButton variant="outlined" onClick={handleCloseModal}>
                Close
              </StyledButton>
            </Box>
          </StyledModalBox>
        </Modal>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default AccountManagerTicketTrack;

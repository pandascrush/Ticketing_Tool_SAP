import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const TicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { id } = useParams();
  const amId = atob(id);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/admin/getAmIdBasedTicketFetch/${amId}`)
      .then((response) => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [amId]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const getIconByFileType = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    switch (fileExtension) {
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'jpeg':
      case 'jpg':
      case 'png':
        return <ImageIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  const handleDownload = async (attachmentUrl, fileName) => {
    try {
      const response = await axios.get(attachmentUrl, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };

  // Filter tickets based on the search term
  const filteredTickets = tickets.filter(ticket =>
    ticket.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Tickets for IT Service: {amId}
      </Typography>
      <TextField
        label="Search by Company Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Consultant Email</TableCell>
              <TableCell>Account Manager Email</TableCell> {/* New Column */}
              <TableCell>Status</TableCell>
              <TableCell>Attachment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.ticket_id}>
                <TableCell>{ticket.ticket_id}</TableCell>
                <TableCell>{ticket.ticket_body}</TableCell>
                <TableCell>{ticket.company_name}</TableCell>
                <TableCell>{ticket.consultant_email || "Not Assigned"}</TableCell>
                <TableCell>{ticket.account_manager_email || "Not Assigned"}</TableCell> {/* New Data */}
                <TableCell>{ticket.status_name}</TableCell>
                <TableCell>
                  {ticket.attachment && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={getIconByFileType(ticket.attachment)}
                      onClick={() => handleDownload(ticket.attachment, `screenshot-${ticket.ticket_id}.${ticket.attachment.split('.').pop()}`)}
                    >
                      Download Attachment
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TicketTable;

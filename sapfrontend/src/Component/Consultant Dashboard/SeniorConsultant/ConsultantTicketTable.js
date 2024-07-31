import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
  TextField,
  IconButton
} from "@mui/material";
import { AiOutlineFilePdf, AiOutlineFileImage, AiOutlineFileText, AiOutlineFileUnknown } from 'react-icons/ai';
import { Search as SearchIcon } from '@mui/icons-material';

function ConsultantTicketTable() {
  const { id } = useParams();
  const decodeId = atob(id);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/seniorcons/ticketdetail/${decodeId}`)
      .then((res) => {
        setTickets(res.data.tickets);
        setFilteredTickets(res.data.tickets); // Initialize filtered tickets
      })
      .catch((error) => {
        console.error("Error fetching ticket details:", error);
      });
  }, [decodeId]);

  const getFileIcon = (url) => {
    const fileExtension = url.split('.').pop().toLowerCase();
    switch (fileExtension) {
      case 'pdf':
        return <AiOutlineFilePdf />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <AiOutlineFileImage />;
      case 'txt':
        return <AiOutlineFileText />;
      default:
        return <AiOutlineFileUnknown />;
    }
  };

  const downloadFile = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop(); // Extract filename from URL
    link.click();
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = tickets.filter(ticket =>
      ticket.ticket_id.toLowerCase().includes(term) ||
      ticket.company_name.toLowerCase().includes(term)
    );
    setFilteredTickets(filtered);
  };

  return (
    <Paper style={{ padding: "16px" }}>
      <Typography variant="h4"
        gutterBottom
        style={{ margin: "20px 0", color: "#1E3A8A" }}>
        Consultant Ticket Table
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
      <TableContainer style={{ marginTop: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Ticket Body</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>AM ID</TableCell>
              <TableCell>Attachment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.ticket_id}>
                <TableCell>{ticket.ticket_id}</TableCell>
                <TableCell>{ticket.company_name}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.ticket_body}</TableCell>
                <TableCell>{ticket.status_name}</TableCell>
                <TableCell>{ticket.am_id}</TableCell>
                <TableCell>
                  {ticket.screenshot && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={getFileIcon(ticket.screenshot)}
                      onClick={() => downloadFile(ticket.screenshot)}
                    >
                      Download
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ConsultantTicketTable;

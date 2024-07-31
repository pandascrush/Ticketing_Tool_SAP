import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  Typography,
  Box,
} from "@mui/material";

function AmTicketTable() {
  const { id } = useParams();
  const decodeId = atob(id);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/tickets/amtickets/${decodeId}`)
      .then((res) => {
        setTickets(res.data.tickets);
        setFilteredTickets(res.data.tickets);
      })
      .catch((error) => {
        console.error("Error fetching ticket data:", error);
      });
  }, [decodeId]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = tickets.filter((ticket) => {
      return (
        (ticket.ticket_id &&
          ticket.ticket_id
            .toString()
            .toLowerCase()
            .includes(lowercasedFilter)) ||
        (ticket.company_name &&
          ticket.company_name.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ margin: "20px 0", color: "#1E3A8A" }}
      >
        Ticket Details
      </Typography>
      <TextField
        label="Search by Ticket ID or Company Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearchChange}
        value={searchTerm}
      />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Consultant ID</TableCell>
                <TableCell>Priority ID</TableCell>
                <TableCell>Ticket Body</TableCell>
                <TableCell>Ticket Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => (
                  <TableRow key={ticket.ticket_id}>
                    <TableCell>{ticket.ticket_id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.company_name}</TableCell>
                    <TableCell>{ticket.consultant_emp_id}</TableCell>
                    <TableCell>{ticket.priority_id}</TableCell>
                    <TableCell>{ticket.ticket_body}</TableCell>
                    <TableCell>{ticket.status_name}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default AmTicketTable;

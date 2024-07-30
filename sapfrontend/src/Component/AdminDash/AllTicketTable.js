import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

function AllTicketTable() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5002/api/admin/getalltickets")
      .then((res) => {
        console.log(res)
        setTickets(res.data); // Assuming the API returns an array of ticket objects
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom style={{ margin: '20px 0', color: '#1E3A8A' }}>
        All Tickets
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Consultant Email</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Account Manager Email</TableCell>
              <TableCell>Ticket Body</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.ticket_id}>
                <TableCell>{ticket.ticket_id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.status_name}</TableCell>
                <TableCell>{ticket.consultant_mail}</TableCell>
                <TableCell>{ticket.company_name}</TableCell>
                <TableCell>{ticket.account_manager_mail}</TableCell>
                <TableCell>{ticket.ticket_body}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AllTicketTable;

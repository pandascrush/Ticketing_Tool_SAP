import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";

function ClientTable() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/admin/getallclient")
      .then((res) => {
        console.log(res);

        setClients(res.data);
      })
      .catch((error) => {
        console.error("Error fetching client data:", error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-center bg-primary text-muted p-2 text-warning">
        Client details
      </h1>
      <TextField
        label="Search by Company Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearch}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Short Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>GST Number</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.company}>
                <TableCell>{client.company}</TableCell>
                <TableCell>{client.company_short_name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.gst_no}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  {new Date(client.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ClientTable;

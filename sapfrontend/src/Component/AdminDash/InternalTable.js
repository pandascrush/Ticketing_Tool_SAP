import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Container, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function InternalTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5002/api/admin/getallinternal')
      .then(res => {
        setData(res.data || []);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on search term
  const filteredData = data.filter(item => {
    const name = item.Employee_name ? item.Employee_name.toLowerCase() : '';
    const empId = item.emp_id ? item.emp_id.toString().toLowerCase() : '';
    const search = searchTerm.toLowerCase();

    return name.includes(search) || empId.includes(search);
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ margin: '20px 0', color: '#1E3A8A' }}>
        Internal Employees Table
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search by name or employee ID"
        fullWidth
        style={{ marginBottom: '20px' }}
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Head ID</TableCell>
              <TableCell>AM ID</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Consultant Ticket Count</TableCell>
              <TableCell>Account Manager Ticket Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.Employee_name || 'N/A'}</TableCell>
                <TableCell>{row.email || 'N/A'}</TableCell>
                <TableCell>{row.emp_id || 'N/A'}</TableCell>
                <TableCell>{row.head_id || 'N/A'}</TableCell>
                <TableCell>{row.am_id || 'N/A'}</TableCell>
                <TableCell>{row.mobile || 'N/A'}</TableCell>
                <TableCell>{row.consultant_ticket_count || 'N/A'}</TableCell>
                <TableCell>{row.account_manager_ticket_count || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default InternalTable;

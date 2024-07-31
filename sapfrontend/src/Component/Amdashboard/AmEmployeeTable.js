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

function AmEmployeeTable() {
  const { id } = useParams();
  const decodeId = atob(id);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/tickets/empdetail/${decodeId}`)
      .then((res) => {
        setEmployees(res.data.result);
        setFilteredEmployees(res.data.result);
      })
      .catch((error) => {
        console.error("Error fetching employee details:", error);
      });
  }, [decodeId]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = employees.filter((employee) => {
      return (
        (employee.emp_id &&
          employee.emp_id
            .toString()
            .toLowerCase()
            .includes(lowercasedFilter)) ||
        (employee.name &&
          employee.name.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

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
        Employee Details
      </Typography>
      <TextField
        label="Search by Employee ID or Name"
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
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow key={employee.emp_id}>
                    <TableCell>{employee.emp_id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.mobile}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default AmEmployeeTable;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Container,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { styled } from "@mui/system";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Custom styles for cards
const StyledCard = styled(Card)(({ size }) => ({
  backgroundColor: "#ffffff",
  minHeight: size === "small" ? "80px" : "120px",
  borderRadius: "10px",
  boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.3)",
  marginBottom: "20px",
  textAlign: "center",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  textDecoration: "none",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 16px 30px rgba(0, 0, 0, 0.4)",
  },
}));

const StyledCardContent = styled(CardContent)(({ size }) => ({
  padding: size === "small" ? "5px" : "10px",
  minHeight: size === "small" ? "60px" : "80px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1rem",
  color: "#000000",
});

// Options for Doughnut charts
const chartOptions = (navigate, type) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return tooltipItem.label + ": " + tooltipItem.raw;
        },
      },
    },
  },
  onClick: (event) => {
    navigate(type);
  },
});

function TicketSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decodeId = atob(id);
  const [ticketData, setTicketData] = useState({
    total_tickets: 0,
    status_1_tickets: 0,
    status_2_tickets: 0,
    status_3_tickets: 0,
    status_4_tickets: 0,
    status_5_tickets: 0,
  });
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/tickets/count/${decodeId}`)
      .then((response) => {
        setTicketData(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching ticket data:", error);
      });

    axios
      .get(`http://localhost:5002/api/tickets/empcount/${decodeId}`)
      .then((response) => {
        setEmployeeCount(response.data.count[0].employee_count);
      })
      .catch((error) => {
        console.error("Error fetching employee count:", error);
      });
  }, [decodeId]);

  // Data for Doughnut charts
  const ticketDataChart = {
    labels: ["Total Tickets", "Raised", "Assigned", "In Progress", "Approved", "Completed"],
    datasets: [
      {
        data: [
          ticketData.total_tickets,
          ticketData.status_1_tickets,
          ticketData.status_2_tickets,
          ticketData.status_3_tickets,
          ticketData.status_4_tickets,
          ticketData.status_5_tickets,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#f44336", "#9c27b0", "#00bcd4"],
      },
    ],
  };

  const employeeDataChart = {
    labels: ["Employees"],
    datasets: [
      {
        data: [employeeCount],
        backgroundColor: ["#3f51b5"],
      },
    ],
  };

  return (
    <Container>
      <Box mt={4}>
        <Grid container spacing={4}>
          {/* Cards for ticket data */}
          <Grid item xs={12} md={4}>
            <StyledCard className="card" size="small" component={Link} to={`/manager/amtickets/${id}`}>
              <StyledCardContent size="small">
                <StyledTypography>Total Tickets</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.total_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard className="card" size="small" component={Link} to={`/manager/amtickets/${id}`}>
              <StyledCardContent size="small">
                <StyledTypography>Raised</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_1_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard className="card" size="small" component={Link} to={`/manager/amtickets/${id}`}>
              <StyledCardContent size="small">
                <StyledTypography>Assigned</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_2_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard className="card" size="small" component={Link} to={`/manager/amtickets/${id}`}>
              <StyledCardContent size="small">
                <StyledTypography>In Progress</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_3_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard className="card" size="small" component={Link} to={`/manager/amtickets/${id}`}>
              <StyledCardContent size="small">
                <StyledTypography>Approved</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_4_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard className="card" size="small" component={Link} to={`/manager/amtickets/${id}`}>
              <StyledCardContent size="small">
                <StyledTypography>Completed</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_5_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          {/* Individual Doughnut Charts */}
          <Grid item xs={12} md={6}>
              <StyledCardContent>
                <StyledTypography>Ticket Data</StyledTypography>
                <div style={{ width: "100%", height: "350px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Doughnut data={ticketDataChart} options={chartOptions(navigate, `/manager/amtickets/${id}`)} />
                </div>
              </StyledCardContent>
          </Grid>
          <Grid item xs={12} md={6}>
              <StyledCardContent>
                <StyledTypography>Employee Data</StyledTypography>
                <div style={{ width: "100%", height: "350px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Doughnut data={employeeDataChart} options={chartOptions(navigate, `/manager/empdetail/${id}`)} />
                </div>
              </StyledCardContent>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default TicketSummary;

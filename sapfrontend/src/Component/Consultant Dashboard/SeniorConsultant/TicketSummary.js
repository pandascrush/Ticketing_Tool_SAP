import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

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

const ChartContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "20px",
});

const ChartWrapper = styled(Box)({
  width: "60%",
  height: "250px",
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
      },
    },
    title: {
      display: true,
      text: 'Ticket Status Distribution',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
  },
};

function TicketSummary() {
  const { id } = useParams();
  const decodeId = atob(id);

  const [ticketData, setTicketData] = useState({
    total_tickets: 0,
    status_1_tickets: 0,
    status_2_tickets: 0,
    status_3_tickets: 0,
    status_4_tickets: 0,
    status_5_tickets: 0,
  });

  const doughnutData = {
    labels: ['Raised', 'Assigned', 'In Progress', 'Approved', 'Completed'],
    datasets: [
      {
        label: 'Ticket Status',
        data: [
          ticketData.status_1_tickets,
          ticketData.status_2_tickets,
          ticketData.status_3_tickets,
          ticketData.status_4_tickets,
          ticketData.status_5_tickets,
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/seniorcons/ticketcount/${decodeId}`)
      .then((response) => {
        setTicketData(response.data.count[0]);
      })
      .catch((error) => {
        console.error("Error fetching ticket data:", error);
      });
  }, [decodeId]);

  return (
    <Container>
      <Box mt={4}>
        <Grid container spacing={4}>
          {/* Cards for ticket data */}
          <Grid item xs={12} md={4}>
            <StyledCard
              size="small"
              className="card"
              component={Link}
              to={`/seniorcons/tickettable/${id}`}
            >
              <StyledCardContent size="small">
                <StyledTypography>Total Tickets</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.total_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard
              size="small"
              className="card"
              component={Link}
              to={`/seniorcons/tickettable/${id}`}
            >
              <StyledCardContent size="small">
                <StyledTypography>Raised</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_1_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard
              size="small"
              className="card"
              component={Link}
              to={`/seniorcons/tickettable/${id}`}
            >
              <StyledCardContent size="small">
                <StyledTypography>Assigned</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_2_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard
              size="small"
              className="card"
              component={Link}
              to={`/seniorcons/tickettable/${id}`}
            >
              <StyledCardContent size="small">
                <StyledTypography>In Progress</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_3_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard
              size="small"
              className="card"
              component={Link}
              to={`/seniorcons/tickettable/${id}`}
            >
              <StyledCardContent size="small">
                <StyledTypography>Approved</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_4_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard
              size="small"
              className="card"
              component={Link}
              to={`/seniorcons/tickettable/${id}`}
            >
              <StyledCardContent size="small">
                <StyledTypography>Completed</StyledTypography>
                <Typography variant="h6" style={{ color: "#000000" }}>
                  {ticketData.status_5_tickets}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>

          {/* Doughnut Chart */}
          <Grid item xs={12}>
            <StyledCard component={Link} to={`/seniorcons/tickettable/${id}`}>
              <ChartContainer>
                <ChartWrapper>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </ChartWrapper>
              </ChartContainer>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default TicketSummary;

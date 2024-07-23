import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Badge,
  Grid,
  Paper,
  CircularProgress,
  Box,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled components using MUI's styled API
const StyledContainer = styled(Container)({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#f4f6f8",
  borderRadius: "12px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
});

const StyledCard = styled(Card)({
  marginBottom: "20px",
  borderRadius: "12px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
    transform: "scale(1.02)",
  },
  backgroundColor: "#ffffff",
});

const StyledAvatar = styled(Avatar)({
  backgroundColor: "#1976d2",
  color: "#ffffff",
  width: 64,
  height: 64,
  fontSize: "2rem",
});

const StyledBadge = styled(Badge)({
  marginLeft: "10px",
});

const StyledButton = styled(Button)({
  borderRadius: "20px",
  padding: "10px 20px",
});

const StyledTypography = styled(Typography)({
  marginBottom: "10px",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
});

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const emp_id = atob(id);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/seniorcons/companies/${emp_id}`)
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setLoading(false);
      });
  }, [emp_id]);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <StyledContainer component={Paper}>
      <Typography variant="h4" align="center" gutterBottom>
        Companies and Ticket Counts
      </Typography>
      <Grid container spacing={3}>
        {companies.map((company) => (
          <Grid item xs={12} sm={6} md={4} key={company.company_name}>
            <StyledCard>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <StyledAvatar>
                      {company.company_name[0]}
                    </StyledAvatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {company.company_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tickets Count:
                      <StyledBadge
                        badgeContent={company.ticket_count}
                        color="primary"
                        showZero
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </StyledBadge>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Tooltip title="View tickets" arrow>
                  <StyledButton
                    size="small"
                    color="primary"
                    variant="contained"
                    component={Link}
                    to={`/seniorcons/tickets/${id}/${btoa(company.company_name)}`}
                    endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                  >
                    View Tickets
                  </StyledButton>
                </Tooltip>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default CompaniesList;

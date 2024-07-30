import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
  Typography,
  FormHelperText,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useTheme } from "@mui/material/styles";

function AmTicketBooking() {
  const { id } = useParams();
  const decodedId = atob(id);
  const theme = useTheme();

  const [consultants, setConsultants] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    ticket_body: "",
    priority: "",
    consultant_emp_id: "",
    file: null,
    service_id: "",
    client_id: "",
    company_id: "",
    company_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false); // New state for form submission

  useEffect(() => {
    const fetchData = async () => {
      try {
        const consultantsResponse = await axios.get(
          `http://localhost:5002/api/internal/getInternal/${decodedId}`
        );
        setConsultants(consultantsResponse.data);

        const companiesResponse = await axios.get(
          `http://localhost:5002/api/admin/getallclient`
        );
        setCompanies(companiesResponse.data);

        const servicesResponse = await axios.get(
          `http://localhost:5002/api/serve/getservicesbyamid/${decodedId}`
        );
        setServices(servicesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "company_id") {
      const selectedCompany = companies.find(
        (company) => company.email === value
      );
      setFormData((prevState) => ({
        ...prevState,
        client_id: selectedCompany ? selectedCompany.client_id : "",
        company_id: value,
        company_name: selectedCompany ? selectedCompany.company : "",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      file: file || null,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.subject) errors.subject = "Subject is required.";
    if (!formData.ticket_body) errors.ticket_body = "Ticket body is required.";
    if (!formData.priority) errors.priority = "Priority is required.";
    if (!formData.consultant_emp_id)
      errors.consultant_emp_id = "Consultant is required.";
    if (!formData.company_id) errors.company_id = "Company is required.";
    if (!formData.client_id) errors.client_id = "Client ID is required.";
    if (!formData.service_id) errors.service_id = "Service ID is required.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true); // Set submitting to true

    const formDataToSend = new FormData();
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("ticket_body", formData.ticket_body);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("consultant_emp_id", formData.consultant_emp_id);
    formDataToSend.append("amscreenshot", formData.file);
    formDataToSend.append("client_id", formData.client_id);
    formDataToSend.append("email", formData.company_id);
    formDataToSend.append("company_name", formData.company_name);
    formDataToSend.append("service_id", formData.service_id);

    axios
      .post(
        `http://localhost:5002/api/tickets/amraiseticket/${decodedId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.message === "Error fetching max ticket_id.") {
          alert("Error fetching max ticket_id.");
        } else if (response.data.message === "Error creating ticket.") {
          alert("Error creating ticket.");
        } else if (
          response.data.message === "Error fetching consultant email."
        ) {
          alert("Error fetching consultant email.");
        } else if (response.data.message === "Consultant email not found.") {
          alert("Consultant email not found.");
        } else if (response.data.message === "Error sending email to client.") {
          alert("Error sending email to client.");
        } else if (
          response.data.message === "Error sending email to consultant."
        ) {
          alert("Error sending email to consultant.");
        } else if (response.data.message === "Ticket created successfully.") {
          alert("Ticket created successfully.");
          setFormData({
            subject: "",
            ticket_body: "",
            priority: "",
            consultant_emp_id: "",
            file: null,
            service_id: "",
            client_id: "",
            company_id: "",
            company_name: "",
          });
          setFormErrors({});
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false); // Set submitting to false
      });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: theme.spacing(2) }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ margin: "20px 0", color: "#1E3A8A" }}
      >
        Create New Ticket
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            error={!!formErrors.subject}
            helperText={formErrors.subject}
            style={{ marginBottom: theme.spacing(2) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Ticket Body"
            name="ticket_body"
            value={formData.ticket_body}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={3} // Reduced number of rows to decrease size
            fullWidth
            required
            error={!!formErrors.ticket_body}
            helperText={formErrors.ticket_body}
            style={{ marginBottom: theme.spacing(2) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            variant="outlined"
            required
            error={!!formErrors.priority}
            style={{ marginBottom: theme.spacing(2) }}
          >
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">Select the priority level</MenuItem>
              <MenuItem value={1}>Low</MenuItem>
              <MenuItem value={2}>Medium</MenuItem>
              <MenuItem value={3}>High</MenuItem>
            </Select>
            <FormHelperText>{formErrors.priority}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            variant="outlined"
            required
            error={!!formErrors.consultant_emp_id}
            style={{ marginBottom: theme.spacing(2) }}
          >
            <InputLabel>Consultant</InputLabel>
            <Select
              label="Consultant"
              name="consultant_emp_id"
              value={formData.consultant_emp_id}
              onChange={handleChange}
              fullWidth
            >
              {consultants.map((consultant) => (
                <MenuItem key={consultant.emp_id} value={consultant.emp_id}>
                  {consultant.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.consultant_emp_id}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            variant="outlined"
            required
            error={!!formErrors.company_id}
            style={{ marginBottom: theme.spacing(2) }}
          >
            <InputLabel>Company</InputLabel>
            <Select
              label="Company"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              fullWidth
            >
              {companies.map((company) => (
                <MenuItem key={company.email} value={company.email}>
                  {company.company}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.company_id}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            variant="outlined"
            required
            error={!!formErrors.service_id}
            style={{ marginBottom: theme.spacing(2) }}
          >
            <InputLabel>Service</InputLabel>
            <Select
              label="Service"
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              fullWidth
            >
              {services.map((service) => (
                <MenuItem key={service.service_id} value={service.service_id}>
                  {service.subdivision_name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.service_id}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
            style={{ marginBottom: theme.spacing(2) }}
          >
            Select File
            <input
              type="file"
              hidden
              name="amscreenshot"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
            />
          </Button>
          {formData.file && (
            <Typography variant="body2" color="textSecondary">
              {formData.file.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={submitting} // Disable button while submitting
            style={{ marginBottom: theme.spacing(2) }}
          >
            {submitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default AmTicketBooking;

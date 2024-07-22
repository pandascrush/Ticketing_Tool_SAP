import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Divider,
  Chip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import moment from "moment";

const ConsultantTicketSubmissionChanges = () => {
  const { ticket_id, am_id } = useParams();
  const decodedTicketId = atob(ticket_id);
  const decodedAmId = atob(am_id);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchChanges = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/seniorcons/submissionChanges/${decodedAmId}/${decodedTicketId}`
        );
        setChanges(response.data);
      } catch (error) {
        console.error("Error fetching submission changes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChanges();
  }, [decodedTicketId, decodedAmId]);

  const handleOpenModal = (change) => {
    setSelectedChange(change);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChange(null);
  };

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Submission Changes
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {changes.length > 0 ? (
            changes.map((change) => (
              <ListItem key={change.id} sx={{ mb: 2 }}>
                <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Remarks: {change.remarks}
                      </Typography>
                      <Chip label={moment(change.created_at).fromNow()} color="primary" size="small" />
                    </Box>
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        <b>Submitted By:</b> {change.am_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Account Manager Email:</b> {change.ac_email}
                      </Typography>
                    </Box>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <IconButton
                        onClick={() => handleExpandClick(change.id)}
                        aria-expanded={expanded === change.id}
                        aria-label="show more"
                      >
                        {expanded === change.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </CardActions>
                    <Collapse in={expanded === change.id}>
                      <CardContent>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          <b>Submitted At:</b> {moment(change.created_at).format("DD-MM-YYYY hh:mm:ss A")}
                        </Typography>
                      </CardContent>
                    </Collapse>
                  </CardContent>
                </Card>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" align="center">No changes found.</Typography>
          )}
        </List>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Change Details</DialogTitle>
        <DialogContent>
          {selectedChange && (
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Remarks:
              </Typography>
              <Typography variant="body1">{selectedChange.remarks}</Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                Submitted By:
              </Typography>
              <Typography variant="body1">{selectedChange.am_name}</Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                Consultant Email:
              </Typography>
              <Typography variant="body1">{selectedChange.ac_email}</Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                Submitted At:
              </Typography>
              <Typography variant="body1">
                {moment(selectedChange.created_at).format("DD-MM-YYYY hh:mm:ss A")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultantTicketSubmissionChanges;

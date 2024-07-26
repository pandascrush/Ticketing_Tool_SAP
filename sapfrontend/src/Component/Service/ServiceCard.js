// src/components/ServiceCard.js

import React from 'react';
import { Paper, Typography, Checkbox, FormControlLabel, Box } from '@mui/material';
import { FaGlobe, FaCogs, FaBullhorn } from 'react-icons/fa';

const icons = {
  "IT Services": <FaGlobe />,
  "SAP": <FaCogs />,
  "Digital Marketing": <FaBullhorn />
};

const ServiceCard = ({ service, handleCheckboxChange }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ p: 3, m: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f9f9f9', borderRadius: '12px' }}
    >
      <Box sx={{ fontSize: 48, color: '#4a90e2', mb: 2 }}>
        {icons[service.service_name]}
      </Box>
      <Typography variant="h5" component="div" gutterBottom>
        {service.service_name}
      </Typography>
      <Box sx={{ width: '100%', mt: 2 }}>
        {service.subdivisions.map((subdivision) => (
          <FormControlLabel
            key={subdivision.subdivision_id}
            control={
              <Checkbox
                id={`subdivision-${subdivision.subdivision_id}`}
                value={subdivision.subdivision_id}
                data-service-id={subdivision.service_id}
                data-am-id={subdivision.am_id}
                onChange={handleCheckboxChange}
              />
            }
            label={subdivision.subdivision_name}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default ServiceCard;

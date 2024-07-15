// src/components/ServiceCard.js

import React from 'react';
import { FaGlobe, FaCogs, FaBullhorn } from 'react-icons/fa';

const icons = {
  "Web Development": <FaGlobe />,
  "SAP": <FaCogs />,
  "Digital Marketing": <FaBullhorn />
};

const ServiceCard = ({ service, handleCheckboxChange }) => {
  return (
    <div className="service-card">
      <div className="icon">{icons[service.service_name]}</div>
      <h2>{service.service_name}</h2>
      <div className="subdivisions">
        {service.subdivisions.map((subdivision) => (
          <div key={subdivision.subdivision_id}>
            <input
              type="checkbox"
              id={`subdivision-${subdivision.subdivision_id}`}
              value={subdivision.subdivision_id}
              data-service-id={subdivision.service_id}
              data-am-id={subdivision.am_id}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={`subdivision-${subdivision.subdivision_id}`}>
              {subdivision.description}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;

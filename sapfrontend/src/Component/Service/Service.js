// src/App.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import styles from "./service.module.css";
import { useNavigate, useParams } from "react-router-dom";

const Service = () => {
  const { id } = useParams();
  const client_id = atob(id);

  const [services, setServices] = useState([]);
  const [selectedSubdivisions, setSelectedSubdivisions] = useState([]);

  const nav = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/serve/services"
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleCheckboxChange = (e) => {
    const subdivisionId = e.target.value;
    const serviceId = e.target.getAttribute("data-service-id");
    const amId = e.target.getAttribute("data-am-id");

    if (e.target.checked) {
      setSelectedSubdivisions((prev) => [
        ...prev,
        {
          subdivision_id: subdivisionId,
          service_id: serviceId,
          am_id: amId,
          client_id: client_id,
        },
      ]);
    } else {
      setSelectedSubdivisions((prev) =>
        prev.filter((sub) => sub.subdivision_id !== subdivisionId)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedSubdivisions);

    axios
      .post("http://localhost:5002/api/serve/add-client-service", {
        selectedSubdivisions,
      })
      .then((response) => {
        if (response.data.message === "Client service added successfully") {
          console.log("Submission successful:", response.data);
          alert("Submission successful");
          nav(`/admin/service/${id}`);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      {services.map((service) => (
        <ServiceCard
          key={service.service_id}
          service={service}
          handleCheckboxChange={handleCheckboxChange}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Service;

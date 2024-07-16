import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ClientlList.module.css";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [availableSubdivisions, setAvailableSubdivisions] = useState([]);
  const [selectedSubdivisionId, setSelectedSubdivisionId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedAmId, setSelectedAmId] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios
      .get("http://localhost:5002/api/admin/client-services")
      .then(response => setClients(response.data))
      .catch(error => console.error("Error fetching clients:", error));
  };

  const handleAddService = clientId => {
    axios
      .get(`http://localhost:5002/api/admin/available-services/${clientId}`)
      .then(response => {
        setAvailableSubdivisions(response.data);
        setSelectedClientId(clientId);
        setSelectedSubdivisionId("");
        setSelectedServiceId("");
        setSelectedAmId("");
      })
      .catch(error => console.error("Error fetching available services:", error));
  };

  const handleSubdivisionChange = event => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    setSelectedSubdivisionId(selectedOption.value);
    setSelectedServiceId(selectedOption.getAttribute("data-service-id"));
    setSelectedAmId(selectedOption.getAttribute("data-am-id"));
  };

  const handleSubmit = () => {
    if (!selectedClientId || !selectedSubdivisionId || !selectedServiceId || !selectedAmId) {
      console.error("Client ID, Subdivision ID, Service ID, or AM ID not selected.");
      return;
    }

    const data = {
      client_id: selectedClientId,
      subdivision_id: selectedSubdivisionId,
      service_id: selectedServiceId,
      am_id: selectedAmId,
    };

    console.log(data);

    axios
      .post("http://localhost:5002/api/serve/add-client-service", { selectedSubdivisions: [data] })
      .then(response => {
        console.log("Service added successfully:", response.data);
        fetchClients(); // Refresh client list after adding service
      })
      .catch(error => console.error("Error adding service:", error));
  };

  return (
    <div className={styles.clientListContainer}>
      <h2 className={styles.header}>All Clients Details</h2>
      {clients.map(client => (
        <div key={client.client_id} className={styles.clientItem}>
          <div className={styles.clientInfo}>
            <p><strong>Company:</strong> {client.company}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Services:</strong> {client.services}</p>
            <p><strong>Subdivisions:</strong> {client.subdivisions}</p>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.addServiceBtn}
              onClick={() => handleAddService(client.client_id)}
            >
              Add Service
            </button>
            {selectedClientId === client.client_id && (
              <div className={styles.serviceSelection}>
                <select
                  className={styles.selectSubdivision}
                  value={selectedSubdivisionId}
                  onChange={handleSubdivisionChange}
                >
                  <option value="">Select Subdivision</option>
                  {availableSubdivisions.map(subdivision => (
                    <option
                      key={subdivision.subdivision_id}
                      value={subdivision.subdivision_id}
                      data-service-id={subdivision.service_id}
                      data-am-id={subdivision.am_id}
                    >
                      {subdivision.subdivision_name}
                    </option>
                  ))}
                </select>
                <button className={styles.submitBtn} onClick={handleSubmit}>Submit</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientList;

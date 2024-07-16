import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MemberRegister.module.css";

const MemberRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation_id: "",
    emp_id: "",
    am_id: "",
    head_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [designations, setDesignations] = useState([]);
  const [accountManagers, setAccountManagers] = useState([]);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = () => {
    axios.get("http://localhost:5002/api/desig/designations")
      .then(response => setDesignations(response.data))
      .catch(error => console.error("Error fetching designations:", error));
  };

  const fetchAccountManagers = () => {
    axios.get("http://localhost:5002/api/serve/account-managers")
      .then(response => setAccountManagers(response.data))
      .catch(error => console.error("Error fetching account managers:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    if (name === "designation_id") {
      if (value === "2" || value === "3") {
        fetchAccountManagers();
      } else {
        setAccountManagers([]);
        setFormData((prevFormData) => ({
          ...prevFormData,
          am_id: "",
          head_id: "",
        }));
      }
    }
  };

  const handleManagerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    if (formData.designation_id === "2") {
      setFormData((prevFormData) => ({ ...prevFormData, head_id: "1" })); // Assuming 1 is the Delivery Head ID
    } else if (formData.designation_id === "3") {
      setFormData((prevFormData) => ({ ...prevFormData, head_id: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    console.log(formData);

    axios.post("http://localhost:5002/api/internal/register", formData)
      .then(response => {
        setSuccessMessage(response.data.message);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          designation_id: "",
          emp_id: "",
          am_id: "",
          head_id: "",
        });
      })
      .catch(err => {
        if (err.response) {
          setError(err.response.data);
        } else {
          setError("An error occurred while creating the user.");
        }
      })
      .finally(() => setLoading(false));
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isMobileValid = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className="text-center">Create Internal User</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Name</label>
          <input
            type="text"
            name="name"
            className={styles.formInput}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email</label>
          <input
            type="email"
            name="email"
            className={styles.formInput}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Mobile</label>
          <input
            type="text"
            name="mobile"
            className={styles.formInput}
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Designation</label>
          <select
            name="designation_id"
            className={styles.formSelect}
            value={formData.designation_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option
                key={designation.designation_id}
                value={designation.designation_id}
              >
                {designation.designation_name}
              </option>
            ))}
          </select>
        </div>
        {(formData.designation_id === "2" ||
          formData.designation_id === "3") && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {formData.designation_id === "2"
                ? "Account Manager"
                : "Senior Consultant"}
            </label>
            <select
              name={formData.designation_id === "2" ? "am_id" : "head_id"}
              className={styles.formSelect}
              value={
                formData.designation_id === "2"
                  ? formData.am_id
                  : formData.head_id
              }
              onChange={handleManagerChange}
              required
            >
              <option value="">
                Select{" "}
                {formData.designation_id === "2" ? "Account Manager" : "Head"}
              </option>
              {accountManagers.map((manager) => (
                <option key={manager.am_id} value={manager.am_id}>
                  {manager.am_name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Employee ID</label>
          <input
            type="text"
            name="emp_id"
            className={styles.formInput}
            value={formData.emp_id}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          {loading ? (
            <div className={styles.loadingSpinner}>Loading...</div>
          ) : (
            "Create User"
          )}
        </button>
      </form>
    </div>
  );
};

export default MemberRegister;

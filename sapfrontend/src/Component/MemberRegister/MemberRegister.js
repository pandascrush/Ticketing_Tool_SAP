// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./MemberRegister.module.css";

// const MemberRegister = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     designation_id: "",
//     emp_id: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [designations, setDesignations] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://192.168.252.177:5002/api/desig/designations")
//       .then((res) => {
//         setDesignations(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching designations:", err);
//       });
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleDesignationChange = (e) => {
//     const { value } = e.target;
//     setFormData({ ...formData, designation_id: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       const response = await axios.post("http://localhost:5000/api/internal/register", formData);
//       setSuccessMessage(response.data.message);
//       setFormData({
//         name: "",
//         email: "",
//         mobile: "",
//         designation_id: "",
//         emp_id: "",
//       });
//     } catch (err) {
//       if (err.response) {
//         setError(err.response.data);
//       } else {
//         setError("An error occurred while creating the user.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <h2 className="text-center">Create Internal User</h2>
//       {error && <div className={styles.errorMessage}>{error}</div>}
//       {successMessage && (
//         <div className={styles.successMessage}>{successMessage}</div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>Name</label>
//           <input
//             type="text"
//             name="name"
//             className={styles.formInput}
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>Email</label>
//           <input
//             type="email"
//             name="email"
//             className={styles.formInput}
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>Mobile</label>
//           <input
//             type="text"
//             name="mobile"
//             className={styles.formInput}
//             value={formData.mobile}
//             onChange={handleChange}
//             required/>
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>Designation</label>
//           <select
//             name="designation_id"
//             className={styles.formSelect}
//             value={formData.designation_id}
//             onChange={handleDesignationChange}
//             required >
//             <option value="">Select Designation</option>
//             {designations.map((designation) => (
//               <option key={designation.designation_id} value={designation.designation_id}>
//                 {designation.designation_name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>Employee ID</label>
//           <input
//             type="text"
//             name="emp_id"
//             className={styles.formInput}
//             value={formData.emp_id}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className={styles.submitButton}>
//           {loading ? (
//             <div className={styles.loadingSpinner}>Loading...</div>
//           ) : (
//             "Create User"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MemberRegister;




import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MemberRegister.module.css";

const MemberRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation_id: "",
    emp_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/desig/designations")
      .then((res) => {
        setDesignations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching designations:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDesignationChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, designation_id: value });
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isMobileValid = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!isEmailValid(formData.email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    if (!isMobileValid(formData.mobile)) {
      setError("Mobile number should be 10 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5002/api/internal/register", formData);
      setSuccessMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        designation_id: "",
        emp_id: "",
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("An error occurred while creating the user.");
      }
    } finally {
      setLoading(false);
    }
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
            onChange={handleDesignationChange}
            required
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation.designation_id} value={designation.designation_id}>
                {designation.designation_name}
              </option>
            ))}
          </select>
        </div>
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

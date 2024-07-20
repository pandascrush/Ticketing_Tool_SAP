import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import styles from "./CompaniesList.module.css";

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const emp_id = atob(id);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/seniorcons/companies/${emp_id}`)
      .then((response) => {
        console.log(response);
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, [emp_id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Companies and Ticket Counts</h1>
      <ul className={styles.list}>
        {companies.map((company) => (
          <li key={company.company_name} className={styles.listItem}>
            <Link
              
              to={`/seniorcons/tickets/${id}/${btoa(company.company_name)}`}
              className={styles.link}
            >
              {company.company_name} 
              <span className={styles.ticketCount}>
                <FontAwesomeIcon icon={faBell} className={styles.icon} /> 
                {company.ticket_count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompaniesList;

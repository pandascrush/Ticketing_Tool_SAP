import React, { useEffect, useState } from "react";
import { Doughnut, Bar, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AdminDash.module.css";

// Register necessary components for Chart.js
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
);

const DashboardCharts = () => {
  const [ticketChartData, setTicketChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Tickets Count",
        data: [],
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  });

  const [clientChartData, setClientChartData] = useState({
    labels: ["Registered Companies"],
    datasets: [
      {
        label: "Client Count",
        data: [0],
        backgroundColor: ["#FF6384"],
        borderColor: ["#FF6384"],
        borderWidth: 1,
      },
    ],
  });

  const [userChartData, setUserChartData] = useState({
    labels: ["Internal Users"],
    datasets: [
      {
        label: "User Count",
        data: [0],
        backgroundColor: "#4BC0C0",
        borderColor: "#4BC0C0",
        borderWidth: 1,
      },
    ],
  });

  const [statusChartData, setStatusChartData] = useState({
    datasets: [
      {
        label: "Tickets by Status",
        data: [],
        backgroundColor: "#FF6384",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
    ],
  });

  const [totalTickets, setTotalTickets] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [fullAmIds, setFullAmIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch ticket data
    axios
      .get("http://localhost:5002/api/admin/getalldomaintickets")
      .then((res) => {
        const data = res.data;
        const fullIds = data.map((item) => item.am_id);
        const shortenedLabels = data.map((item) => item.am_id.slice(0, -2)); // Display label without last 2 digits
        const values = data.map((item) => item.ticket_count);
        const total = values.reduce((sum, count) => sum + count, 0);

        setFullAmIds(fullIds); // Store the full AM IDs separately

        setTicketChartData({
          labels: shortenedLabels,
          datasets: [
            {
              label: "Tickets Count",
              data: values,
              backgroundColor: "#36A2EB",
              borderColor: "#36A2EB",
              borderWidth: 1,
            },
          ],
        });

        setTotalTickets(total);
      })
      .catch((error) => {
        console.error("Error fetching ticket data:", error);
      });

    // Fetch client data
    axios
      .get("http://localhost:5002/api/admin/getClientCompanyCount")
      .then((res) => {
        const companyCount = res.data.companyCount;

        setClientChartData({
          labels: ["Registered Companies"],
          datasets: [
            {
              label: "Client Count",
              data: [companyCount],
              backgroundColor: ["#FF6384"],
              borderColor: ["#FF6384"],
              borderWidth: 1,
            },
          ],
        });

        setTotalClients(companyCount);
      })
      .catch((error) => {
        console.error("Error fetching client data:", error);
      });

    // Fetch user data
    axios
      .get("http://localhost:5002/api/admin/getallinternalcount")
      .then((res) => {
        const userCount = res.data[0].user_count;

        setUserChartData({
          labels: ["Internal Users"],
          datasets: [
            {
              label: "User Count",
              data: [userCount],
              backgroundColor: "#4BC0C0",
              borderColor: "#4BC0C0",
              borderWidth: 1,
            },
          ],
        });

        setTotalUsers(userCount);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // Fetch ticket status data
    axios
      .get("http://localhost:5002/api/admin/ticketdetails")
      .then((res) => {
        const data = res.data;
        const statusData = data.map((item) => ({
          x: item.ticket_status_id,
          y: item.ticket_count,
        }));

        setStatusChartData({
          datasets: [
            {
              label: "Tickets by Status",
              data: statusData,
              backgroundColor: "#FF6384",
              borderColor: "#FF6384",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching ticket status data:", error);
      });
  }, []);

  const handleBarClick = (event) => {
    const activePoints = event.chart.getActiveElements();
    if (activePoints.length > 0) {
      const index = activePoints[0].index;
      const fullAmId = fullAmIds[index]; // Use the stored full AM ID for navigation
      navigate(`/admin/tickettable/${btoa(fullAmId)}`);
    } else {
      console.log("No active elements found in event.");
    }
  };

  const handleChartClick = (event, type) => {
    // Common handler for chart clicks
    navigate(type);
  };

  const ticketOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Bar Chart of Ticket Counts by AM ID",
      },
    },
    onClick: handleBarClick,
  };

  const clientOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Doughnut Chart of Client Counts",
      },
    },
    onClick: () => {
      handleChartClick(null, "/admin/clientdetail");
    },
  };

  const userOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pie Chart of Internal Users",
      },
    },
    onClick: () => {
      handleChartClick(null, "/admin/internaldetail");
    },
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Scatter Plot of Tickets by Status",
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Ticket Count",
        },
      },
      y: {
        title: {
          display: true,
          text: "Ticket Status ID",
        },
      },
    },
  };

  return (
    <div className={`${styles.mainContainer} container-fluid`}>
      <div className="row justify-content-center mb-4">
        <div className="col-md-4 mb-3">
          <div className={styles.card}>
            <h5 className={styles.cardTitle}>Total Tickets</h5>
            <Link to="/admin/allticket" className={styles.cardCount}>
              {totalTickets}
            </Link>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className={styles.card}>
            <h5 className={styles.cardTitle}>Total Registered Clients</h5>
            <Link to="/admin/clientdetail" className={styles.cardCount}>
              {totalClients}
            </Link>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className={styles.card}>
            <h5 className={styles.cardTitle}>Total Internal Users</h5>
            <Link to="/admin/internaldetail" className={styles.cardCount}>
              {totalUsers}
            </Link>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className={styles.chartWrapper}>
            <Bar
              data={ticketChartData}
              options={ticketOptions}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className={styles.chartWrapper}>
            <Doughnut
              data={clientChartData}
              options={clientOptions}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className={styles.chartWrapper}>
            <Pie
              data={userChartData}
              options={userOptions}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className={styles.chartWrapper}>
            <Scatter
              data={statusChartData}
              options={statusOptions}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AdminDash.module.css";

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutChart = () => {
  const [ticketChartData, setTicketChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Tickets Count",
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  });

  const [clientChartData, setClientChartData] = useState({
    labels: ["Registered Companies"],
    datasets: [
      {
        label: "Client Count",
        data: [0], // Initially, set the data to 0
        backgroundColor: ["#FF6384"],
        borderColor: ["#FF6384"],
        borderWidth: 1,
      },
    ],
  });

  const [totalTickets, setTotalTickets] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch ticket data
    axios
      .get("http://localhost:5002/api/admin/getalldomaintickets")
      .then((res) => {
        const data = res.data;
        const labels = data.map((item) => `AM ID: ${item.am_id.slice(0, -2)}`); // Remove last 2 digits
        const values = data.map((item) => item.ticket_count);
        const total = values.reduce((sum, count) => sum + count, 0);

        setTicketChartData({
          labels: labels,
          datasets: [
            {
              label: "Tickets Count",
              data: values,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              borderColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
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
  }, []);

  const handleChartClick = (event) => {
    const activePoints = event.chart.getActiveElements();
    if (activePoints.length > 0) {
      const index = activePoints[0].index;
      const amId = ticketChartData.labels[index].split("AM ID: ")[1];
      console.log("Clicked AM ID:", amId);
      navigate(`/admin/tickettable/${btoa(amId)}`);
    } else {
      console.log("No active elements found in event.");
    }
  };

  const ticketOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Doughnut Chart of Ticket Counts by AM ID",
      },
    },
    onClick: handleChartClick,
  };

  const clientOptions = {
    responsive: true,
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
      navigate("/admin/clientdetail");
    },
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className={styles.chart_wrapper}>
            <Doughnut data={ticketChartData} options={ticketOptions} />
            <p>Total Tickets: {totalTickets}</p>
          </div>
        </div>

        <div className="col">
          {/* <Link to="/admin/clientdetail" className={styles.chart_link}> */}
            <div className={styles.chart_wrapper}>
              <Doughnut data={clientChartData} options={clientOptions} />
              <p>Total Registered Clients: {totalClients}</p>
            </div>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;

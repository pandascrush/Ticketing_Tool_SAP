import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [identifier, setIdentifier] = useState();
  const [password, setPassword] = useState();
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    axios
      .post(`http://localhost:5002/api/auth/login`, { identifier, password })
      .then((res) => {
        console.log(res.data);
        if (res.data.userType === "Client") {
          const id = res.data.client_id;
          nav(`/client/raiseticket/${btoa(id)}/`);
        } else if (res.data.userType === "Internal") {
          if (res.data.designation_id === 2) {
            const id = res.data.am_id;
            nav(`/manager/${btoa(id)}`);
          } else if (res.data.designation_id === 1) {
            nav(`/admin/client`);
          } else if (res.data.designation_id === 3) {
            const id = res.data.emp_id;
            nav(`/seniorcons/${btoa(id)}`);
          }
        } else {
          nav("/");
        }
      }).catch(err=>{
        alert("server down")
      })
  };

  return (
    <div className="container-fluid loginbg d-flex justify-content-center align-items-center vh-100">
      <div className="crd p-5">
        <form onSubmit={handleSubmit}>
          <h1 className="loginwrd text-center">Login</h1>
          <div className="form-group">
            <label htmlFor="username" className="text-white">
              Username
            </label>
            <input
              onChange={(e) => setIdentifier(e.target.value)}
              className="form-control"
              type="text"
              id="username"
              name="username"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="text-light">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              type="password"
              id="password"
              name="password"
              placeholder="Enter a strong password"
            />
          </div>
          <div className="form-group button-container">
            <button type="submit" className="rounded-3 logbutton mt-3">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

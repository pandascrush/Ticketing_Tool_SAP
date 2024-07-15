import React from "react";
import "./TicketStatus.css";
import phoneim from "../Asset/bad-review-concept-illustrated_23-2148973702-removebg-preview.png";
import { useParams } from "react-router-dom";

function TicketStatus() {
  const { id } = useParams();
  console.log(id);

  return (
   
    <div className="container-fluid">
      <div className="row h-100 ">
        <h2 className="text-center my-5">TICKET STATUS</h2>
        <div className="col">
          <div className="card py-3 px-4 firstbox">
            <h5 className="p-2">Department: SAP</h5>
            <h5 className="p-2">Submitted Time: 11:45AM</h5>
            <h5 className="p-2">Contact: Mr.Dev</h5>
            <h5 className="p-2">
              Status: <span className="text-success">Progress</span>{" "}
            </h5>
            <h5 className="p-2">Priority: High </h5>
            <img src={phoneim} alt="Phone Icon" className="phone-icon" />
          </div>
        </div>
        <div className="col">
          <div className="card depcard px-4 py-4 border-0 cardshd">
            <div className="form-group ">
              <label htmlFor="addReply" className="text-light">
                Add Reply
              </label>
              <textarea
                className="form-control "
                id="addReply"
                rows="3"
                placeholder="Enter your reply..."
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="attachment" className="text-light">
                Choose File
              </label>
              <input
                type="file"
                className="form-control-file"
                id="attachment"
              />
            </div>
            <div className="text-center">
              <button type="button" className="text-primary btn btn-light">
                Add Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketStatus;

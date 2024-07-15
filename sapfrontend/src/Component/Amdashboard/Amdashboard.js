import React, { useState } from "react";
import Amsidebar from "../Amsidebar/Amsidebar";
import TicketSummary from "../Summary/Summary";
import ClientRegister from "../Clientregistration/Clientregistration";
import TicketsCount from "../Showtickets/Showtickets";
import TicketShow from "../TicketShow/TicketShow";

export function Amdashboard() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-10">
            <TicketSummary />
          </div>
        </div>
      </div>
    </>
  );
}

export function AmdTicketCount() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-10">
            <TicketsCount />
          </div>
        </div>
      </div>
    </>
  );
}

export function AmdTicketShow() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-10">
            <TicketShow />
          </div>
        </div>
      </div>
    </>
  );
}






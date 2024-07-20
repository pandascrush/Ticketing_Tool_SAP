import React from "react";
import SeniorConsultantSidebar from "./SeniorConsultantSidebar";
import TicketSummary from "./TicketSummary";
import TicketsList from "./TicketsList";
import CompaniesList from "./CompaniesList";

export function SeniorConsultantTicketsSummary() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <SeniorConsultantSidebar />
          </div>
          <div className="col-lg-10">
            <TicketSummary />
          </div>
        </div>
      </div>
    </>
  );
}

export function SeniorConsultantCompany() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <SeniorConsultantSidebar />
          </div>
          <div className="col-lg-10">
            <CompaniesList />
          </div>
        </div>
      </div>
    </>
  );
}

export function SeniorConsultantTickets() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <SeniorConsultantSidebar />
          </div>
          <div className="col-lg-10">
            <TicketsList />
          </div>
        </div>
      </div>
    </>
  );
}

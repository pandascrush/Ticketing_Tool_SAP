import React from "react";
import SeniorConsultantSidebar from "./SeniorConsultantSidebar";
import TicketSummary from "./TicketSummary";
import TicketsList from "./TicketsList";
import CompaniesList from "./CompaniesList";
import ConsultantTicketSubmissionChanges from "./ConsultantTicketSubmissionChanges";

export function SeniorConsultantTicketsSummary() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <SeniorConsultantSidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
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
          <div className="col-lg-1"></div>
          <div className="col-lg-8">
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
          <div className="col-lg-1"></div>
          <div className="col-lg-8">
            <TicketsList />
          </div>
        </div>
      </div>
    </>
  );
}

export function SeniorConsultantTicketsSubmissionChanges() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <SeniorConsultantSidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-8">
            <ConsultantTicketSubmissionChanges />
          </div>
        </div>
      </div>
    </>
  );
}

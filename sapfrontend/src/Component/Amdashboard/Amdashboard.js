import React from "react";
import Amsidebar from "../Amsidebar/Amsidebar";
import TicketSummary from "../Summary/Summary";
import TicketsCount from "../Showtickets/Showtickets";
import TicketShow from "../TicketShow/TicketShow";
import AccountManagerTicketTrack from "../AmTicketTrack/AccountManagerTicketTrack";
import AmTicketBooking from "../AmTicketBook/AmTicketBooking";
import AmEmployeeTable from "./AmEmployeeTable";
import AmTicketTable from "./AmTicketTable";

export function Amdashboard() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
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

export function AmdTicketCount() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
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
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <TicketShow />
          </div>
        </div>
      </div>
    </>
  );
}

export function AmdTicketTrack() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <AccountManagerTicketTrack />
          </div>
        </div>
      </div>
    </>
  );
}

export function AmdTicketRaising() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <AmTicketBooking />
          </div>
        </div>
      </div>
    </>
  );
}

export function AmdEmployeeDetail() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <AmEmployeeTable />
          </div>
        </div>
      </div>
    </>
  );
}

export function AmdTicketDetail() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Amsidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <AmTicketTable />
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from "react";
import AdminSidebar from "../Adminsidebar/Adminsidebar";
import ClientRegister from "../Clientregistration/Clientregistration";
import Service from "../Service/Service";
import MemberRegister from "../MemberRegister/MemberRegister";
import ClientList from "../ClientList/ClientList";
import AdminDash from "../AdminDash/AdminDash";
import TicketTable from "../AdminDash/TicketTable";
import ClientTable from "../AdminDash/ClientTable";

export function AdminDashboard() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <AdminDash />
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminClientRegister() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="col-lg-10">
            <ClientRegister />
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminServiceSection() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="col-lg-10">
            <Service />
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminMemberRegister() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="col-lg-10">
            <MemberRegister />
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminClientList() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="col-lg-10">
            <ClientList />
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminTicketTable() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <TicketTable />
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminClientTable() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-9">
            <ClientTable />
          </div>
        </div>
      </div>
    </>
  );
}

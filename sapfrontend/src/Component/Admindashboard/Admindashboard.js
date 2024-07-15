import React, { useState } from "react";
import AdminSidebar from "../Adminsidebar/Adminsidebar";
import ClientRegister from "../Clientregistration/Clientregistration";
import Service from "../Service/Service";
import MemberRegister from "../MemberRegister/MemberRegister";
import ClientList from "../ClientList/ClientList";

export function AdminClientRegister() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <AdminSidebar />
          </div>
          <div className="c>lg-10">
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
          <div className="c>lg-10">
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
          <div className="c>lg-10">
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
          <div className="c>lg-10">
            <ClientList />
          </div>
        </div>
      </div>
    </>
  );
}



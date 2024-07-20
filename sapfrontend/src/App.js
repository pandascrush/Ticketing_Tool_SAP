import "./App.css";
import Login from "./Component/Login/Login";
import {
  ClientTicketBooking,
  ClientTicketStatus,
} from "./Component/Login/Dashboard";
import {
  AdminClientList,
  AdminClientRegister,
  AdminMemberRegister,
  AdminServiceSection,
} from "./Component/Admindashboard/Admindashboard";
import {
  Amdashboard,
  AmdTicketCount,
  AmdTicketShow,
} from "./Component/Amdashboard/Amdashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminSidebar from "./Component/Adminsidebar/Adminsidebar";
import ClientRegister from "./Component/Clientregistration/Clientregistration";
import Services from "./Component/Clientregistration/Service";
import Showtickets from "./Component/Showtickets/Showtickets";
import MemberRegister from "./Component/MemberRegister/MemberRegister";
import Amprofile from "./Component/Amprofile/Amprofile";
import { SeniorConsultantCompany, SeniorConsultantTickets, SeniorConsultantTicketsSummary } from "./Component/Consultant Dashboard/SeniorConsultant/SeniorConsultantDashboard";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes*/}
          <Route path="/" element={<Login />} />
          <Route path="/admin/client" Component={AdminClientRegister} />
          <Route path="/admin/service/:id" Component={AdminServiceSection} />
          <Route path="/admin/member" Component={AdminMemberRegister} />
          <Route path="/admin/clientdeatil" Component={AdminClientList} />
          <Route path="/adminsidebar" element={<AdminSidebar />} />

          {/*Account Manager Routes*/}
          <Route path="/manager/:id" element={<Amdashboard />} />
          <Route path="/manager/tickets/:id" Component={AmdTicketCount} />
          <Route
            path="/manager/showtickets/:id/:com"
            Component={AmdTicketShow}
          />

          {/*Senior Consultant Routes*/}
          <Route path="/seniorcons/:id" Component={SeniorConsultantTicketsSummary} />
          <Route path="/seniorcons/tickets/:id" Component={SeniorConsultantCompany} />
          <Route path="/seniorcons/tickets/:id/:company" Component={SeniorConsultantTickets} />

          {/*Client Routes*/}
          <Route
            path="/client/:id/:com/:cshort"
            Component={ClientTicketBooking}
          />
          <Route
            path="/client/ticketstatus/:id"
            Component={ClientTicketStatus}
          />
          <Route path="/ticketview" element={[<Showtickets />]} />
          <Route path="/clientreg" element={[<ClientRegister />]} />
          <Route path="/clientservices" element={[<Services />]} />
          <Route path="/membereg" element={<MemberRegister />} />
          <Route path="/ticketstatus" element={<ClientTicketStatus />} />
          <Route path="/Amprofile" element={<Amprofile />} />
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import "./App.css";
import Login from "./Component/Login/Login";
import {
  ClientTicketBooking,
  ClientTicketStatus,
} from "./Component/Login/Dashboard";
import {
  AdminAllticketTable,
  AdminClientList,
  AdminClientRegister,
  AdminClientTable,
  AdminDashboard,
  AdminInternalTable,
  AdminMemberRegister,
  AdminServiceSection,
  AdminTicketTable,
} from "./Component/Admindashboard/Admindashboard";
import {
  Amdashboard,
  AmdEmployeeDetail,
  AmdTicketCount,
  AmdTicketDetail,
  AmdTicketRaising,
  AmdTicketShow,
  AmdTicketTrack,
} from "./Component/Amdashboard/Amdashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminSidebar from "./Component/Adminsidebar/Adminsidebar";
import ClientRegister from "./Component/Clientregistration/Clientregistration";
import Services from "./Component/Clientregistration/Service";
import Showtickets from "./Component/Showtickets/Showtickets";
import MemberRegister from "./Component/MemberRegister/MemberRegister";
import Amprofile from "./Component/Amprofile/Amprofile";
import {
  SeniorConsultantCompany,
  SeniorConsultantTickets,
  SeniorConsultantTicketsSubmissionChanges,
  SeniorConsultantTicketsSummary,
  SeniorConsultantTicketTable,
} from "./Component/Consultant Dashboard/SeniorConsultant/SeniorConsultantDashboard";

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
          <Route path="/admin/dash" Component={AdminDashboard} />
          <Route path="/admin/tickettable/:id" Component={AdminTicketTable} />
          <Route path="/admin/clientdetail" Component={AdminClientTable} />
          <Route path="/admin/internaldetail" Component={AdminInternalTable} />
          <Route path="/admin/allticket" Component={AdminAllticketTable} />

          {/*Account Manager Routes*/}
          <Route path="/manager/:id" element={<Amdashboard />} />
          <Route path="/manager/tickets/:id" Component={AmdTicketCount} />
          <Route
            path="/manager/showtickets/:id/:com"
            Component={AmdTicketShow}
          />
          <Route
            path="/manager/track-status/:am_id/:ticket_id"
            Component={AmdTicketTrack}
          />
          <Route path="/manager/ticketraise/:id" Component={AmdTicketRaising} />
          <Route path="/manager/empdetail/:id" Component={AmdEmployeeDetail} />
          <Route path="/manager/amtickets/:id" Component={AmdTicketDetail} />

          {/*Senior Consultant Routes*/}
          <Route
            path="/seniorcons/:id"
            Component={SeniorConsultantTicketsSummary}
          />
          <Route
            path="/seniorcons/tickets/:id"
            Component={SeniorConsultantCompany}
          />
          <Route
            path="/seniorcons/tickets/:id/:company"
            Component={SeniorConsultantTickets}
          />
          <Route
            path="/seniorcons/submissionChanges/:am_id/:ticket_id"
            Component={SeniorConsultantTicketsSubmissionChanges}
          />
          <Route
            path="/seniorcons/tickettable/:id"
            Component={SeniorConsultantTicketTable}
          />

          {/*Client Routes*/}
          <Route
            path="/client/raiseticket/:id/"
            Component={ClientTicketBooking}
          />
          <Route
            path="/client/ticketstatus/:id"
            Component={ClientTicketStatus}
          />

          {/* <Route path="/ticketview" element={[<Showtickets />]} />
          <Route path="/clientreg" element={[<ClientRegister />]} />
          <Route path="/clientservices" element={[<Services />]} />
          <Route path="/membereg" element={<MemberRegister />} />
          <Route path="/ticketstatus" element={<ClientTicketStatus />} />
          <Route path="/Amprofile" element={<Amprofile />} /> */}
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

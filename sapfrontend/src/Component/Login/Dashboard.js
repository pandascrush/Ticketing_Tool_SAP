import React from "react";
import Sidebar from "../Sidebar/Sidebarnew";
import TicketBooking from "../Ticketbooking/Ticketbooking";
import TicketStatus from "../TicketStatus/TicketStatus";

export function ClientTicketBooking() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-10">
            <TicketBooking />
          </div>
        </div>
      </div>
    </>
  );
}


export function ClientTicketStatus() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-10">
           <TicketStatus/>
          </div>
        </div>
      </div>
    </>
  );
}



// export function ClientTicketSummary() {
//   return (
//     <>
//       <div className="container-fluid sideback">
//         <div className="row sideback">
//           <div className="col-lg-2 sideback">
//             <Sidebarnew />
//           </div>
//           <div className="col-lg-10 background sideback">
//             <TicketSummary />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


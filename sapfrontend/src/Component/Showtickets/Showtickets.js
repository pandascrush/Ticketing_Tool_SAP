
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import "./Showtickets.css";

function TicketsCount() {
    const { id } = useParams();
    const decodedId = atob(id);

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5002/api/tickets/count/${decodedId}`)
            .then(res => {
                console.log(res.data)
                setTickets(res.data);
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
            });
    }, [decodedId]);

    return (
        <div className='container-fluid cardtables text-dark text-center'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <table className='tickettable mt-5'>
                    <thead>
                        <tr className='headrow'>
                            <th className='p-3'>Company Name</th>
                            <th className='p-3'>Total Number of Tickets</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.company_name}>
                                <td className='p-3 text-decoration-none'>
                                    
                                    <Link to={`/manager/showtickets/${id}/${btoa(ticket.company_name)}`} style={{ textDecoration: 'none' }}>
                                        {ticket.company_name}
                                    </Link>

                                </td>
                                <td>{ticket.total_tickets}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TicketsCount;

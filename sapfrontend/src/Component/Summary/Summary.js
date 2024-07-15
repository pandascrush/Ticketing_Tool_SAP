
import React, { useState, useEffect } from 'react';
import './Summary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TicketSummary() {
    const [company_name, setcompany_name] = useState('');
    const [ticket_count, setticket_count] = useState('');
    const [tickets, setTickets] = useState([]);

    const {id} = useParams()
    console.log(id);
    const decodedId = atob(id)

    useEffect(() => {
        const fetchTicketCounts = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/tickets/count/${decodedId}`);
              const countval=response.data[0].ticket_count;
                console.log(response.data[0].ticket_count);
                setticket_count(countval)
                // const data = response.data[0]; // Assuming the response structure
                // setcompany_name(data.company_name);
                // ticket_count(data.ticket_count);
            } catch (error) {
                console.error('Error fetching ticket counts:', error);
            }
        };
        fetchTicketCounts();
    }, []);

    return (
        <div className='container-fluid backgroundshade'>
            <h2 className='text-center my-4'>Ticket Summary</h2>
            <div className='row pt-4'>
                <div className='col-sm-12 col-md-6 col-lg-2'>
                    <div className='card text-center crdsummary text-light m-1 card-equal-height bg-primary card-equal-height '>
                        <h4>Open </h4>
                        <h4>0</h4>
                    </div>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-2'>
                    <div className='card text-center crdsummary text-light m-1 card-equal-height bg-primary card-equal-height '>
                        <h4>InProgress</h4>
                        <h4>0</h4>
                    </div>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-2'>
                    <div className='card text-center text-light m-1 crdsummary card-equal-height bg-primary card-equal-height '>
                        <h4>Answered</h4>
                        <h4>0</h4>
                    </div>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-2'>
                    <div className='card text-center text-light m-1 crdsummary card-equal-height bg-primary card-equal-height '>
                        <h4>On Hold</h4>
                        <h4>0</h4>
                    </div>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-2'>
                    <div className='card text-center text-light m-1 crdsummary card-equal-height bg-primary card-equal-height '>
                        <h4>Closed</h4>
                        <h4>0</h4>
                    </div>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-2'>
                    <div className='card text-center cardforstatus text-light m-1 crdsummary card-equal-height bg-primary'>
                        <h4>Total</h4>
                        <h4>{ticket_count}</h4>
                    </div>
                </div>
            </div>
            <div className='card text-dark mt-5 crdtable'>
                <table className='statustable'>
                    <thead>
                        <tr className='headrow'>
                        <th>Subject</th>
                            <th>Department</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Contact</th>
                            <th>Priority</th>
                            <th>Last Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Billing Issue</td>
                            <td>23</td>
                            <td>2</td>
                            <td>In Progress</td>
                            <td>4</td>
                            <td>High</td>
                            <td>33</td>  
                        </tr>
                        <tr>
                        <td>Billing Issue</td>
                            <td>23</td>
                            <td>2</td>
                            <td>In Progress</td>
                            <td>4</td>
                            <td>High</td>
                            <td>33</td>  
                        </tr>
                        <tr>
                        <td>Billing Issue</td>
                            <td>23</td>
                            <td>2</td>
                            <td>In Progress</td>
                            <td>4</td>
                            <td>High</td>
                            <td>33</td>  
                        </tr>
                    </tbody>
                </table>
             
                {/* <table className='text-center rounded-4'>
                    <thead className='p-4'>
                        <tr className='headingrow text-center'>
                            <th>Subject</th>
                            <th>Department</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Contact</th>
                            <th>Priority</th>
                            <th>Last Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='my-4'>
                            <td>Billing Issue</td>
                            <td>23</td>
                            <td>2</td>
                            <td>In Progress</td>
                            <td>4</td>
                            <td>High</td>
                            <td>33</td>
                        </tr>
                        <tr>
                            <td>Billing Issue</td>
                            <td>23</td>
                            <td>2</td>
                            <td>33</td>
                            <td>4</td>
                            <td>Low</td>
                            <td>45566</td>
                        </tr>
                    </tbody>
                </table> */}
            </div>
        </div>
    );
}

export default TicketSummary;

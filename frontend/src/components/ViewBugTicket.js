import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, Paper, Typography } from '@mui/material';
// import '../styles/ViewModal.css'
import { useNavigate } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { getBugTicketByID } from '../api/bugticketApi';
import PersonIcon from '@mui/icons-material/Person';

const ViewBugTicket = ({ isOpen, onClose, ticket }) => {

    if (!ticket) {
        return null; // Or display a loading message, an error message, or handle the case when ticket is null
    }

    console.log('Ticket', ticket)
    console.log('Assign', ticket.assignedTo)

    // const getTicketDetails = async () => {
    //     const ticketdata = await getBugTicketByID(ticket)
    //     console.log(ticketdata)

    // }

    // useEffect(() => {
    //     getTicketDetails()
    // }, [])
    const createdOn = new Date(ticket.createdAt).toLocaleString();

    const formattedLastUpdatedAt = new Date(ticket.lastUpdatedAt).toLocaleString();
    console.log('Date', formattedLastUpdatedAt)



    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                className="modal"

            >
                <div className="modal-content" style={{ width: '800px' }}>
                    <div className="modal-header">
                        <h2>View Bug Ticket</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>

                    <div className='wrapper' style={{ boxShadow: 'none', top: '50%' }}>
                        <div className='modal_Task' style={{ boxShadow: 'none' }}>
                            <div className='modalContent_Task' style={{ boxShadow: 'none', margin: '10px 0', textAlign: 'left' }}>
                                <div style={{ marginTop: '10px' }}>
                                    <Typography variant="h6" style={{ fontWeight: 400, color: '#000000', fontSize: '16px' }}>Bug ID: {ticket._id}</Typography>
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <Typography variant="h6" style={{ fontWeight: 600, color: '#000000' }}>{ticket.title}</Typography>
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <Typography style={{ color: '#808080' }}>{ticket.description}</Typography>
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Project:&nbsp;</p>
                                    <div >
                                        <h4 style={{
                                            fontSize: '14px',
                                            fontWeight: 400

                                        }}>{ticket.project.name}</h4>
                                    </div>


                                </div>
                                <div style={{ marginTop: '10px', display: 'flex' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Status:&nbsp;</p>
                                    <div style={{ backgroundColor: '#f0f0f0', borderRadius: '16px', padding: '4px 10px', display: 'inline-block' }}>
                                        <Typography style={{
                                            fontSize: '12px',
                                            // color: getStatusColor(status),
                                            fontWeight: 600
                                        }}>{ticket.status}</Typography>
                                    </div>


                                </div>
                                <div style={{ marginTop: '10px', display: 'flex' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Priority:&nbsp;</p>
                                    <div style={{ backgroundColor: '#f0f0f0', borderRadius: '16px', padding: '4px 10px', display: 'inline-block' }}>
                                        <Typography style={{
                                            fontSize: '12px',
                                            // color: getStatusColor(status),
                                            fontWeight: 600
                                        }}>{ticket.priority}</Typography>
                                    </div>
                                </div>



                                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <DateRangeIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Created On</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{createdOn}</Typography>
                                    </div>


                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Created By</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{ticket.createdBy.username}</Typography>
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <DateRangeIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Last Updated At</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{formattedLastUpdatedAt}</Typography>
                                    </div>


                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Last Updated By</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{ticket.lastUpdatedBy}</Typography>
                                    </div>
                                </div>


                                <div className="buttonContainer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button variant="contained" onClick={onClose} style={{ background: '#9854CB', width: '200px', height: 'auto' }}>Close</Button>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </Modal>

        </>
    )
}

export default ViewBugTicket
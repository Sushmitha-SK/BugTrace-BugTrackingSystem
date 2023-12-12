import { Button, Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'


const ViewUserDetailsModal = ({ isViewModalOpen, onViewModalClose, onViewModalSubmit, onViewUserSuccess }) => {

    return (
        <>
            <Modal
                open={isViewModalOpen}
                onClose={onViewModalClose}
                className="modal"
            >

                <div className="modal-content" style={{ width: '800px' }}>
                    <div className="modal-header">
                        <h2>View Bug Ticket</h2>
                        <button className="close-button" onClick={onViewModalClose}>
                            X
                        </button>
                    </div>
                </div>
                <div className='wrapper' style={{ boxShadow: 'none', top: '50%' }}>
                    <div className='modal_Task' style={{ boxShadow: 'none' }}>
                        <div className='modalContent_Task' style={{ boxShadow: 'none', margin: '10px 0' }}>
                            <div style={{ marginTop: '10px' }}>
                                <Typography variant="h6" style={{ fontWeight: 400, color: '#000000', fontSize: '16px' }}>User ID: 101</Typography>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Typography variant="h6" style={{ fontWeight: 600, color: '#000000' }}>Full Name</Typography>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Typography style={{ color: '#808080' }}>Username</Typography>
                            </div>
                            <div style={{ marginTop: '10px', display: 'flex' }}>
                                <p style={{ fontSize: '14px', fontWeight: 600 }}>Role:&nbsp;</p>
                                <div style={{ backgroundColor: '#f0f0f0', borderRadius: '16px', padding: '4px 10px', display: 'inline-block' }}>
                                    <Typography style={{
                                        fontSize: '12px',
                                        // color: getStatusColor(status),
                                        fontWeight: 600
                                    }}>Developer</Typography>
                                </div>


                            </div>
                            <div className="buttonContainer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant="contained" onClick={onViewModalClose} style={{ background: '#9854CB', width: '200px', height: 'auto' }}>Close</Button>
                            </div>


                        </div>

                    </div>

                </div>
            </Modal>

        </>
    )
}

export default ViewUserDetailsModal
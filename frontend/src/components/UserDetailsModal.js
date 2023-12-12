import { Button, Modal, Typography } from '@mui/material'
import React from 'react'
import usericon from '../assets/usericon.png'
import '../styles/UserDetailsModal.css'


const UserDetailsModal = ({ isViewModalOpen, onViewModalClose, onViewModalSubmit, onViewUserSuccess }) => {
    console.log('OnViewModalSubmit', onViewModalSubmit)
    if (!onViewModalSubmit) {
        return null; // Don't render the modal if user details are not available
    }

    return (
        <>
            <Modal
                open={isViewModalOpen}
                onClose={onViewModalClose}
                className="modal"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>View User</h2>
                        <button className="close-button" onClick={onViewModalClose}>
                            X
                        </button>
                    </div>
                    <div className="wrapper">
                        <div className="left">
                            <img src={usericon} alt="user" width="100" />
                            <h4>{onViewModalSubmit.fullname}</h4>
                            <p>{onViewModalSubmit.role}</p>
                        </div>
                        <div className="right">
                            <div className="info">
                                <div className="info_data">
                                    <div className="data">
                                        <p style={{ marginTop: '2%' }}>ID</p>
                                        <h4>{onViewModalSubmit._id}</h4>
                                        <p style={{ marginTop: '2%' }}>Username</p>
                                        <h4>{onViewModalSubmit.username}</h4>
                                        <p style={{ marginTop: '2%' }}>Email</p>
                                        <h4 style={{ fontWeight: 400 }}>{onViewModalSubmit.email}</h4>
                                        <p style={{ marginTop: '2%' }}>Role</p>
                                        <h4 style={{ fontWeight: 400 }}>{onViewModalSubmit.role}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="buttonContainer">
                        <Button variant="contained" onClick={onViewModalClose} style={{ background: '#9854CB', borderRadius: '15px' }}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default UserDetailsModal
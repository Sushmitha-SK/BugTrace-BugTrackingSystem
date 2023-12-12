import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/Dashboard.css'


import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';


const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const confirmLogout = () => {
        handleLogout();
        closeModal();
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <label htmlFor="menu-toggle">
                        <span className="las la-bars" />
                    </label>
                    <div className="header-menu">                 
                        <div className="user" style={{ cursor: 'pointer' }}>
                            <div className="bg-img" style={{ backgroundImage: 'url(img/1.jpeg)' }} />
                            <span className="las la-power-off" onClick={openModal} />
                            <span onClick={openModal}>Logout</span>
                        </div>
                    </div>
                </div>
            </header>




            <Dialog
                open={showModal}
                onClose={closeModal}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} fontWeight={700}>
                    <span >You are about to Logout</span>
                    <IconButton className="close-button" onClick={closeModal} sx={{ color: '#000' }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <p>You can always log in to BugTrace and continue where you left off</p>
                </DialogContent>
                <DialogActions>
                    <div style={{ margin: '15px' }}>
                        <Button onClick={closeModal} sx={{
                            background: '#9854CB',
                            color: '#fff',
                            borderRadius: '10px',
                            margin: '3px',
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                            '&:hover': {
                                background: '#7B3FA3',
                            },
                        }}>Cancel</Button>
                        <Button onClick={confirmLogout} sx={{
                            background: '#FFF0F0',
                            color: '#B80020',
                            borderRadius: '10px',
                            margin: '2px',
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                            '&:hover': {
                                background: '#FFD3D3',
                            },
                        }}>Yes, Log Me Out</Button>
                    </div>
                </DialogActions>
            </Dialog >

        </>
    );
};

export default Header;

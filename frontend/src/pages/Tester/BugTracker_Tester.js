import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { getAllBugTickets } from '../../api/bugticketApi';
import { Button, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddTicket from './../../components/AddTicket';
import ViewTicket from '../../components/ViewTicket';
import EditBugTicketModal from '../../components/EditBugTicketModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getUserByID } from '../../api/userApi';

const BugTracker_Tester = () => {
    const [bugData, setBugData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddTickettModalClosed, setIsAddTicketModalClosed] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage] = useState(5);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState({});
    const [menuTicket, setMenuTicket] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBugData, setFilteredBugData] = useState([]);

    const getBugTickets = async () => {
        const getTicketsdata = await getAllBugTickets();
        console.log('Frontend getTicketsdata', getTicketsdata.data.bugTickets);

        if (Array.isArray(getTicketsdata.data.bugTickets)) {
            setBugData(getTicketsdata.data.bugTickets);
        } else {
            console.error('Bug data is not an array:', getTicketsdata);
        }
    };

    useEffect(() => {
        getBugTickets();
    }, []);

    useEffect(() => {
        filterBugData();
    }, [searchQuery, bugData]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const filterBugData = () => {
        const filteredData = bugData.filter((item) => {
            return item.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredBugData(filteredData);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = async (taskData) => {
        console.log(taskData);
        handleModalClose();
        await refreshBugList();
    };

    const refreshBugList = async () => {
        // Implement refreshing the bug list if needed
    };

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const ticketsToShow = filteredBugData.slice(indexOfFirstTicket, indexOfLastTicket);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredBugData.length / ticketsPerPage);

    const handleView = (item) => {
        setSelectedTicket(item);
        handleMenuClose();
        setIsViewModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedTicket(item);
        handleMenuClose();
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedTicket(item);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: event.currentTarget,
        }));
    };

    const handleMenuClose = (id) => {
        setAnchorEl((prevState) => ({
            ...prevState,
            [id]: null,
        }));
    };

    const exportToPDF = () => {
        const input = document.getElementById('bug-table');
        const pdf = new jsPDF();

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('bug_tickets.pdf');
        });
    };

    return (
        <>
            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>Bug Tickets</h1>
                            <small>Home / Bug Tickets</small>
                        </div>
                        <div className="page-content">
                            <div className="records table-responsive">
                                <div className="record-header">
                                    <div className="add">
                                        <TextField
                                            label="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            variant="outlined"
                                            style={{ width: '150px', marginRight: '10px' }}
                                            size="small"
                                        />
                                    </div>
                                    <div className="add-button-container">
                                        <Button
                                            variant="contained"
                                            onClick={exportToPDF}
                                            className="export-button"
                                            style={{ background: '#9854CB', borderRadius: '15px' }}
                                        >
                                            Export to PDF
                                        </Button>
                                        &nbsp;
                                        <Button
                                            variant="contained"
                                            onClick={handleModalOpen}
                                            className="add-button"
                                            style={{ background: '#9854CB', borderRadius: '15px' }}
                                        >
                                            New Ticket&nbsp;<i className="las la-bug"></i>
                                        </Button>
                                    </div>
                                </div>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" id="bug-table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('_id')}
                                                >
                                                    ID
                                                   
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('title')}
                                                >
                                                    Summary
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('description')}
                                                >
                                                    Description
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('status')}
                                                >
                                                    Status
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('priority')}
                                                >
                                                    Priority
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('project.name')}
                                                >
                                                    Project
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('createdBy.username')}
                                                >
                                                    Created By
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('assignedTo')}
                                                >
                                                    Assigned To
                                                </TableCell>
                                                <TableCell
                                                    style={{ fontWeight: '600', cursor: 'pointer' }}
                                                    onClick={() => handleSort('createdAt')}
                                                >
                                                    Created On
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {ticketsToShow.map((item) => {
                                                return (
                                                    <TableRow key={item._id}>
                                                        <TableCell>{item._id}</TableCell>
                                                        <TableCell>{item.title}</TableCell>
                                                        <TableCell>{item.description}</TableCell>
                                                        <TableCell>{item.status}</TableCell>
                                                        <TableCell>{item.priority}</TableCell>
                                                        <TableCell>{item.project.name}</TableCell>
                                                        <TableCell>{item.createdBy.username}</TableCell>
                                                        <TableCell>{item.assignedTo}</TableCell>
                                                        <TableCell>{item.createdAt}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <IconButton
                                                                aria-haspopup="true"
                                                                aria-controls={`ticket-menu-${item._id}`}
                                                                onClick={(e) => handleMenuOpen(e, item._id)}
                                                            >
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <Menu
                                                                id={`ticket-menu-${item._id}`}
                                                                anchorEl={anchorEl[item._id] || null}
                                                                keepMounted
                                                                open={Boolean(anchorEl[item._id])}
                                                                onClose={() => handleMenuClose(item._id)}
                                                            >
                                                                <MenuItem onClick={() => handleView(item)}>View</MenuItem>
                                                                <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                                                            </Menu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <div className="center">
                                        <div className="pagination">
                                            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                                                &laquo;
                                            </button>
                                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={currentPage === page ? 'active' : ''}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                                                &raquo;
                                            </button>
                                        </div>
                                    </div>
                                </TableContainer>
                            </div>
                            <AddTicket
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setIsAddTicketModalClosed(true);
                                }}
                                onSubmit={handleFormSubmit}
                            />
                            <ViewTicket isOpen={isViewModalOpen} onClose={closeViewModal} ticket={selectedTicket} />
                            <EditBugTicketModal isEditOpen={isEditModalOpen} onEditClose={closeEditModal} editticket={selectedTicket} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default BugTracker_Tester;

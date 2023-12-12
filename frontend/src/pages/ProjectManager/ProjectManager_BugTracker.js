import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Menu,
    Button,
    TextField,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { getAllBugTickets } from '../../api/bugticketApi';
import ViewTicket from '../../components/ViewTicket';
import EditBugTicketModal from '../../components/EditBugTicketModal';
import AddTicket from '../../components/AddTicket';

const ProjectManager_BugTracker = () => {
    const [ticketlist, setTicketlist] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        status: '',
        priority: '',
        createdBy: '',
    });

    const [currentprojectlist, setCurrentprojectlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage] = useState(5);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddTickettModalClosed, setIsAddTicketModalClosed] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const userID = useSelector((state) => state.login.data.id);

    const getBugs = async () => {
        try {
            const getAllBugs = await getAllBugTickets();
            const filteredBugTickets = getAllBugs.data.bugTickets.filter((ticket) => {
                return ticket.project.projectManager === userID;
            });
            setTicketlist(filteredBugTickets);

            const projects = filteredBugTickets.map((ticket) => ticket.project);
            const uniqueProjects = Array.from(new Set(projects.map((project) => project._id)))
                .map((projectId) => projects.find((project) => project._id === projectId));

            setCurrentprojectlist(uniqueProjects);
        } catch (error) {
            console.error('Error fetching bug tickets:', error);
        }
    };

    useEffect(() => {
        getBugs();
    }, [userID]);

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const ticketsToShow = ticketlist.slice(indexOfFirstTicket, indexOfLastTicket);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(ticketlist.length / ticketsPerPage);

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

    const closeViewModal = () => {
        setIsViewModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
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

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const sortedTickets = [...ticketsToShow].sort((a, b) => {
        if (sortColumn === 'ID') {
            return sortOrder === 'asc' ? a._id.localeCompare(b._id) : b._id.localeCompare(a._id);
        } else if (sortColumn === 'Summary') {
            return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortColumn === 'Description') {
            return sortOrder === 'asc' ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
        } else if (sortColumn === 'Status') {
            return sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        } else if (sortColumn === 'Priority') {
            return sortOrder === 'asc' ? a.priority.localeCompare(b.priority) : b.priority.localeCompare(a.priority);
        } else if (sortColumn === 'Project') {
            return sortOrder === 'asc' ? a.project.name.localeCompare(b.project.name) : b.project.name.localeCompare(a.project.name);
        } else if (sortColumn === 'Created By') {
            return sortOrder === 'asc' ? a.createdBy.username.localeCompare(b.createdBy.username) : b.createdBy.username.localeCompare(a.createdBy.username);
        } else if (sortColumn === 'Assigned To') {
            return sortOrder === 'asc' ? a.assignedTo.localeCompare(b.assignedTo) : b.assignedTo.localeCompare(a.assignedTo);
        } else if (sortColumn === 'Created On') {
            return sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    const filteredTickets = sortedTickets.filter((item) =>
        (filterCriteria.status === '' || item.status.toLowerCase() === filterCriteria.status.toLowerCase()) &&
        (filterCriteria.priority === '' || item.priority.toLowerCase() === filterCriteria.priority.toLowerCase()) &&
        (filterCriteria.createdBy === '' || item.createdBy.username.toLowerCase() === filterCriteria.createdBy.toLowerCase())
    ).filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                        <div className="filter-container">
                                            <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 10 }}>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={filterCriteria.status}
                                                    onChange={(e) => setFilterCriteria({ ...filterCriteria, status: e.target.value })}
                                                    label="Status"
                                                >
                                                    <MenuItem value="">All</MenuItem>
                                                    <MenuItem value="New">New</MenuItem>
                                                    <MenuItem value="Open">Open</MenuItem>
                                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                                    <MenuItem value="Resolved">Resolved</MenuItem>
                                                    <MenuItem value="Closed">Closed</MenuItem>
                                                    <MenuItem value="Reopen">Reopen</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 10 }}>
                                                <InputLabel>Priority</InputLabel>
                                                <Select
                                                    value={filterCriteria.priority}
                                                    onChange={(e) => setFilterCriteria({ ...filterCriteria, priority: e.target.value })}
                                                    label="Priority"
                                                >
                                                    <MenuItem value="">All</MenuItem>
                                                    <MenuItem value="High">High</MenuItem>
                                                    <MenuItem value="Medium">Medium</MenuItem>
                                                    <MenuItem value="Low">Low</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="add-button-container">
                                        <TextField
                                            label="Search"
                                            variant="outlined"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        &nbsp;&nbsp;
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


                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('ID')}>
                                                    ID {sortColumn === 'ID' && sortOrder === 'asc' && <span className="las la-sort-up"></span>}
                                                    {sortColumn === 'ID' && sortOrder === 'desc' && <span className="las la-sort-down"></span>}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Summary')}>
                                                    Summary {sortColumn === 'Summary' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Description')}>
                                                    Description {sortColumn === 'Description' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Status')}>
                                                    Status {sortColumn === 'Status' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Priority')}>
                                                    Priority {sortColumn === 'Priority' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Project')}>
                                                    Project {sortColumn === 'Project' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Created By')}>
                                                    Created By {sortColumn === 'Created By' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Assigned To')}>
                                                    Assigned To {sortColumn === 'Assigned To' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>

                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('Created On')}>
                                                    Created On {sortColumn === 'Created On' && (sortOrder === 'asc' ? <span className="las la-sort-up"></span> : <span className="las la-sort-down"></span>)}
                                                </TableCell>


                                                <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredTickets.map((item, i) => {
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

export default ProjectManager_BugTracker;

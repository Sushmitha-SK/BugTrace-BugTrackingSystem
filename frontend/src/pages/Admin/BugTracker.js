import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { Button, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { getAllBugTickets, getBugTicketsAssignedToDeveloper } from '../../api/bugticketApi';
import ViewTicket from '../../components/ViewTicket';
import EditBugTicketModal from '../../components/EditBugTicketModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AddTicket from '../../components/AddTicket';
import { Circles } from 'react-loader-spinner';

const BugTracker = () => {
    const userID = useSelector((state) => state.login.data.id)

    const [bugData, setBugData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddTickettModalClosed, setIsAddTicketModalClosed] = useState(true);
    const [isLoading, setIsLoading] = useState(true);




    // const getBugTickets = async () => {
    //     const getTicketsdata = await getAllBugTickets();
    //     console.log('Frontend Developer getTicketsdata', getTicketsdata.data.bugTickets);

    //     if (Array.isArray(getTicketsdata.data.bugTickets)) {
    //         setBugData(getTicketsdata.data.bugTickets);
    //     } else {
    //         console.error('Bug data is not an array:', getTicketsdata);
    //     }
    // };
    const getBugTickets = async () => {
        setIsLoading(true);
        try {
            const getTicketsdata = await getAllBugTickets();
            if (Array.isArray(getTicketsdata.data.bugTickets)) {
                setBugData(getTicketsdata.data.bugTickets);
            } else {
                console.error('Bug data is not an array:', getTicketsdata);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getBugTickets();
    }, []);

    //Format Date Time
    const formatCreatedOn = (dateString) => {
        const formattedDate = new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
        return formattedDate;
    };


    // Filter the bugData based on the search query
    const filteredBugData = bugData.filter((item) => {
        return (
            item._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.createdBy.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formatCreatedOn(item.createdAt).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });


    //Pagination
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const ticketsToShow = filteredBugData.slice(indexOfFirstTicket, indexOfLastTicket);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredBugData.length / ticketsPerPage);

    //Sort
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }

        // Sort the bugData based on the selected column and order
        const sortedData = bugData.slice().sort((a, b) => {
            const comparison = sortOrder === 'asc' ? 1 : -1;
            if (a[column] < b[column]) {
                return -comparison;
            }
            if (a[column] > b[column]) {
                return comparison;
            }
            return 0;
        });

        setBugData(sortedData);
    };

    //More Option
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
        console.log('ticket', item)
        setSelectedTicket(item);
        handleMenuClose();
        setIsViewModalOpen(true);
    };


    const closeViewModal = () => {
        setIsViewModalOpen(false);
    };

    //Edit
    const handleEdit = (item) => {
        setSelectedTicket(item);
        handleMenuClose();
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };


    const exportToPDF = () => {
        const input = document.getElementById('bug-table'); // Give your table an id
        const pdf = new jsPDF();

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('bug_tickets.pdf');
        });
    };


    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (taskData) => {
        console.log(taskData);
        handleModalClose();
        await refreshBugList();
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };


    const refreshBugList = async () => {
        // Implement refreshing the bug list if needed
    };


    if (isLoading) {
        return (
            <div className="loader-container">
                <Circles
                    height="80"
                    width="80"
                    color="#9854CB"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    outerCircleColor=""
                    innerCircleColor=""
                    middleCircleColor=""
                />
            </div>
        );
    }




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
                                            style={{ width: '250px', marginRight: '10px' }}
                                            size="small"
                                        />
                                    </div>

                                    <div className="add-button-container">
                                        {/* <Button
                                            variant="contained"
                                            onClick={exportToPDF}
                                            className="export-button"
                                            style={{ background: '#9854CB', borderRadius: '15px' }}
                                        >
                                            Export to PDF
                                        </Button> */}

                                        <Button
                                            variant="contained"
                                            onClick={exportToPDF}
                                            className="export-button"
                                            style={{ background: '#9854CB', borderRadius: '15px' }}

                                        >
                                            Export to PDF
                                        </Button>&nbsp;
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
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('_id')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>ID</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Summary</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Description</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Status</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Priority</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('project.name')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Project</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('createdBy.username')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Created By</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('assignedTo')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Assigned To</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <span onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                                                        <span className="las la-sort"></span>Created On</span>
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
                                                        <TableCell>{formatCreatedOn(item.createdAt)}</TableCell>
                                                        {/* <TableCell style={{ textAlign: 'center' }}>
                                                            <IconButton aria-haspopup="true">
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                        </TableCell> */}
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
                </div >
            </div >
        </>
    )
}

export default BugTracker
import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, FormControl, InputLabel, Select, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SortIcon from '@mui/icons-material/Sort';
import AddUserModal from '../../components/AddUserModal';
import '../../styles/Modal.css'
import { getAllUsers } from '../../api/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserDetails } from '../../redux/store/slice/userSlice';
import { getusersunderPM } from '../../api/projectApi';
import AssignProjectModal from '../../components/AssignProjectModal';
import { Circles } from 'react-loader-spinner';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserDetailsModal from '../../components/UserDetailsModal';




const ProjectManager_Users = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddUserModalClosed, setIsAddUserModalClosed] = useState(true);
    const [userlist, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [memberInfo, setMemberInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);

    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
    const [isViewUserModalClosed, setIsViewUserModalClosed] = useState(true);
    const [user_details, setUser_details] = useState(null)

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending',
    });

    const [searchQuery, setSearchQuery] = useState('');





    const userID = useSelector((state) => state.login.data.id)

    const dispatch = useDispatch()


    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setOpenMenu(null);
    };

    const handleView = (item) => {
        // Handle view action here
        setUser_details(item)
        handleViewUserDetailslOpen()
        console.log('View clicked for', item.fullname);
        handleMenuClose();
    };

    const handleEdit = (item) => {
        // Handle edit action here
        console.log('Edit clicked for', item.fullname);
        handleMenuClose();
    };

    const handleDelete = (item) => {
        // Handle delete action here
        console.log('Delete clicked for', item.fullname);
        handleMenuClose();
    };

    const handleViewUserDetailslOpen = () => {
        setIsUserDetailsOpen(true);
    };




    // const getUserData = async () => {
    //     const userdata = await getAllUsers()
    //     console.log('Frontend-userdata', userdata.data.users)
    //     setUserList(userdata.data.users)
    //     dispatch(getAllUserDetails(userdata))
    // }
    const getUserData = async () => {
        try {
            const userdata = await getAllUsers();
            console.log('Frontend-userdata', userdata.data.users);
            setUserList(userdata.data.users);
            dispatch(getAllUserDetails(userdata));
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false); // Set loading state to false when data is fetched
        }
    };

    // const getProjectMembers = async () => {
    //     const projectmembers = await getusersunderPM(userID)
    //     console.log('projectmembers', projectmembers.data.users)
    //     setMemberInfo(projectmembers.data.users)
    // }

    const getProjectMembers = async () => {
        try {
            const projectmembers = await getusersunderPM(userID);
            console.log('projectmembers', projectmembers.data.users);
            setMemberInfo(projectmembers.data.users);
        } catch (error) {
            console.error('Error loading project members:', error);
        }
    };


    useEffect(() => {
        getUserData()
        getProjectMembers()

    }, [userID])



    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = async (taskData) => {
        console.log(taskData);
        handleModalClose();
        await refreshUserList();
    };

    const refreshUserList = async () => {

    };

    const handleAddUserSuccess = async () => {

    };

    const handleViewUserSuccess = async () => {

    };


    // Pagination
    const filteredUsers = memberInfo.filter((user) => user._id !== userID);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const usersToShow = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    //Sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...usersToShow];
    if (sortConfig.key) {
        sortedData.sort((a, b) => {
            const keyA = a[sortConfig.key];
            const keyB = b[sortConfig.key];
            if (sortConfig.direction === 'ascending') {
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
            } else if (sortConfig.direction === 'descending') {
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
            }
            return 0;
        });
    }


    // Filter the data based on the search query
    const filteredData = sortedData.filter((item) => {
        // You can customize this filter logic based on your search requirements
        return (
            item.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });




    return (
        <>

            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>User</h1>
                            <small>Home / User</small>
                        </div>

                        <div className="page-content">
                            {isLoading ? (
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
                            ) : (
                                <div className="records table-responsive">
                                    <div className="record-header">
                                        <div className="add" >
                                            {/* <h3 style={{ color: '#9854CB' }}>Project Members</h3> */}

                                            <TextField
                                                label="Search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                variant="outlined"
                                                style={{ width: '150px', marginRight: '10px' }}
                                                size="small"
                                            />


                                            {/* Filter input */}
                                            {/* <FormControl variant="outlined" style={{ width: '150px' }}>
                                            <InputLabel>Filter By</InputLabel>
                                            <Select
                                                value={filterBy}
                                                onChange={(e) => setFilterBy(e.target.value)}
                                                label="Filter By"
                                                size="small"
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                <MenuItem value="name">Name</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            label="Filter Value"
                                            value={filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            variant="outlined"
                                            style={{ width: '150px', marginLeft: '10px' }}
                                            size="small"
                                        /> */}


                                        </div>
                                        <div className="add-button-container">
                                            {/* Search input */}
                                            {/* <TextField
                                            label="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            variant="outlined"
                                            style={{ width: '150px', marginRight: '10px' }}
                                            size="small"
                                        />*/}
                                            <Button
                                                variant="contained"
                                                onClick={handleModalOpen}
                                                className="add-button"
                                                style={{ background: '#9854CB', borderRadius: '15px' }}
                                            >
                                                Assign Project&nbsp;<i className="las la-user-plus"></i>
                                            </Button>
                                        </div>

                                    </div>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                {/* <TableRow>
                                                    <TableCell style={{ fontWeight: '600' }}>ID</TableCell>
                                                    <TableCell style={{ fontWeight: '600' }}>Name</TableCell>
                                                    <TableCell style={{ fontWeight: '600' }}>Username</TableCell>
                                                    <TableCell style={{ fontWeight: '600' }}>Email</TableCell>
                                                    <TableCell style={{ fontWeight: '600' }}>Role</TableCell>
                                                    <TableCell style={{ fontWeight: '600' }}>Project</TableCell>

                                                    <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>Action</TableCell>
                                                </TableRow> */}

                                                <TableRow>
                                                    <TableCell style={{ fontWeight: '600' }} onClick={() => handleSort('id')}>
                                                        ID
                                                        {sortConfig.key === 'id' && (
                                                            <span className="las la-sort"></span>

                                                        )}
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: '600' }} onClick={() => handleSort('fullname')}>
                                                        Name
                                                        {sortConfig.key === 'fullname' && (
                                                            <span className="las la-sort"></span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: '600' }} onClick={() => handleSort('username')}>
                                                        Username
                                                        {sortConfig.key === 'username' && (
                                                            <span className="las la-sort"></span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: '600' }} onClick={() => handleSort('email')}>
                                                        Email
                                                        {sortConfig.key === 'email' && (
                                                            <span className="las la-sort"></span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: '600' }} onClick={() => handleSort('role')}>
                                                        Role
                                                        {sortConfig.key === 'role' && (
                                                            <span className="las la-sort"></span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: '600' }}>Project</TableCell>
                                                    <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>Action</TableCell>
                                                </TableRow>

                                            </TableHead>
                                            <TableBody>
                                                {/* {usersToShow.map((item, i) => { */}
                                                {/* {sortedData.map((item, i) => { */}
                                                {filteredData.map((item, i) => {
                                                    return (
                                                        <TableRow key={item._id}>
                                                            <TableCell>{item._id}</TableCell>
                                                            <TableCell>{item.fullname}</TableCell>
                                                            <TableCell>{item.username}</TableCell>
                                                            <TableCell>{item.email}</TableCell>
                                                            <TableCell>{item.role}</TableCell>
                                                            <TableCell>
                                                                {item.projects.map((project, index) => (
                                                                    <span key={project._id}>
                                                                        {project.name}
                                                                        {index !== item.projects.length - 1 && ', '}
                                                                    </span>
                                                                ))}
                                                            </TableCell>
                                                            {/* <TableCell style={{ textAlign: 'center' }}>
                                                                <Button >
                                                                    <RemoveRedEyeIcon
                                                                        sx={{ color: '#8B8FA7' }} />
                                                                </Button>
                                                                <Button>
                                                                    <EditIcon sx={{ color: '#9854CB' }} />
                                                                </Button>
                                                                <Button>
                                                                    <DeleteIcon sx={{ color: '#F7002B' }} />
                                                                </Button>
                                                            </TableCell> */}
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                <IconButton
                                                                    aria-label="more"
                                                                    aria-controls={`menu-${item._id}`}
                                                                    aria-haspopup="true"
                                                                    onClick={(e) => handleMenuOpen(e, item._id)}
                                                                >
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                                <Menu
                                                                    id={`menu-${item._id}`}
                                                                    anchorEl={anchorEl}
                                                                    keepMounted
                                                                    open={openMenu === item._id}
                                                                    onClose={handleMenuClose}
                                                                >
                                                                    <MenuItem onClick={() => handleView(item)}>View</MenuItem>
                                                                    {/* <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                                                                    <MenuItem onClick={() => handleDelete(item)}>Delete</MenuItem> */}
                                                                </Menu>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                        <div class="center">
                                            <div className="pagination">
                                                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                    <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>{page}</button>
                                                ))}
                                                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>

                                            </div>
                                        </div>
                                    </TableContainer>


                                </div>
                            )}
                            <AssignProjectModal
                                isAssignModalOpen={isModalOpen}
                                onAssignModalClose={() => {
                                    setIsModalOpen(false);
                                    setIsAddUserModalClosed(true);
                                }}
                                onAssignModalSubmit={handleFormSubmit}
                                onAssignProjectSuccess={handleAddUserSuccess}
                                currentUserId={userID}
                            />

                            <UserDetailsModal
                                isViewModalOpen={isUserDetailsOpen}
                                onViewModalClose={() => {
                                    setIsUserDetailsOpen(false);
                                    setIsViewUserModalClosed(true);
                                }}
                                onViewModalSubmit={user_details}
                                onViewUserSuccess={handleViewUserSuccess}
                            />
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}

export default ProjectManager_Users
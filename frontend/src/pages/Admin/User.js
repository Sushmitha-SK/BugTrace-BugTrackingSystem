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
import { useDispatch } from 'react-redux';
import { getAllUserDetails } from '../../redux/store/slice/userSlice';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewUserDetailsModal from '../../components/ViewUserDetailsModal';
import UserDetailsModal from '../../components/UserDetailsModal';




const User = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
    const [isAddUserModalClosed, setIsAddUserModalClosed] = useState(true);
    const [isViewUserModalClosed, setIsViewUserModalClosed] = useState(true);

    const [userlist, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);

    const [filterBy, setFilterBy] = useState(""); // Filter by which column
    const [filterValue, setFilterValue] = useState(""); // Filter value
    const [sortBy, setSortBy] = useState(""); // Sort by which column
    const [sortOrder, setSortOrder] = useState("asc"); // Sort order (asc or desc)

    const [user_details, setUser_details] = useState(null)


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
        console.log('View clicked for', item.fullname);
        setUser_details(item)
        handleViewUserDetailslOpen()
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



    // const getUserData = async () => {
    //     const userdata = await getAllUsers()
    //     console.log('Frontend-userdata', userdata.data.users)
    //     setUserList(userdata.data.users)
    //     dispatch(getAllUserDetails(userdata))

    // }


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






    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const usersToShow = userlist.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(userlist.length / usersPerPage);


    //Filter
    const filterUsers = (users) => {
        if (!filterBy || !filterValue) {
            return users; // No filter applied
        }
        return users.filter((user) =>
            user[filterBy].toLowerCase().includes(filterValue.toLowerCase())
        );
    };

    //Sort
    const sortUsers = (users) => {
        if (!sortBy) {
            return users; // No sort applied
        }
        return [...users].sort((a, b) => {
            if (sortOrder === "asc") {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        });
    };

    // const getUserData = async () => {
    //     const userdata = await getAllUsers();
    //     const filteredAndSortedUsers = sortUsers(filterUsers(userdata.data.users));
    //     setUserList(filteredAndSortedUsers);
    //     dispatch(getAllUserDetails(userdata));
    // };

    const getUserData = async () => {
        const userdata = await getAllUsers();
        const filteredAndSortedUsers = sortUsers(filterUsers(userdata.data.users));
        setUserList(filteredAndSortedUsers);
        dispatch(getAllUserDetails(userdata));
    };


    useEffect(() => {
        getUserData()
    }, [])



    //View User Details
    const handleUserDetailsSubmit = async (userdetails) => {
        console.log('User Data', userdetails);

        handleViewModalClose();
        await refreshUserList();
    };

    const handleViewModalClose = () => {
        setIsUserDetailsOpen(false);
    };

    const handleViewUserSuccess = async () => {

    };

    const handleViewUserDetailslOpen = () => {
        setIsUserDetailsOpen(true);
    };







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
                            <div className="records table-responsive">
                                <div className="record-header">
                                    <div className="add" >
                                        {/* Filter input */}
                                        <FormControl variant="outlined" style={{ width: '150px' }}>
                                            <InputLabel
                                                sx={{
                                                    color: '#9854CB',
                                                    fontSize: '14px'
                                                }}>
                                                Filter By</InputLabel>
                                            <Select
                                                sx={{
                                                    "& label.Mui-focused": {
                                                        color: "#9854CB",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#9854CB",
                                                        },
                                                    },
                                                }}

                                                value={filterBy}
                                                onChange={(e) => setFilterBy(e.target.value)}
                                                label="Filter By"
                                                size="small">
                                                <MenuItem value="">None</MenuItem>
                                                <MenuItem value="fullname">Name</MenuItem>
                                                <MenuItem value="username">Username</MenuItem>
                                                <MenuItem value="email">Email</MenuItem>
                                                <MenuItem value="role">Role</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Filter Value"
                                            value={filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            variant="outlined"
                                            style={{ width: '150px', marginLeft: '10px' }}
                                            size="small"
                                            sx={{
                                                "& label.Mui-focused": {
                                                    color: "#9854CB"
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#9854CB"
                                                    }
                                                },
                                                fontSize: '14px'
                                            }}
                                        />

                                        {/* Sort input */}
                                        <FormControl variant="outlined" style={{ width: '150px', marginLeft: '10px' }}>
                                            <InputLabel sx={{
                                                color: '#9854CB',
                                                fontSize: '14px'
                                            }}>Sort By</InputLabel>
                                            <Select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                label="Sort By"
                                                size="small"
                                                sx={{
                                                    "& label.Mui-focused": {
                                                        color: "#9854CB",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#9854CB",
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                <MenuItem value="fullname">Name</MenuItem>
                                                <MenuItem value="username">Username</MenuItem>
                                                <MenuItem value="email">Email</MenuItem>
                                                <MenuItem value="role">Role</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            size="small"
                                            style={{ marginLeft: '10px', background: '#9854CB', borderRadius: '15px' }}

                                        >
                                            Toggle Sort Order&nbsp;<i className="las la-sort"></i>
                                        </Button>



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
                                            Add User&nbsp;<i className="las la-user-plus"></i>
                                        </Button>
                                    </div>

                                </div>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: '600' }}>ID</TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>Username</TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>Email</TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>Role</TableCell>

                                                <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>Action</TableCell>
                                            </TableRow>

                                        </TableHead>
                                        <TableBody>
                                            {/* {usersToShow.map((item, i) => { */}
                                            {sortUsers(filterUsers(usersToShow)).map((item, i) => {

                                                const handleClick = (event) => {
                                                    setAnchorEl(event.currentTarget);
                                                };

                                                const handleClose = () => {
                                                    setAnchorEl(null);
                                                };
                                                return (
                                                    <TableRow key={item._id}>
                                                        <TableCell>{item._id}</TableCell>
                                                        <TableCell>{item.fullname}</TableCell>
                                                        <TableCell>{item.username}</TableCell>
                                                        <TableCell>{item.email}</TableCell>
                                                        <TableCell>{item.role}</TableCell>
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
                                                                <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                                                                <MenuItem onClick={() => handleDelete(item)}>Delete</MenuItem>
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
                            <AddUserModal
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setIsAddUserModalClosed(true);
                                }}
                                onSubmit={handleFormSubmit}
                                onAddUserSuccess={handleAddUserSuccess}
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

export default User
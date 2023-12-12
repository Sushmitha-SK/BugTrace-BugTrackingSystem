import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddProjectModal from './../../components/AddProjectModal';
import { useDispatch } from 'react-redux';
import { getAllProjects } from '../../api/projectApi';
import { projectListData } from '../../redux/store/slice/projectSlice';
import { Circles } from 'react-loader-spinner';
import AssignProjectModal from '../../components/AssignProjectModal';

import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewProject from '../../components/ViewProject';
import EditBugTicketModal from '../../components/EditBugTicketModal';
import EditProject from '../../components/EditProject';

const Project = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isAddProjectModalClosed, setIsAddProjectModalClosed] = useState(true);
    const [isAssignProjectModalClosed, setIsAssignProjectModalClosed] = useState(true);
    const [projectlist, setProjectList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [filterBy, setFilterBy] = useState(''); // Filter by column
    const [filterValue, setFilterValue] = useState(''); // Filter value
    const [sortBy, setSortBy] = useState('name'); // Initial sorting column
    const [sortDirection, setSortDirection] = useState('asc'); // Sorting direction ('asc' or 'desc')
    const [sortOptions] = useState(['name', 'description', 'projectManager.username', '_id']); // Sortable columns
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [projectdata, setProjectdata] = useState([])

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [projecteditdata, setProjectEditdata] = useState([])

    const dispatch = useDispatch();

    const getProjects = async () => {
        const projectData = await getAllProjects();
        console.log('projectData', projectData.data.projects);
        setProjectList(projectData.data.projects);
        dispatch(projectListData(projectData));
        setIsLoading(false);
    };

    useEffect(() => {
        getProjects();
    }, []);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = async (taskData) => {
        console.log('taskData', taskData);
        handleModalClose();
        await refreshProjectList();
    };

    const handleAssignModalOpen = () => {
        setIsAssignModalOpen(true);
    };

    const handleAssignModalClose = () => {
        setIsAssignModalOpen(false);
    };

    const handleAssignFormSubmit = async (taskData) => {
        console.log('taskData', taskData);
        handleAssignModalClose();
        await refreshProjectList();
    };

    const refreshProjectList = async () => {
        // Implement your refresh logic here
    };

    const handleAddProjectSuccess = async () => {
        // Implement your success logic here
    };

    const handleAssignProjectSuccess = async () => {
        // Implement your success logic here
    };

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;

    // Filter Data
    const filteredProjects = projectlist.filter((item) => {
        const itemData = `${item._id} ${item.name} ${item.description} ${item.projectManager.username}`.toLowerCase();
        return itemData.includes(filterValue.toLowerCase());
    });


    // Sort Data
    const sortedProjects = filteredProjects.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            const aValueLower = aValue.toLowerCase();
            const bValueLower = bValue.toLowerCase();

            if (aValueLower < bValueLower) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValueLower > bValueLower) {
                return sortDirection === 'asc' ? 1 : -1;
            }
        } else if (typeof aValue === 'object' && typeof bValue === 'object') {
            // Handle sorting of nested objects, e.g., 'projectManager.username'
            const aValueLower = aValue.username.toLowerCase();
            const bValueLower = bValue.username.toLowerCase();

            if (aValueLower < bValueLower) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValueLower > bValueLower) {
                return sortDirection === 'asc' ? 1 : -1;
            }
        }

        return 0;
    });


    const projectsToShow = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

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

    const handleMenuOpen = (event, itemId) => {
        setAnchorEl(event.currentTarget);
        setSelectedItemId(itemId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleView = (item) => {
        console.log('View Project', item);
        setProjectdata(item)
        setIsViewModalOpen(true);
        handleMenuClose();
        // Implement your view logic here
    };

    const handleEdit = (item) => {
        console.log('Edit', item)
        setProjectEditdata(item)
        setIsEditModalOpen(true)
        handleMenuClose();
    };

    const handleDelete = (item) => {
        handleMenuClose();
        // Implement your delete logic here
    };

    const handleSortChange = (column) => {
        if (column === sortBy) {
            // Toggle the sorting direction if the same column is clicked again
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set a new sorting column and default to 'asc' direction
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const handleViewFormSubmit = async (project_data) => {
        console.log('project_data', project_data);
        handleViewModalClose();
        await refreshProjectList();
    };

    const handleViewModalClose = () => {
        setIsViewModalOpen(false);
    };


    const handleEditFormSubmit = async (project_data) => {
        console.log('edit project_data', project_data);
        handleEditModalClose();
        await refreshProjectList();
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };



    return (
        <>
            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>Projects</h1>
                            <small>Home / Projects</small>
                        </div>
                        <div className="page-content">
                            <div className="records table-responsive">
                                <div className="record-header">
                                    <div className="add">
                                        <FormControl variant="outlined" style={{ width: '150px' }}>
                                            <InputLabel
                                                sx={{
                                                    color: '#9854CB', // Change the label text color here
                                                }}
                                            >
                                                Filter By
                                            </InputLabel>
                                            <Select
                                                value={filterBy}
                                                onChange={(e) => setFilterBy(e.target.value)}
                                                label="Filter By"
                                                size="small"
                                                sx={{
                                                    "& label.Mui-focused": {
                                                        color: "#9854CB",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#9854CB !important", // Change the outline border color here
                                                        },
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        borderColor: '#9854CB', // Change the input's border color here
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                <MenuItem value="name">Name</MenuItem>
                                                <MenuItem value="description">Description</MenuItem>
                                                <MenuItem value="projectManager.username">Project Manager</MenuItem>
                                                <MenuItem value="_id">ID</MenuItem>
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
                                            inputProps={{
                                                style: {
                                                    borderColor: '#9854CB',
                                                    color: "#9854CB"
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="add-button-container">
                                        <Button
                                            variant="contained"
                                            onClick={handleModalOpen}
                                            className="add-button"
                                            style={{ background: '#9854CB', borderRadius: '15px' }}
                                        >
                                            Add Project&nbsp;<i className="las la-briefcase"></i>
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button
                                            variant="contained"
                                            onClick={handleAssignModalOpen}
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
                                            <TableRow>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span onClick={() => handleSortChange('_id')} style={{ cursor: 'pointer' }}><span className="las la-sort"></span>ID</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span onClick={() => handleSortChange('name')} style={{ cursor: 'pointer' }}><span className="las la-sort"></span>Project Name</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span onClick={() => handleSortChange('description')} style={{ cursor: 'pointer' }}><span className="las la-sort"></span>Description</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span onClick={() => handleSortChange('projectManager.username')} style={{ cursor: 'pointer' }}><span className="las la-sort"></span>Project Manager</span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {projectsToShow.map((item, i) => {
                                                return (
                                                    <TableRow key={item._id}>
                                                        <TableCell>{item._id}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.description}</TableCell>
                                                        <TableCell>{item.projectManager.username}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <IconButton
                                                                aria-label="options"
                                                                onClick={(event) => handleMenuOpen(event, item._id)}
                                                            >
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            {/* <Menu
                                                                anchorEl={anchorEl}
                                                                open={Boolean(anchorEl)}
                                                                onClose={handleMenuClose}
                                                            >
                                                                <MenuItem onClick={() => handleView(item)}>View</MenuItem>
                                                                <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                                                                <MenuItem onClick={() => handleDelete(item)}>Delete</MenuItem>
                                                            </Menu> */}
                                                            <Menu
                                                                anchorEl={anchorEl}
                                                                open={Boolean(anchorEl)}
                                                                onClose={handleMenuClose}
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
                            <AddProjectModal
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setIsAddProjectModalClosed(true);
                                }}
                                onSubmit={handleFormSubmit}
                                onAddProjectSuccess={handleAddProjectSuccess}
                            />
                            <AssignProjectModal
                                isAssignModalOpen={isAssignModalOpen}
                                onAssignModalClose={() => {
                                    setIsAssignModalOpen(false);
                                    setIsAddProjectModalClosed(true);
                                }}
                                onAssignModalSubmit={handleAssignFormSubmit}
                                onAssignProjectSuccess={handleAssignProjectSuccess}
                            />
                            <ViewProject
                                isOpen={isViewModalOpen}
                                onClose={() => {
                                    setIsViewModalOpen(false);

                                }}
                                onSubmit={handleViewFormSubmit}
                                projectdata={projectdata}
                            />
                            <EditProject
                                isEditOpen={isEditModalOpen}
                                onEditClose={() => {
                                    setIsEditModalOpen(false)
                                }}
                                editticket={handleEditFormSubmit}
                                projecteditdata={projecteditdata}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Project;

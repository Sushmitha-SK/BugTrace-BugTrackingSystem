import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { getAllProjects } from '../../api/projectApi';
import ViewProject from '../../components/ViewProject';
import EditProject from './../../components/EditProject';
import AssignProjectModal from './../../components/AssignProjectModal';

const ProjectManager_Projects = () => {
    const [projectlist, setProjectList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddProjectModalClosed, setIsAddProjectModalClosed] = useState(true);
    const [projectdata, setProjectdata] = useState([]);
    const [projectEditdata, setProjectEditdata] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditProjectModalClosed, setIsEditProjectModalClosed] = useState(true);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isAssignModalClosed, setIsAssignModalClosed] = useState(true);

    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // Initial sorting order



    const userID = useSelector((state) => state.login.data.id);

    const getProjects = async () => {
        try {
            const projectData = await getAllProjects();
            console.log('projectData', projectData?.data?.projects);

            if (projectData?.data?.projects) {
                // Filter projects where projectManager _id matches userID
                const filteredProjects = projectData.data.projects.filter(
                    (project) => project.projectManager._id === userID
                );

                setProjectList(filteredProjects);
            } else {
                console.log('Project data is missing in the response.');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProjects();
    }, []);

    const handleMenuOpen = (event, itemId) => {
        setAnchorEl(event.currentTarget);
        setSelectedItemId(itemId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleView = (item) => {
        console.log('View Project', item);
        setProjectdata(item);
        setIsModalOpen(true);
        handleMenuClose();
        // Implement your view logic here
    };

    const handleEdit = (item) => {
        console.log('Edit Project', item);
        setProjectEditdata(item);
        setIsEditModalOpen(true);
        handleMenuClose();
        // Implement your edit logic here
    };

    const handleDelete = (item) => {
        handleMenuClose();
        // Implement your delete logic here
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = async (project_data) => {
        console.log('project_data', project_data);
        handleModalClose();
        await refreshProjectList();
    };

    const refreshProjectList = async () => {
        // Implement your refresh logic here
    };

    const handleEditFormSubmit = async (project_data) => {
        console.log('project_data', project_data);
        handleEditModalClose();
        await refreshProjectList();
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    //Assign Project
    const handleAssignModalOpen = () => {
        setIsAssignModalOpen(true);
    };

    const handleAssignFormSubmit = async (project_data) => {
        console.log('project_data', project_data);
        handleAssignModalClose();
        await refreshProjectList();
    };

    const handleAssignModalClose = () => {
        setIsAssignModalOpen(false);
    };

    const handleAddUserSuccess = async () => {
        // Implement your add user success logic here
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    // const sortedProjectList = [...projectlist].sort((a, b) => {
    //     const aValue = a[sortColumn];
    //     const bValue = b[sortColumn];

    //     if (sortOrder === 'asc') {
    //         return aValue.localeCompare(bValue);
    //     } else {
    //         return bValue.localeCompare(aValue);
    //     }
    // });
    const sortedProjectList = [...projectlist].sort((a, b) => {
        const aValue = a[sortColumn] || ''; // Fallback to an empty string if the value is undefined
        const bValue = b[sortColumn] || '';

        if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });


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
                                    <div className="add">Filter Items</div>
                                    <div className="add-button-container">
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
                                                    <span
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleSort('id')}
                                                    >
                                                        <span className="las la-sort"></span>ID
                                                    </span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleSort('name')}
                                                    >
                                                        <span className="las la-sort"></span>Project Name
                                                    </span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleSort('description')}
                                                    >
                                                        <span className="las la-sort"></span>Description
                                                    </span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleSort('projectManager.username')}
                                                    >
                                                        <span className="las la-sort"></span>Project Manager
                                                    </span>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <span>Action</span>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sortedProjectList.map((item, i) => (
                                                <TableRow key={i}>
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
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <ViewProject
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setIsAddProjectModalClosed(true);
                                }}
                                onSubmit={handleFormSubmit}
                                projectdata={projectdata}
                            />

                            <EditProject
                                isEditOpen={isEditModalOpen}
                                onEditClose={() => {
                                    setIsEditModalOpen(false);
                                    setIsEditProjectModalClosed(true);
                                }}
                                onSubmit={handleEditFormSubmit}
                                projecteditdata={projectEditdata}
                            />

                            <AssignProjectModal
                                isAssignModalOpen={isAssignModalOpen}
                                onAssignModalClose={() => {
                                    setIsAssignModalOpen(false);
                                    setIsAssignModalClosed(true);
                                }}
                                onAssignModalSubmit={handleAssignFormSubmit}
                                onAssignProjectSuccess={handleAddUserSuccess}
                                currentUserId={userID}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default ProjectManager_Projects;

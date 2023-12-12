import React, { useEffect, useState } from 'react'
import '../../styles/Dashboard.css'
import '../../styles/ViewModal.css'
import Sidebar from '../../components/Sidebar'
import GroupIcon from '@mui/icons-material/Group';
import TaskIcon from '@mui/icons-material/Task';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BugReportIcon from '@mui/icons-material/BugReport';
import WorkIcon from '@mui/icons-material/Work';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, CircularProgress } from '@mui/material';
import Header from './../../components/Header';
import { getAllUsers } from '../../api/userApi';
import AddProjectModal from './../../components/AddProjectModal';
import { useDispatch } from 'react-redux';
import { getAllProjects } from '../../api/projectApi';
import { projectListData } from '../../redux/store/slice/projectSlice';
import { getAllBugTickets } from '../../api/bugticketApi';




const AdminDashboard = () => {

    const [notstartedcount, setNotstartedcount] = useState(0)
    const [progressCount, setProgressCount] = useState(0)
    const [completeCount, setCompleteCount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddProjectModalClosed, setIsAddProjectModalClosed] = useState(true);
    const [projectlist, setProjectList] = useState([]);
    const [countproject, setCountProject] = useState(0)
    const [bugData, setBugData] = useState([]);
    const [countbugs, setCountBugs] = useState(0)
    const [userlist, setUserList] = useState([]);
    const [countusers, setCountUsers] = useState(0)
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);


    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });


    const [newBugs, setNewBugs] = useState(0)
    const [openBugs, setOpenBugs] = useState(0)
    const [inprogressBugs, setInprogressBugs] = useState(0)
    const [resolvedBugs, setResolvedBugs] = useState(0)
    const [reopenBugs, setReOpenBugs] = useState(0)
    const [closedBugs, setClosedBugs] = useState(0)


    const dispatch = useDispatch()

    const getProjects = async () => {
        const projectData = await getAllProjects();
        console.log('projectData', projectData.data.projects);
        setProjectList(projectData.data.projects);
        dispatch(projectListData(projectData));
        setCountProject(projectData.data.projects.length)

    };



    const getBugTickets = async () => {
        const getTicketsdata = await getAllBugTickets();
        if (Array.isArray(getTicketsdata.data.bugTickets)) {
            setBugData(getTicketsdata.data.bugTickets);
            setCountBugs(getTicketsdata.data.bugTickets.length)

            // Filter the array to find new bugs
            const newBugs = getTicketsdata.data.bugTickets.filter(newticket => newticket.status === 'New');
            setNewBugs(newBugs.length);

            // Filter the array to find open bugs
            const openBugs = getTicketsdata.data.bugTickets.filter(openticket => openticket.status === 'Open');
            setOpenBugs(openBugs.length);

            // Filter the array to find inprogress bugs
            const inprogressBugs = getTicketsdata.data.bugTickets.filter(inprogressticket => inprogressticket.status === 'In Progress');
            setInprogressBugs(inprogressBugs.length);

            // Filter the array to find resolved bugs
            const resolvedBugs = getTicketsdata.data.bugTickets.filter(resolvedticket => resolvedticket.status === 'Resolved');
            setResolvedBugs(resolvedBugs.length);

            // Filter the array to find reopned bugs
            const reopenedBugs = getTicketsdata.data.bugTickets.filter(reopenedticket => reopenedticket.status === 'Reopen');
            setReOpenBugs(reopenedBugs.length);

            // Filter the array to find closed bugs
            const closedBugs = getTicketsdata.data.bugTickets.filter(closedticket => closedticket.status === 'Closed');
            setClosedBugs(closedBugs.length);

        } else {
            console.error('Bug data is not an array:', getTicketsdata);
        }
    }

    const getUserData = async () => {
        const userdata = await getAllUsers()
        setUserList(userdata.data.users)
        setCountUsers(userdata.data.users.length)
    }

    useEffect(() => {
        getProjects()
        getBugTickets()
        getUserData()
    }, [])


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

    const refreshProjectList = async () => {

    };

    const handleAddProjectSuccess = async () => {

    };


    const barData = [
        { name: 'New', count: newBugs },
        { name: 'Open', count: openBugs },
        { name: 'In Progress', count: inprogressBugs },
        { name: 'Resolved', count: resolvedBugs },
        { name: 'Reopen', count: reopenBugs },
        { name: 'Closed', count: closedBugs },
    ];

    // Format the date as "Mon 22, 2021"
    const formattedDate = currentDateTime.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        year: 'numeric',
    });

    // Format the time as "HH:MM:SS"
    const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const projectsToShow = projectlist.slice(indexOfFirstProject, indexOfLastProject);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(projectlist.length / projectsPerPage);


    // Sorting
    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedProjects = () => {
        const sorted = [...projectsToShow];
        if (sortConfig.key !== null) {
            sorted.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sorted;
    };


    return (
        <>
            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>Dashboard</h1>
                            <small>Home / Dashboard</small>

                        </div>

                        <div className="page-content">
                            <div className="page-header" style={{ backgroundColor: '#fdfefe', borderRadius: '10px', marginBottom: '2%', width: '250px' }}>
                                <h1>Today</h1>
                                <div style={{ paddingTop: '1%' }}>
                                    <small style={{ fontSize: '16px', color: '#9854CB', fontWeight: '600' }}>{formattedDate} | {formattedTime}</small>
                                </div>
                            </div>
                            <div className="analytics">
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{countproject}</h2>
                                        <span>
                                            <WorkIcon fontSize='large' />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Projects</small>
                                        <div className="card-indicator">
                                            <div className="indicator one" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{countbugs}</h2>
                                        <span>
                                            <BugReportIcon fontSize='large' />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Total Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator four" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{openBugs}</h2>
                                        <span>
                                            <AssignmentLateIcon fontSize='large' />

                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Open Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator two" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{closedBugs}</h2>
                                        <span>
                                            {/* <TaskAltIcon fontSize='large' /> */}

                                            <CheckCircleIcon fontSize='large' />
                                        </span>

                                    </div>
                                    <div className="card-progress">
                                        <small>Closed Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator three" style={{ width: '65%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{countusers}</h2>
                                        <span>
                                            <GroupIcon fontSize="large" />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Users</small>
                                        <div className="card-indicator">
                                            <div className="indicator two" style={{ width: '90%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bar-chart-container">
                                <BarChart width={600} height={300} data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </div>

                            <div className="records table-responsive">
                                <div className="record-header">
                                    <div className="add">
                                        {/* <button>Add record</button> */}
                                    </div>

                                    <div className="browse">
                                        <Button

                                            onClick={handleModalOpen}
                                            type="submit"
                                            sx={{
                                                borderRadius: 3,
                                                backgroundColor: '#9854CB',
                                                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;',
                                                width: '150px',
                                                '&:hover': {
                                                    backgroundColor: '#7B3FA3', // Change this to the desired hover background color
                                                }
                                            }}
                                            variant="contained">
                                            Add Project&nbsp;<i className="las la-briefcase"></i>
                                        </Button>

                                    </div>
                                </div>

                                <div>
                                    <table width="100%">
                                        <thead>
                                            <tr>

                                                <th onClick={() => sortTable('_id')}>
                                                    ID
                                                    {sortConfig.key === '_id' && (
                                                        <span>{sortConfig.direction === 'ascending' ? <span className="las la-sort"></span> : <span className="las la-sort"></span>}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => sortTable('name')}>
                                                    Project Name
                                                    {sortConfig.key === 'name' && (
                                                        <span>{sortConfig.direction === 'ascending' ? <span className="las la-sort"></span> : <span className="las la-sort"></span>}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => sortTable('description')}>
                                                    Description
                                                    {sortConfig.key === 'description' && (
                                                        <span>{sortConfig.direction === 'ascending' ? <span className="las la-sort"></span> : <span className="las la-sort"></span>}</span>
                                                    )}
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {sortedProjects().map((item, i) => {
                                                return (
                                                    <tr key={item._id}>
                                                        <td>{item._id}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.description}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    <div class="center">
                                        <div className="pagination">
                                            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>{page}</button>
                                            ))}
                                            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>

                                        </div>
                                    </div>
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
                            </div>

                        </div>
                    </main>
                </div>
            </div>

        </>
    )
}

export default AdminDashboard
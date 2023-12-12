import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'

import GroupIcon from '@mui/icons-material/Group';
import TaskIcon from '@mui/icons-material/Task';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getAllProjects, getusersunderPM } from '../../api/projectApi';
import { useDispatch, useSelector } from 'react-redux';
import { projectListData } from '../../redux/store/slice/projectSlice';
import AddProjectModal from '../../components/AddProjectModal';
import { Button, CircularProgress } from '@mui/material';
import { getUserByID } from '../../api/userApi';
import { Circles } from 'react-loader-spinner';
import { getAllBugTickets } from '../../api/bugticketApi';


const ProjectManagerDashboard = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const [notstartedcount, setNotstartedcount] = useState(0)
    const [progressCount, setProgressCount] = useState(0)
    const [completeCount, setCompleteCount] = useState(0)
    const [projectlist, setProjectList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddProjectModalClosed, setIsAddProjectModalClosed] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [userInfo, setUserInfo] = useState([])
    const [memberInfo, setMemberInfo] = useState([])
    const [membercount, setMembercount] = useState(0)
    const [projectCount, setProjectCount] = useState(0)
    const [bugticketlist, setBugTicketlist] = useState([])

    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
    const [sortedColumn, setSortedColumn] = useState(null); // Column name to be sorted
    const [ticketlist, setTicketlist] = useState([]);
    const [ticketlistCount, setTicketlistCount] = useState(0);

    const [newstatetickets, setNewstateTickets] = useState(0)
    const [openstateBugs, setOpenstateBugs] = useState(0)
    const [inprogressstateBugs, setInprogressstateBugs] = useState(0)
    const [resolvedstateBugs, setResolvedstateBugs] = useState(0)
    const [reponedstateBugs, setReponedstateBugs] = useState(0)
    const [closedstateBugs, setClosedSateBugs] = useState(0)

    const dispatch = useDispatch()
    const userID = useSelector((state) => state.login.data.id)

    const getProjectMembers = async () => {
        try {
            const projectmembers = await getusersunderPM(userID);
            setMemberInfo(projectmembers.data.users);
            setMembercount(projectmembers.data.users.length)
        } catch (error) {
            console.error('Error loading project members:', error);
        }
    };

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
                setProjectCount(projectlist.length)             
                dispatch(projectListData(projectData));
            } else {
                console.log('Project data is missing in the response.');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setIsLoading(false);
        }
    };


    const getBugs = async () => {
        try {
            const getAllBugs = await getAllBugTickets();
            const filteredBugTickets = getAllBugs.data.bugTickets.filter((ticket) => {
                return ticket.project.projectManager === userID;
            });
            setTicketlist(filteredBugTickets)
            setTicketlistCount(filteredBugTickets.length);
            console.log('LENGTH', ticketlist, ticketlistCount)

            const countTicketsByStatus = (status) => {
                return ticketlist.filter((ticket) => ticket.status === status).length;
            };

            const newTicketCount = countTicketsByStatus('New');
            const openTicketCount = countTicketsByStatus('Open');
            const inProgressTicketCount = countTicketsByStatus('InProgress');
            const resolvedTicketCount = countTicketsByStatus('Resolved');
            const reopenTicketCount = countTicketsByStatus('Reopen');
            const closedTicketCount = countTicketsByStatus('Closed');

            console.log('New Tickets Count:', newTicketCount);
            console.log('Open Tickets Count:', openTicketCount);
            console.log('InProgress Tickets Count:', inProgressTicketCount);
            console.log('Resolved Tickets Count:', resolvedTicketCount);
            console.log('Reopen Tickets Count:', reopenTicketCount);
            console.log('Closed Tickets Count:', closedTicketCount);

            setNewstateTickets(newTicketCount)
            setOpenstateBugs(openTicketCount)
            setInprogressstateBugs(inProgressTicketCount)
            setResolvedstateBugs(resolvedTicketCount)
            setReponedstateBugs(reopenTicketCount)
            setClosedSateBugs(closedTicketCount)

        } catch (error) {
            console.error('Error fetching bug tickets:', error);
        }
    };

    useEffect(() => {
        getBugs();
        getProjects()
    }, [userID]);

 
    useEffect(() => {
        const getUserDetails = async () => {
            const userdata = await getUserByID(userID);
            setUserInfo(userdata.data.user);
        }
        getUserDetails()
        getProjectMembers()

    }, [userID])



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

    useEffect(() => {
        getProjects()
    }, [userID])

    // const barData = [
    //     { name: 'New', count: notstartedcount },
    //     { name: 'In Progress', count: progressCount },
    //     { name: 'Completed', count: completeCount },
    // ];
    const barData = [
        { name: 'New', count: newstatetickets },
        { name: 'Open', count: openstateBugs },
        { name: 'In Progress', count: inprogressstateBugs },
        { name: 'Resolved', count: resolvedstateBugs },
        { name: 'Reopen', count: reponedstateBugs },
        { name: 'Closed', count: closedstateBugs },
    ];


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

    // Pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const projectsManagedByUser = projectlist.filter(project => project.projectManager._id === userID);

    const projectsToShow = projectsManagedByUser.slice(indexOfFirstProject, indexOfLastProject);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(projectsManagedByUser.length / projectsPerPage);


    // Render the loader if loading state is true
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

    //Sorting
    const handleSortClick = (columnName) => {
        if (sortedColumn === columnName) {
            // If the same column is clicked again, toggle the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // If a new column is clicked, set the sorting column to that column and default to ascending
            setSortedColumn(columnName);
            setSortDirection('asc');
        }
    };

    // Sort the projectsToShow array based on the selected column and sorting direction
    const sortedProjects = [...projectsToShow].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortedColumn] < b[sortedColumn] ? -1 : 1;
        } else {
            return a[sortedColumn] > b[sortedColumn] ? -1 : 1;
        }
    });


    return (
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
                        <div className="page-header" style={{
                            backgroundColor: '#fdfefe',
                            borderRadius: '10px', marginBottom: '2%', width: '250px'
                        }}>
                            Hi {userInfo.username}!&nbsp;
                            <h1>Today Is</h1>
                            <div style={{ paddingTop: '1%' }}>
                                <small style={{ fontSize: '16px', color: '#9854CB', fontWeight: '600' }}>{formattedDate} | {formattedTime}</small>
                            </div>
                        </div>

                        <div className="analytics">
                            <div className="card">
                                <div className="card-head">
                                    <h2>{projectCount}</h2>
                                    <span>
                                        <TaskIcon fontSize='large' />
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
                                    <h2>{membercount}</h2>
                                    <span>
                                        <GroupIcon fontSize="large" />
                                    </span>
                                </div>
                                <div className="card-progress">
                                    <small>Project Members</small>
                                    <div className="card-indicator">
                                        <div className="indicator two" style={{ width: '90%' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-head">
                                    <h2>{ticketlistCount}</h2>
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
                                    <h2>{openstateBugs}</h2>
                                    <span>
                                        <AssignmentIcon fontSize='large' />
                                    </span>
                                </div>
                                <div className="card-progress">
                                    <small>OpenTickets</small>
                                    <div className="card-indicator">
                                        <div className="indicator two" style={{ width: '80%' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-head">
                                    <h2>{reponedstateBugs}</h2>
                                    <span>
                                        <AssignmentIcon fontSize='large' />
                                    </span>
                                </div>
                                <div className="card-progress">
                                    <small>Reopen Tickets</small>
                                    <div className="card-indicator">
                                        <div className="indicator two" style={{ width: '80%' }} />
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="bar-chart-container">
                            {/* <BarChart width={600} height={300} data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart> */}
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
                                <h4>Projects</h4>
                                <div className="add">
                                    {/* <button>Add record</button> */}
                                </div>

                                <div className="browse">
                                    {/* <Button

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
                                    </Button> */}

                                </div>
                            </div>

                            <div>
                                <table width="100%">
                                    {/* <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th><span className="las la-sort"></span> Project Name</th>
                                            <th><span className="las la-sort"></span> Description</th>


                                        </tr>
                                    </thead> */}
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSortClick('id')}>
                                                ID
                                                <i className={`las la-sort`} />
                                            </th>
                                            <th onClick={() => handleSortClick('name')}>
                                                Project Name
                                                <i className={`las la-sort`} />
                                            </th>
                                            <th onClick={() => handleSortClick('description')}>
                                                Description
                                                <i className={`las la-sort`} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {/* projectsToShow.map((item, i) => { */}
                                        {sortedProjects.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{item._id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.description}</td>
                                                </tr>
                                            )
                                        })
                                        }
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
    )
}

export default ProjectManagerDashboard
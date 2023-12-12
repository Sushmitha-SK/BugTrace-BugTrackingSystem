import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'
import { Tooltip } from '@mui/material'

import GroupIcon from '@mui/icons-material/Group';
import TaskIcon from '@mui/icons-material/Task';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import { getAllProjects } from '../../api/projectApi'
import { useSelector } from 'react-redux'
import { getBugTicketsAssignedToDeveloper } from '../../api/bugticketApi'

const DeveloperDashboard = () => {
    const [notstartedcount, setNotstartedcount] = useState(0)
    const [progressCount, setProgressCount] = useState(0)
    const [completeCount, setCompleteCount] = useState(0)
    const [totalBugs, setTotalBugs] = useState(0)
    const [newBugs, setNewBugs] = useState(0)
    const [openBugs, setOpenBugs] = useState(0)
    const [inprogressBugs, setInprogressBugs] = useState(0)
    const [resolvedBugs, setResolvedBugs] = useState(0)
    const [reopenBugs, setReOpenBugs] = useState(0)
    const [closedBugs, setClosedBugs] = useState(0)
    const [projectlist, setProjectList] = useState([]);
    const [countproject, setCountProject] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());



    const barData = [
        { name: 'New', count: newBugs },
        { name: 'Open', count: openBugs },
        { name: 'In Progress', count: inprogressBugs },
        { name: 'Resolved', count: resolvedBugs },
        { name: 'Reopen', count: reopenBugs },
        { name: 'Closed', count: closedBugs },
    ];

    const userID = useSelector((state) => state.login.data.id)

    const getProjects = async () => {
        const projectData = await getAllProjects();
        console.log('userID:', userID);
        console.log('projectData:', projectData);
        // Filter the projects based on assignedUsers containing userID
        const filteredProjects = projectData.data.projects.filter((project) =>
            project.assignedUsers.includes(userID)
        );

        console.log('filteredProjects:', filteredProjects);
        setProjectList(filteredProjects);

        setCountProject(filteredProjects.length)
    };

    const getAssignedBugCount = async () => {
        const assignedBugData = await getBugTicketsAssignedToDeveloper(userID);

        if (Array.isArray(assignedBugData.data.bugTickets)) {
            setTotalBugs(assignedBugData.data.bugTickets.length);

            // Filter the array to find new bugs
            const newBugs = assignedBugData.data.bugTickets.filter(newticket => newticket.status === 'New');
            setNewBugs(newBugs.length);


            // Filter the array to find open bugs
            const openBugs = assignedBugData.data.bugTickets.filter(openticket => openticket.status === 'Open');
            setOpenBugs(openBugs.length);

            // Filter the array to find inprogress bugs
            const inprogressBugs = assignedBugData.data.bugTickets.filter(inprogressticket => inprogressticket.status === 'In Progress');
            setInprogressBugs(inprogressBugs.length);

            // Filter the array to find resolved bugs
            const resolvedBugs = assignedBugData.data.bugTickets.filter(resolvedticket => resolvedticket.status === 'Resolved');
            setResolvedBugs(resolvedBugs.length);

            // Filter the array to find reopned bugs
            const reopenedBugs = assignedBugData.data.bugTickets.filter(reopenedticket => reopenedticket.status === 'Reopen');
            setReOpenBugs(reopenedBugs.length);

            // Filter the array to find closed bugs
            const closedBugs = assignedBugData.data.bugTickets.filter(closedticket => closedticket.status === 'Closed');
            setClosedBugs(closedBugs.length);


        } else {
            console.error('Bug data is not in the expected format (array)');
        }

    }

    useEffect(() => {
        getProjects();
        getAssignedBugCount();
    }, [userID]);

    // Pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const projectsToShow = projectlist.slice(indexOfFirstProject, indexOfLastProject);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(projectlist.length / projectsPerPage);


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
                            <div className="page-header" style={{
                                backgroundColor: '#fdfefe',
                                borderRadius: '10px', marginBottom: '2%', width: '250px'
                            }}>
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
                                        <h2>{totalBugs}</h2>
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
                                            <AssignmentIcon fontSize='large' />

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
                                        <h2>{reopenBugs}</h2>
                                        <span>
                                            <GroupIcon fontSize="large" />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Reopened Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator two" style={{ width: '90%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{closedBugs}</h2>
                                        <span>
                                            <TaskAltIcon fontSize='large' />
                                        </span>

                                    </div>
                                    <div className="card-progress">
                                        <small>Closed Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator three" style={{ width: '65%' }} />
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
                                        <h4>Assigned Projects</h4>
                                        {/* <button>Add record</button> */}
                                    </div>

                                    <div className="browse">
                                        &nbsp;
                                    </div>
                                </div>

                                <div>
                                    <table width="100%">
                                        <thead>
                                            <tr>
                                                <th >ID</th>
                                                <th><span className="las la-sort"></span> Project Name</th>
                                                <th><span className="las la-sort"></span> Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projectsToShow.map((item) => {

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

                            </div>


                        </div>
                    </main>
                </div>


            </div>

        </>
    )
}

export default DeveloperDashboard
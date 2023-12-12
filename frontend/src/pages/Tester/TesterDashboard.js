import React, { useEffect, useState } from 'react'
import GroupIcon from '@mui/icons-material/Group';
import TaskIcon from '@mui/icons-material/Task';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Bar, BarChart, CartesianGrid, Cell, Label, Legend, XAxis, YAxis } from 'recharts';
import { Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects } from '../../api/projectApi';
import { getBugTicketsTester } from '../../api/bugticketApi';

const TesterDashboard = () => {
    const [notstartedcount, setNotstartedcount] = useState(0)
    const [progressCount, setProgressCount] = useState(0)
    const [completeCount, setCompleteCount] = useState(0)
    const [countproject, setCountProject] = useState(0)
    const [newstatetickets, setNewstateTickets] = useState(0)
    const [openstateBugs, setOpenstateBugs] = useState(0)
    const [countOpen, setCountOpen] = useState(0)
    const [inprogressstateBugs, setInprogressstateBugs] = useState(0)
    const [resolvedstateBugs, setResolvedstateBugs] = useState(0)
    const [reponedstateBugs, setReponedstateBugs] = useState(0)
    const [closedstateBugs, setClosedSateBugs] = useState(0)
    const [projectlist, setProjectList] = useState([]);
    const [bugticketlist, setBugticketlist] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());


    const userID = useSelector((state) => state.login.data.id)


    const getBugTickets = async () => {
        const ticketdata = await getBugTicketsTester(userID)
        console.log('Ticket Data', ticketdata)
        setBugticketlist(ticketdata || [])
        const newBugTickets = ticketdata?.data.bugTickets.filter(ticket => ticket.status === 'New');
        const openBugTickets = ticketdata?.data.bugTickets.filter(ticket => ticket.status === 'Open');
        const inProgressBugTickets = ticketdata?.data.bugTickets.filter(ticket => ticket.status === 'In Progress');
        const resolvedBugTickets = ticketdata?.data.bugTickets.filter(ticket => ticket.status === 'Resolved');
        const reopenBugTickets = ticketdata?.data.bugTickets.filter(ticket => ticket.status === 'Reopen');
        const closedBugTickets = ticketdata?.data.bugTickets.filter(ticket => ticket.status === 'Closed');

        // ['New', 'Open', 'In Progress', 'Resolved', 'Reopen', 'Closed']
        setCountOpen(openBugTickets.length + inProgressBugTickets.length + reopenBugTickets.length)

        setNewstateTickets(newBugTickets.length)
        setOpenstateBugs(openBugTickets.length)
        setInprogressstateBugs(inProgressBugTickets.length)
        setResolvedstateBugs(resolvedBugTickets.length)
        setReponedstateBugs(reopenBugTickets.length)
        setClosedSateBugs(closedBugTickets.length)
    }

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


    useEffect(() => {
        getProjects();
        getBugTickets();

    }, [userID]);

    // Pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const projectsToShow = projectlist.slice(indexOfFirstProject, indexOfLastProject);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(projectlist.length / projectsPerPage);

    const barColors = ['#8884d8', '#ffb55a', '#ffee65', '#8bd3c7', '#bd7ebe'];

    const barData = [
        { name: 'New', count: newstatetickets },
        { name: 'Open', count: openstateBugs },
        { name: 'In Progress', count: inprogressstateBugs },
        { name: 'Resolved', count: resolvedstateBugs },
        { name: 'Reopened', count: reponedstateBugs },
    ];
    const coloredBarData = barData.map((item, index) => ({
        ...item,
        fill: barColors[index % barColors.length], // Use modulo to loop through colors if more bars than colors
    }));

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
                                        <h2>{bugticketlist.data?.bugTickets.length}</h2>
                                        <span>
                                            <BugReportIcon fontSize='large' />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Total Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator four" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{newstatetickets}</h2>
                                        <span>
                                            <NoteAddIcon fontSize='large' />

                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>New Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator three" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{countOpen}</h2>
                                        <span>
                                            <AssignmentIcon fontSize='large' />

                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Open Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator five" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{closedstateBugs}</h2>
                                        <span>
                                            <TaskAltIcon fontSize='large' />
                                        </span>

                                    </div>
                                    <div className="card-progress">
                                        <small>Closed Tickets</small>
                                        <div className="card-indicator">
                                            <div className="indicator six" style={{ width: '65%' }} />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="card">
                                    <div className="card-head">
                                        <h2>65</h2>
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
 */}


                            </div>

                            <div className="bar-chart-container">
                                {/* <BarChart width={600} height={300} data={barData}> */}
                                <BarChart width={600} height={300} data={coloredBarData}>

                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {/* <Bar dataKey="count" fill="#8884d8" /> */}
                                    <Bar dataKey="count">
                                        {coloredBarData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                        <Label
                                            content={({ value }) => value}
                                            position="top"
                                            fill="black" // Customize label text color
                                        />
                                    </Bar>
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

export default TesterDashboard
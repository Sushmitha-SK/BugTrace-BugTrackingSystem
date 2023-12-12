import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import '../styles/Dashboard.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import userImage from '../assets/usericon.png'
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { getUserByID } from '../api/userApi';
import User from './../pages/Admin/User';

const Sidebar = () => {

    const [userInfo, setUserInfo] = useState([])

    const loginData = useSelector((state) => state.login.data.role);
    const userID = useSelector((state) => state.login.data.id)
    console.log('loginData', loginData)

    const isAdmin = loginData === 'Admin';
    const isProjectManager = loginData === 'Project Manager';
    const isDeveloper = loginData === 'Developer';
    const isTester = loginData === 'Tester';

    useEffect(() => {
        const getUserDetails = async () => {
            const userdata = await getUserByID(userID);
            setUserInfo(userdata.data.user);
        }
        getUserDetails()

    }, [userID])

    return (
        <>
            <input type="checkbox" id="menu-toggle" />
            <div className="sidebar sidebarContent" style={{ background: '#fff' }}>
                <div className="side-header" style={{ textAlign: 'center' }}>
                    <h3 style={{ fontWeight: 500 }}>B<span style={{ fontWeight: 500 }}>ugTrace</span></h3>
                </div>
                <div className="side-content">
                    <div className="profile">
                        <div className="profile-img bg-img" style={{ backgroundImage: `url(${userImage})` }} />
                        <h4 style={{ color: '#333', textTransform: 'capitalize' }}>{userInfo.username}</h4>
                        <small>{userInfo.role}</small>
                    </div>
                    <div className="side-menu">
                        <ul>
                            {isAdmin && (
                                <li>
                                    <Tooltip title="Dashboard">
                                        <Link to="/admindashboard">
                                            <a>
                                                <span className="las la-home" />
                                                <small>Dashboard</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isProjectManager && (
                                <li>
                                    <Tooltip title="Dashboard">
                                        <Link to="/projectmanagerdashboard">
                                            <a>
                                                <span className="las la-home" />
                                                <small>Dashboard</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isDeveloper && (
                                <li>
                                    <Tooltip title="Dashboard">
                                        <Link to="/developerdashboard">
                                            <a>
                                                <span className="las la-home" />
                                                <small>Dashboard</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isTester && (
                                <li>
                                    <Tooltip title="Dashboard">
                                        <Link to="/testerdashboard">
                                            <a>
                                                <span className="las la-home" />
                                                <small>Dashboard</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isAdmin && (
                                <li>
                                    <Tooltip title="Bug Tickets">

                                        <Link to="/bug-tickets">
                                            <a>
                                                <span className="las la-bug" />
                                                <small>Bug Tickets</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}
                            {isProjectManager && (
                                <li>
                                    <Tooltip title="Bug Tickets">

                                        <Link to="/projectmanager-bugtickets">
                                            <a>
                                                <span className="las la-bug" />
                                                <small>Bug Tickets</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}
                            {isDeveloper && (
                                <li>
                                    <Tooltip title="Bug Tickets">

                                        <Link to="/bug-tickets-developer">
                                            <a>
                                                <span className="las la-bug" />
                                                <small>Bug Tickets</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isTester && (
                                <li>
                                    <Tooltip title="Bug Tickets">

                                        <Link to="/bug-tickets-tester">
                                            <a>
                                                <span className="las la-bug" />
                                                <small>Bug Tickets</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isAdmin && (
                                <li>
                                    <Tooltip title="Projects">

                                        <Link to="/projects">
                                            <a>
                                                <span className="las la-briefcase" />
                                                <small>Projects</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}
                            {isProjectManager && (
                                <li>
                                    <Tooltip title="Projects">

                                        <Link to="/projectmanager-projects">
                                            <a>
                                                <span className="las la-briefcase" />
                                                <small>Projects</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}
                            {isDeveloper && (
                                <li>
                                    <Tooltip title="Projects">

                                        <Link to="/projects-developer">
                                            <a>
                                                <span className="las la-briefcase" />
                                                <small>Projects</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}


                            {isTester && (
                                <li>
                                    <Tooltip title="Projects">

                                        <Link to="/projects-tester">
                                            <a>
                                                <span className="las la-briefcase" />
                                                <small>Projects</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}


                            {isAdmin && (
                                <li>
                                    <Tooltip title="User">

                                        <Link to="/user">
                                            <a>
                                                <span className="las la-user-friends" />
                                                <small>Users</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isProjectManager && (
                                <li>
                                    <Tooltip title="Project Members">

                                        <Link to="/pm-users">
                                            <a>
                                                <span className="las la-user-friends" />
                                                <small>Project Members</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}


                            {/* <li>
                                <Tooltip title="Reports and Analytics">

                                    <Link to="/reports-analytics">
                                        <a>
                                            <span className="las la-file-alt" />

                                            <small>Reports</small>
                                        </a>
                                    </Link>
                                </Tooltip>
                            </li> */}

                            <li>
                                <Tooltip title="Profile">

                                    <Link to="/profile">

                                        <a>
                                            <span className="las la-user-alt" />
                                            <small>Profile</small>
                                        </a>
                                    </Link>
                                </Tooltip>

                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
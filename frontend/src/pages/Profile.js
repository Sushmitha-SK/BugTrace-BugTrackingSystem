import React, { useEffect, useState } from 'react';
import Sidebar from './../components/Sidebar';
import Header from './../components/Header';
import userImage from '../assets/usericon.png'
import { Box, Button, FormLabel, Grid, Stack, TextField } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import { useSelector } from 'react-redux';
import { getUserByID } from '../api/userApi';

const Profile = () => {
    const userID = useSelector((state) => state.login.data.id)

    const [profileid, setProfileid] = useState('')
    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [assignedprojects, setAssignedprojects] = useState([])
    const [editMode, setEditMode] = useState(true);


    const getUserData = async () => {
        const data = await getUserByID(userID)
        console.log('Profile data', data)
        console.log(data.data.user.fullname)
        setProfileid(data.data.user._id)
        setFullname(data.data.user.fullname)
        setUsername(data.data.user.username)
        setEmail(data.data.user.email)
        setRole(data.data.user.role)
        setAssignedprojects(data.data.user.projects)
    }

    useEffect(() => {
        getUserData()
    }, [userID])

    // Function to toggle edit mode
    const toggleEditMode = () => {
        setEditMode(!editMode);
    }

    // Function to handle changes to the Full Name and Username fields
    const handleFullnameChange = (event) => {
        setFullname(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    // Function to handle form submission when in edit mode
    const handleSubmit = (event) => {
        event.preventDefault();

        console.log('edit Profile triggered')

        // TODO: Handle form submission, e.g., update user data
        // You can send a request to update the user data here

        // Exit edit mode after submitting the form
        setEditMode(false);
    };

    return (
        <div className="profile-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main>
                    <div className="page-header">
                        <h1>Profile</h1>
                        <small>Home / Profile</small>
                    </div>
                    <div className="page-content">
                        <div className="profile-grid">
                            <div className="user-details">
                                <div className="page-header" style={{
                                    backgroundColor: '#fdfefe',
                                    borderRadius: '10px', marginBottom: '2%',
                                    // width: '250px',
                                    textAlign: 'center',
                                }}>
                                    <div className="profile-image">
                                        <img
                                            src={userImage}
                                            alt="User Profile"
                                        />
                                    </div>
                                    <h2>{fullname}</h2>
                                    <h4 style={{ color: '#b0b0b0' }}>{profileid}</h4>
                                    <div >
                                        <p style={{ paddingTop: '5%' }}>Username: {username}</p>
                                        <p style={{ paddingTop: '5%' }}>Email: {email}</p>
                                        <p style={{ paddingTop: '5%' }}>Role: {role}</p>
                                    </div>

                                    <Button
                                        variant="contained"
                                        className="add-button"
                                        style={{ background: '#9854CB', borderRadius: '15px', marginTop: '5%' }}
                                        onClick={() => toggleEditMode()}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <h2>{assignedprojects.length}</h2>
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

                            </div>
                            <div className="edit-form">
                                <h2 style={{ color: '#7b7b7b' }}>Edit Profile</h2>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2} sx={{ marginY: 2 }}>
                                        <Grid item lg={6}>
                                            <span style={{ color: 'red', fontSize: '11px' }}>
                                                * Only the Full Name, Username are editable
                                            </span>

                                            {/* Conditionally render text fields based on editMode */}
                                            {editMode ? (
                                                <>
                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <TextField
                                                            value={fullname}
                                                            onChange={handleFullnameChange}
                                                            fullWidth
                                                            style={{ background: '#fff' }}
                                                        />
                                                    </Box>

                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Username</FormLabel>
                                                        <br />
                                                        <TextField
                                                            value={username}
                                                            onChange={handleUsernameChange}
                                                            fullWidth
                                                            style={{ background: '#fff' }}
                                                        />
                                                    </Box>

                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Email</FormLabel>
                                                        <br />
                                                        <TextField value={email} fullWidth style={{ background: '#fff' }} disabled />
                                                    </Box>

                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Role</FormLabel>
                                                        <br />
                                                        <TextField value={role} fullWidth style={{ background: '#fff' }} disabled />
                                                    </Box>
                                                </>
                                            ) : (
                                                // Display non-editable fields when not in edit mode
                                                <>
                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <br />
                                                        <TextField
                                                            value={fullname}
                                                            fullWidth
                                                            style={{ background: '#fff' }}
                                                            disabled
                                                        />
                                                    </Box>

                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Username</FormLabel>
                                                        <br />
                                                        <TextField
                                                            value={username}
                                                            fullWidth
                                                            style={{ background: '#fff' }}
                                                            disabled
                                                        />
                                                    </Box>

                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Email</FormLabel>
                                                        <br />
                                                        <TextField value={email} fullWidth style={{ background: '#fff' }} disabled />
                                                    </Box>

                                                    <Box sx={{ marginY: 2 }}>
                                                        <FormLabel>Role</FormLabel>
                                                        <br />
                                                        <TextField value={role} fullWidth style={{ background: '#fff' }} disabled />
                                                    </Box>
                                                </>
                                            )}

                                            {/* Conditionally render buttons based on editMode */}
                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                    md: "row",
                                                    lg: "row",
                                                }}
                                                spacing={2}
                                            >
                                                {editMode ? (
                                                    <>
                                                        <Button
                                                            type="submit"
                                                            variant="outlined"
                                                            sx={{
                                                                background: '#9854CB',
                                                                color: '#fff',
                                                                border: '1px #9854CB solid',
                                                            }}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                border: "1px solid #F05252",
                                                                color: "#F05252",
                                                            }}
                                                            onClick={() => setEditMode(false)} // Cancel edit mode
                                                        >
                                                            Discard
                                                        </Button>
                                                    </>
                                                ) : null}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;

import {
    FormControl, InputLabel, Modal, TextField, TextareaAutosize, Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { getUserByID } from '../api/userApi';
import { getUserDataofProject } from '../api/projectApi';


const ViewProject = ({ isOpen, onClose, projectDetails, projectdata }) => {
    console.log('Modal Project data', projectdata)
    // const projectExperts = ['Expert 1', 'Expert 2', 'Expert 3'];
    const [projectid, setProjectid] = useState('')
    const [projectname, setProjectname] = useState('')
    const [projectdesc, setProjectdesc] = useState('')
    const [projectmanager, setProjectmanager] = useState('')
    const [projectExperts, setProjectExperts] = useState([])
    const [assignedUsernames, setAssignedUsernames] = useState([]);


    useEffect(() => {
        setProjectid(projectdata._id)
        setProjectExperts(projectdata.assignedUsers)
        setProjectname(projectdata.name)
        setProjectdesc(projectdata.description)

        // setProjectmanager(projectdata.projectManager.username)

        // Fetch usernames of assignedUsers for the project
        // async function fetchAssignedUsernames() {
        //     try {
        //         const response = await getUserDataofProject({ projectid: projectdata._id });

        //         if (response.status === 200) {
        //             const usernames = response.data.users.map(user => user.username);
        //             console.log('Usernames:', usernames); // Debugging statement
        //             setAssignedUsernames(usernames);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching assigned user data:', error);
        //     }
        // }
        async function fetchAssignedUsernames() {
            try {
                const response = await getUserDataofProject({ projectid: projectdata._id });

                if (response.status === 200) {
                    const usersWithRoles = response.data.users.map(user => ({
                        id: user._id,
                        username: user.username,
                        role: user.role // Assuming 'role' is a field in the User model
                    }));

                    console.log('Users with Roles:', usersWithRoles); // Debugging statement
                    setAssignedUsernames(usersWithRoles);
                }
            } catch (error) {
                console.error('Error fetching assigned user data:', error);
            }
        }

        fetchAssignedUsernames();

        // Check if projectdata.projectManager is defined before accessing username
        if (projectdata.projectManager) {
            setProjectmanager(projectdata.projectManager.username);
        }
    }, [projectdata])


    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                className="modal"
            >
                <div className="modal-content" style={{ width: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="modal-header">
                        <h2>View Project Details</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <form style={{ marginTop: '3%', textAlign: 'left' }}>
                        <Typography variant="h6" style={{ fontWeight: 500, color: '#9854CB', fontSize: '16px', alignSelf: 'flex-start' }}>Project ID:&nbsp;{projectid} </Typography>
                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Project Name:&nbsp;{projectname} </Typography>


                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Project Summary</Typography>
                        <TextareaAutosize
                            aria-label="Summary"
                            placeholder="Summary"
                            minRows={2}
                            value={projectdesc}
                            // onChange={(e) => setSummary(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                            disabled
                        />

                        <Typography variant="h6" style={{ fontWeight: 500, fontSize: '16px', alignSelf: 'flex-start' }}>Project Manager</Typography>
                        <TextField value={projectmanager} disabled fullWidth />

                        <Typography variant="h6" style={{ fontWeight: 500, fontSize: '16px', alignSelf: 'flex-start' }}>Project Members</Typography>
                        <Paper
                            elevation={3}
                            className="scrollable-list"
                            style={{
                                maxHeight: '150px', // Adjust the height as needed
                                overflowY: 'auto',
                            }}
                        >

                            {/* <List>
                                {assignedUsernames.map((username, index) => (
                                    <ListItem key={index} style={{ width: '800px' }}>
                                        <ListItemText primary={username} />
                                    </ListItem>
                                ))}
                            </List> */}
                            <List>
                                {assignedUsernames.map((user, index) => (
                                    <ListItem key={index} style={{ width: '800px' }}>
                                        <ListItemText primary={`${user.username} ${user.role}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </form>

                </div>

            </Modal>

        </>
    )
}

export default ViewProject
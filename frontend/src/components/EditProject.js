import { Button, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Modal, Paper, Select, TextField, TextareaAutosize, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getUserDataofProject, updateProject } from '../api/projectApi'
import '../styles/Modal.css'

const EditProject = ({ isEditOpen, onEditClose, onSubmit, projecteditdata }) => {
    console.log('Edit Project Data', projecteditdata)
    const [projectid, setProjectid] = useState('')
    const [projectname, setProjectname] = useState('')
    const [description, setDescription] = useState('')
    const [errorFlag, setErrorFlag] = useState(false)
    const [userlist, setUserList] = useState([]);
    const [projectmanager, setProjectmanager] = useState([])
    const [assignedUsernames, setAssignedUsernames] = useState([]);

    useEffect(() => {
        if (isEditOpen && projecteditdata) {
            setProjectid(projecteditdata._id)
            setProjectname(projecteditdata.name)
            setDescription(projecteditdata.description)
            setProjectmanager(projecteditdata.projectManager)
            setUserList(projecteditdata.assignedUsers)

            async function fetchAssignedUsernames() {
                try {
                    const response = await getUserDataofProject({ projectid: projecteditdata._id });

                    if (response.status === 200) {
                        const usersWithRoles = response.data.users.map(user => ({
                            id: user._id,
                            username: user.username,
                            role: user.role
                        }));

                        console.log('Users with Roles:', usersWithRoles);
                        setAssignedUsernames(usersWithRoles);
                    }
                } catch (error) {
                    console.error('Error fetching assigned user data:', error);
                }
            }

            fetchAssignedUsernames();
        }




    }, [isEditOpen, projecteditdata]);

    const handleFormSubmit = async () => {

        const updateprojectdata = await updateProject(projectid, projectname, description, projectmanager)
        console.log('updateproject', updateprojectdata)

    }


    return (
        <>
            <Modal
                open={isEditOpen}
                onClose={onEditClose}
                className="modal"
            >
                <div className="modal-content" style={{ width: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="modal-header">
                        <h2>Edit Project</h2>
                        <button className="close-button" onClick={onEditClose}>
                            X
                        </button>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Project Name"
                            value={projectname}
                            onChange={(e) => setProjectname(e.target.value)}
                            fullWidth
                            required

                        />
                        <TextareaAutosize
                            aria-label="Description"
                            placeholder="Description"
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                        />
                        <TextField
                            label="Project Manager"
                            value={projectmanager.username}
                            onChange={(e) => setProjectmanager(e.target.value)}
                            fullWidth
                            required
                            disabled

                        />
                        <Typography variant="h6" style={{ fontWeight: 500, fontSize: '16px', alignSelf: 'flex-start' }}>Project Members</Typography>

                        <Paper
                            elevation={3}
                            className="scrollable-list"
                            style={{
                                maxHeight: '150px',
                                overflowY: 'auto',
                                width: '800px'
                            }}>

                            <List style={{ width: 'auto' }}>
                                {assignedUsernames.map((user, index) => (
                                    <ListItem key={index} >
                                        <ListItemText primary={`${user.username} ${user.role}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>

                        <Button
                            variant="contained"
                            type="submit"
                            className="add-modal-button"
                            style={{
                                background: '#9854CB', borderRadius: '15px',
                                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                width: '200px', height: 'auto', fontWeight: 500
                            }}
                        >

                            EDIT&nbsp;<i className="las la-save"></i>

                        </Button>

                    </form>

                </div>


            </Modal>

        </>
    )
}

export default EditProject
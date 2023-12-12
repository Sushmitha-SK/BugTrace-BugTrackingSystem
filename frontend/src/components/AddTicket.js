import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Modal.css';
import { FormControl, InputLabel, MenuItem, Modal, Select, TextareaAutosize, Grid, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getAllProjects } from '../api/projectApi';
import { projectListData } from '../redux/store/slice/projectSlice';
import { getAllUsers } from '../api/userApi';
import { getAllUserDetails } from '../redux/store/slice/userSlice';
import { createBugTicket } from '../api/bugticketApi';
import { bugticketList } from '../redux/store/slice/bugSlice';

const AddTicket = ({ isOpen, onClose, onSubmit, onAddProjectSuccess }) => {
    const [project, setProject] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [reporter, setReporter] = useState('');
    const [assignee, setAssignee] = useState('');
    const [projectlist, setProjectList] = useState([]);
    const [userlist, setUserList] = useState([]);


    const dispatch = useDispatch()

    const getProjects = async () => {
        const projectData = await getAllProjects()
        setProjectList(projectData.data.projects)
        dispatch(projectListData(projectData))
    }


    const getUserData = async () => {
        const userdata = await getAllUsers()
        setUserList(userdata.data.users)
        dispatch(getAllUserDetails(userdata))
    }

    useEffect(() => {
        getProjects()
        getUserData()
    }, [])


    const handleFormSubmit = async () => {
        const createTicket = await createBugTicket(summary, description, project, priority, status, assignee)
        console.log('Create Ticket', createTicket)
        dispatch(bugticketList(createTicket))
        toast.success('Bug Ticket created successfully');
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Modal
                open={isOpen}
                onClose={onClose}
                className="modal"
            >
                <div className="modal-content" style={{ width: '850px' }}>
                    <div className="modal-header">
                        <h2>Add Bug Ticket</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <form onSubmit={handleFormSubmit} style={{ marginTop: '3%' }}>
                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Project</InputLabel>
                            <Select
                                value={project}
                                onChange={(e) => setProject(e.target.value)}>

                                {/* <MenuItem value="0">None</MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="Project Manager">Project Manager</MenuItem>
                                    <MenuItem value="Developer">Developer</MenuItem>
                                    <MenuItem value="Tester">Tester</MenuItem> */}
                                {projectlist.map((item, i) => {
                                    return (
                                        <MenuItem value={item._id}>{item.name}</MenuItem>
                                    )
                                })}


                            </Select>
                        </FormControl>

                        <TextareaAutosize
                            aria-label="Summary"
                            placeholder="Summary"
                            minRows={2}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                        />

                        <TextareaAutosize
                            aria-label="Description"
                            placeholder="Description"
                            minRows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                        />


                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>
                                    <InputLabel className="form-control-label">Status</InputLabel>
                                    <Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}>
                                        <MenuItem value="New">New</MenuItem>
                                        <MenuItem value="Open">Open</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                        <MenuItem value="Resolved">Resolved</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>
                                    <InputLabel className="form-control-label">Priority</InputLabel>
                                    <Select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}>
                                        <MenuItem value="Critical">Critical</MenuItem>
                                        <MenuItem value="High">High</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="Low">Low</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>
                                    <InputLabel className="form-control-label">Assignee</InputLabel>
                                    <Select
                                        value={assignee}
                                        onChange={(e) => setAssignee(e.target.value)}>
                                        {userlist.map((user, index) => {
                                            return (
                                                <MenuItem value={user._id}>{user.username}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>
                                    <InputLabel className="form-control-label">Reporter</InputLabel>
                                    <Select
                                        value={reporter}
                                        onChange={(e) => setReporter(e.target.value)}>
                                        {userlist.map((user_reporter, index) => {
                                            return (
                                                <MenuItem value={user_reporter._id}>{user_reporter.username}</MenuItem>
                                            )
                                        })}

                                    </Select>
                                </FormControl>
                            </Grid>


                        </Grid>

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

                            SAVE&nbsp;<i className="las la-save"></i>

                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default AddTicket;

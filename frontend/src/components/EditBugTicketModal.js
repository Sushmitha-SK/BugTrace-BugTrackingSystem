import { Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TextareaAutosize, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getAllUsers, getUserByID } from '../api/userApi';
import { updateBugTicket } from '../api/bugticketApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

const EditBugTicketModal = ({ isEditOpen, onEditClose, editticket }) => {
    console.log('Edit Ticket', editticket)

    const dispatch = useDispatch()

    const [bugid, setBugid] = useState('')
    const [project, setProject] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [reporter, setReporter] = useState('');
    const [assignee, setAssignee] = useState('');
    const [projectlist, setProjectList] = useState([]);
    const [userlist, setUserList] = useState([]);

    const [usernames, setUsernames] = useState(''); // State to store usernames by user ID

    const getUserData = async () => {
        const userdata = await getAllUsers()
        setUserList(userdata.data.users)
    }



    useEffect(() => {
        if (isEditOpen && editticket) {
            setBugid(editticket._id)
            setProject(editticket.project.name);
            setSummary(editticket.title);
            setDescription(editticket.description);
            setStatus(editticket.status);
            setPriority(editticket.priority);
            setReporter(editticket.createdBy.username);
            setAssignee(editticket.assignedTo)

            // You may need to set assignee based on the editticket as well
        }

        getUserData()
    }, [isEditOpen, editticket]);

    const handleFormSubmit = async () => {

        const updatedata = await updateBugTicket(bugid, status, priority, assignee)
        console.log('Update Data', updatedata)
        toast.success('Bug Ticket Updated Successfully');


    }

    if (!editticket) {
        return null; // Don't render the modal if ticket details are not available
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
                open={isEditOpen}
                onClose={onEditClose}
                className="modal"
            >
                <div className="modal-content" style={{ width: '850px' }}>
                    <div className="modal-header">
                        <h2>Edit Bug Ticket</h2>
                        <button className="close-button" onClick={onEditClose}>
                            X
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} style={{ marginTop: '3%', textAlign: 'left' }}>
                        <Typography variant="h6" style={{ fontWeight: 500, color: '#9854CB', fontSize: '16px', alignSelf: 'flex-start' }}>Bug ID:&nbsp;{editticket._id} </Typography>
                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Project Name:&nbsp;{editticket.project.name} </Typography>


                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Summary</Typography>

                        <TextareaAutosize
                            aria-label="Summary"
                            placeholder="Summary"
                            minRows={2}
                            value={editticket.title}
                            onChange={(e) => setSummary(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                            disabled
                        />
                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Description</Typography>

                        <TextareaAutosize
                            aria-label="Description"
                            placeholder="Description"
                            minRows={6}
                            value={editticket.description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                            disabled
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
                                        <MenuItem value="Reopen">Reopen</MenuItem>
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
                                        {userlist.map((user_assignee, index) => (
                                            <MenuItem key={index} value={user_assignee._id}>
                                                {user_assignee.username}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>
                                    <InputLabel className="form-control-label">Reporter</InputLabel>

                                    <Select
                                        disabled
                                        value={reporter} // This value will reflect the default value from the state
                                        onChange={(e) => setReporter(e.target.value)}>
                                        {userlist.map((user_reporter, index) => {
                                            return (
                                                <MenuItem value={user_reporter.username} >
                                                    {user_reporter.username}
                                                </MenuItem>

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
                </div >
            </Modal >

        </>
    )
}

export default EditBugTicketModal
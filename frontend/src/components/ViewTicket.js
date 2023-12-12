import { Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TextField, TextareaAutosize, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getAllUsers, getUserByID } from '../api/userApi';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { createBugComment } from '../api/bugticketApi';

const ViewTicket = ({ isOpen, onClose, ticket }) => {
    console.log('Ticket', ticket)

    const [bugticketID, setBugticketID] = useState('')
    const [project, setProject] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [reporter, setReporter] = useState('');
    const [assignee, setAssignee] = useState('');
    const [projectlist, setProjectList] = useState([]);
    const [userlist, setUserList] = useState([]);
    const [createdOn, setCreatedOn] = useState('');
    const [lastUpdatedOn, setLastUpdatedOn] = useState('');
    const [lastUpdatedBy, setLastUpdatedBy] = useState('');
    const [commentsData, setCommentsData] = useState([])
    const [IsOpen, setIsOpen] = useState(false)
    const [usernames, setUsernames] = useState(''); // State to store usernames by user ID

    const [comment, setComment] = useState(''); // State to store the comment text
    const [isCommentFormOpen, setIsCommentFormOpen] = useState(false); // State to manage comment form visibility



    const getUserData = async () => {
        const userdata = await getAllUsers()
        setUserList(userdata.data.users)
    }

    useEffect(() => {
        if (ticket) {
            setIsOpen(true); // Open the modal when ticket data is available
        }
    }, [ticket]);


    useEffect(() => {
        if (isOpen && ticket) {
            setBugticketID(ticket._id)
            setProject(ticket.project.name);
            setSummary(ticket.title);
            setDescription(ticket.description);
            setStatus(ticket.status);
            setPriority(ticket.priority);
            setReporter(ticket.createdBy.username);
            setAssignee(ticket.assignedTo)
            setCreatedOn(ticket.createdAt)
            setLastUpdatedOn(ticket.lastUpdatedAt)
            setLastUpdatedBy(ticket.lastUpdatedBy.username)
            setCommentsData(ticket.comments)

            // You may need to set assignee based on the editticket as well
        }

        getUserData()
    }, [isOpen, ticket]);

    const handleFormSubmit = () => {

    }

    if (!ticket) {
        return null; // Don't render the modal if ticket details are not available
    }

    const handleCommentSubmit = async () => {
        // Handle comment submission here
        console.log('Comment submitted:', comment);

        const addcomment = await createBugComment(bugticketID, comment)
        console.log('Comment Submit', addcomment)

        // Clear the comment input and close the comment form
        setComment('');
        setIsCommentFormOpen(false);
    };

    //Format Date Time
    const formatDateTime = (dateString) => {
        const formattedDate = new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
        return formattedDate;
    };


    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                className="modal"
            >
                <div className="modal-content" style={{ width: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="modal-header">
                        <h2>View Bug Ticket</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>

                    <form style={{ marginTop: '3%', textAlign: 'left' }}>
                        <Typography variant="h6" style={{ fontWeight: 500, color: '#9854CB', fontSize: '16px', alignSelf: 'flex-start' }}>Bug ID:&nbsp;{ticket._id} </Typography>
                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Project Name:&nbsp;{ticket.project.name} </Typography>


                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Summary</Typography>

                        <TextareaAutosize
                            aria-label="Summary"
                            placeholder="Summary"
                            minRows={1}
                            value={ticket.title}
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
                            minRows={3}
                            value={ticket.description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                            disabled
                        />


                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>
                                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Status&nbsp;</p>

                                    <div style={{
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '16px',
                                        padding: '4px 10px',
                                        marginTop: '2%',
                                        display: 'inline-block',
                                        width: '50px'

                                    }}>
                                        <Typography style={{
                                            fontSize: '14px',
                                            // color: getStatusColor(status),
                                            fontWeight: 400
                                        }}>{ticket.status}</Typography>
                                    </div>

                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>

                                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Priority&nbsp;</p>

                                    <div style={{
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '16px',
                                        padding: '4px 10px',
                                        marginTop: '2%',
                                        display: 'inline-block',
                                        width: '80px'

                                    }}>
                                        <Typography style={{
                                            fontSize: '14px',
                                            // color: getStatusColor(status),
                                            fontWeight: 400
                                        }}>{ticket.priority}</Typography>
                                    </div>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Assignee</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{assignee}</Typography>
                                    </div>



                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Last Updated By</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{lastUpdatedBy} at {formatDateTime(lastUpdatedOn)}</Typography>
                                    </div>




                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Reporter</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{reporter}</Typography>


                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <DateRangeIcon style={{ marginRight: '10px' }} />
                                        <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Created On</Typography>
                                        <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{formatDateTime(createdOn)}</Typography>
                                    </div>

                                </FormControl>
                            </Grid>






                        </Grid>

                        <Typography variant="h6" style={{ fontWeight: 500, color: '#000000', fontSize: '16px', alignSelf: 'flex-start' }}>Comments</Typography>

                        <ul style={{ fontWeight: 400, color: '#000000', fontSize: '12px', alignSelf: 'flex-start' }}>
                            {commentsData.length === 0 ? (
                                <li>No Comments</li>
                            ) : (
                                commentsData.map((comment, index) => (
                                    <li key={index}>
                                        {comment.createdBy.username} on {formatDateTime(comment.createdAt)}: {comment.text}
                                    </li>
                                ))
                            )}

                            {/* {commentsData.map((comment, index) => (
                                <li key={index}>
                                    {comment.createdBy.username} on {comment.createdAt}: {comment.text}
                                </li>
                            ))} */}
                        </ul>


                        <Button
                            variant="contained"
                            type="submit"
                            className="add-modal-button"
                            style={{
                                background: '#9854CB', borderRadius: '15px',
                                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                width: '200px', height: 'auto', fontWeight: 500
                            }}
                            onClick={() => setIsCommentFormOpen(true)}
                        >

                            Add Comment&nbsp;<i className="las la-comment"></i>

                        </Button>

                        {/* Comment Form */}
                        {isCommentFormOpen && (
                            <div>
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontWeight: 500,
                                        color: '#000000',
                                        fontSize: '16px',
                                        alignSelf: 'flex-start',
                                        marginTop: '20px', // Adjust the spacing
                                    }}
                                >
                                    Add Comment
                                </Typography>
                                <TextareaAutosize
                                    aria-label="Comment"
                                    placeholder="Type your comment here"
                                    minRows={2}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    fullWidth
                                    required
                                    className="text-area custom-text-area"
                                    style={{ width: '700px' }}


                                />
                                <Button
                                    variant="contained"
                                    onClick={handleCommentSubmit}
                                    className="add-modal-button"
                                    style={{
                                        background: '#9854CB',
                                        borderRadius: '15px',
                                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                        width: '200px',
                                        height: 'auto',
                                        fontWeight: 500,
                                        marginTop: '20px',
                                        marginLeft: 'auto', // Center horizontally
                                        marginRight: 'auto', // Center horizontally
                                        display: 'block', // Ensure the button takes the full width

                                    }}
                                    disabled={!comment}
                                >
                                    Submit Comment
                                </Button>
                            </div>
                        )}

                    </form>


                </div>

            </Modal >

        </>
    )
}

export default ViewTicket
import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Modal.css'
import { Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, TextareaAutosize, Typography } from '@mui/material';
import { addProjectDetails } from '../api/projectApi'
import { getAllUsers } from '../api/userApi';

const AddProjectModal = ({ isOpen, onClose, onSubmit, onAddProjectSuccess }) => {

    const [projectname, setProjectname] = useState('')
    const [description, setDescription] = useState('')
    const [errorFlag, setErrorFlag] = useState(false)
    const [userlist, setUserList] = useState([]);
    const [projectmanager, setProjectmanager] = useState('')



    const getUserData = async () => {
        const userdata = await getAllUsers()
        const allUsers = userdata.data.users;
        const projectManagers = allUsers.filter(user => user.role === 'Project Manager');
        setUserList(projectManagers);


    }


    const handleFormSubmit = async () => {
        const createproject = await addProjectDetails(projectname, description, projectmanager)
        console.log('Frontend-createproject', createproject)
        toast.success('Project added successfully');
    }

    useEffect(() => {
        getUserData()
    }, [])

    console.log('userlist', userlist)



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
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Add Project</h2>
                        <button className="close-button" onClick={onClose}>
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
                        {!projectname.trim() && errorFlag && (
                            <Typography sx={{
                                color: "red",
                                fontFamily: "Nunito",
                                textAlign: "left",
                                fontSize: "12px",
                                marginTop: "2px"
                            }}>
                                Project name required
                            </Typography>
                        )}
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
                        {!description.trim() && errorFlag && (
                            <Typography sx={{
                                color: "red",
                                fontFamily: "Nunito",
                                textAlign: "left",
                                fontSize: "12px",
                                marginTop: "2px"
                            }}>
                                Project description required
                            </Typography>
                        )}

                        <FormControl fullWidth >
                            <InputLabel className="form-control-label">Project Manager</InputLabel>
                            <Select
                                value={projectmanager}
                                onChange={(e) => setProjectmanager(e.target.value)}>
                                {userlist.map((item, i) => (
                                    <MenuItem value={item._id}>{item.username}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
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


            </Modal >

        </>
    )
}

export default AddProjectModal
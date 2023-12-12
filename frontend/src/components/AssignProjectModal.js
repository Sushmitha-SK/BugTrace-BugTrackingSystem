import React, { useEffect, useState } from 'react'
import '../styles/Modal.css'
import { Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, TextareaAutosize, Typography } from '@mui/material';
import { assignProjectMember, getAllProjects } from '../api/projectApi';
import { getAllUsers } from '../api/userApi';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';



const AssignProjectModal = ({ isAssignModalOpen, onAssignModalClose, onAssignModalSubmit, onAssignProjectSuccess, currentUserId }) => {
    const [project, setProject] = useState('')
    const [projectrole, setProjectrole] = useState('')
    const [projectlist, setProjectList] = useState([]);
    const [userlist, setUserList] = useState([]);

    const currentUserRole = useSelector((state) => state.login.data.role)

    const getProjects = async () => {
        const projectData = await getAllProjects()
        setProjectList(projectData.data.projects)
        console.log('PM PROJECTS', projectlist)
    }


    const getUserData = async () => {
        const userdata = await getAllUsers()
        setUserList(userdata.data.users)
        console.log('User List', userlist)
    }

    useEffect(() => {
        getProjects()
        getUserData()
    }, [])

    // const filteredProjectList = projectlist.filter((project) => project.projectManager._id === currentUserId);
    const filteredProjectList = currentUserRole === 'Admin' ? projectlist : projectlist.filter((project) => project.projectManager._id === currentUserId);


    const handleFormSubmit = async () => {
        const assignProject = await assignProjectMember(project, projectrole)
        console.log('Assign Project', assignProject)
        toast.success('Project assigned successfully');
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
                open={isAssignModalOpen}
                onClose={onAssignModalClose}
                className="modal"
            >
                <div className="modal-content" style={{ width: '800px' }}>
                    <div className="modal-header">
                        <h2>Assign Project</h2>
                        <button className="close-button" onClick={onAssignModalClose}>
                            X
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Project</InputLabel>
                            {/* <Select
                                value={project}
                                onChange={(e) => setProject(e.target.value)}>
                                {userlist.map((item, i) => (
                                    <MenuItem value={item._id}>{item.username}</MenuItem>
                                ))}

                            </Select> */}
                            <Select
                                style={{ textAlign: 'left' }}
                                value={project}
                                onChange={(e) => setProject(e.target.value)}>
                                {filteredProjectList.map((item, i) => (
                                    <MenuItem value={item._id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Project Role</InputLabel>
                            <Select
                                style={{ textAlign: 'left' }}
                                value={projectrole}
                                onChange={(e) => setProjectrole(e.target.value)}>
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

            </Modal>

        </>
    )
}

export default AssignProjectModal

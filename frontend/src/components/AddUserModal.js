import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { getAllProjects } from '../api/projectApi';
import { useDispatch } from 'react-redux';
import { projectListData } from '../redux/store/slice/projectSlice';
import { addUser } from '../api/userApi';
import '../styles/Modal.css'

const AddUserModal = ({ isOpen, onClose, onSubmit, onAddUserSuccess }) => {

    const [name, setName] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [project, setProject] = useState('')
    const [projectlist, setProjectlist] = useState([])
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getProjects = async () => {
        const projectData = await getAllProjects()
        console.log('projectData', projectData.data.projects)
        setProjectlist(projectData.data.projects)
        dispatch(projectListData(projectData))
    }

    useEffect(() => {
        getProjects()

    }, [])


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const handleFormSubmit = async () => {
        const createUser = await addUser(fullname, username, email, password, role, project)
        console.log('Frontend-CreateUser', createUser)
        toast.success('User created successfully');
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
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Add User</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Full Name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            fullWidth
                            required

                        />
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required

                        />
                        <FormControl
                            variant="outlined"
                            sx={{ width: "100%" }}
                        >
                            <InputLabel
                                sx={{
                                    color: "#9CA3AF",
                                    fontWeight: 500,
                                    fontSize: "18px",
                                }}
                                htmlFor="outlined-adornment-password"
                                required
                            >
                                Password
                            </InputLabel>
                            <OutlinedInput

                                sx={{
                                    fontFamily: "Poppins",
                                    fontWeight: 500,
                                    fontSize: "18px",
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Role</InputLabel>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}>
                                <MenuItem value="0">None</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Project Manager">Project Manager</MenuItem>
                                <MenuItem value="Developer">Developer</MenuItem>
                                <MenuItem value="Tester">Tester</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Project</InputLabel>
                            <Select
                                value={project}
                                onChange={(e) => setProject(e.target.value)}>
                                {projectlist.map((item, i) => {

                                    return (
                                        <MenuItem value={item._id}>{item.name}</MenuItem>
                                    )
                                })}
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

export default AddUserModal
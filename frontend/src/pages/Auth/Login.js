import React, { useEffect, useState } from 'react'
import Styles from '../../styles/Login.css'
import { Box, FormControl, Grid, InputLabel, OutlinedInput, Paper, Typography, Checkbox, Button } from '@mui/material';
import SignInImage from '../../assets/signin.png'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { loginUser } from '../../api/userApi';
import { loginSuccess } from '../../redux/store/slice/userAuthSlice';


function Item(props) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                p: 0,
                m: 1,
                width: 450,
                textAlign: "center",
                ...sx,
            }}
            {...other}
        />
    );
}

const Login = () => {
    const [emailid, setEmailid] = useState("");
    const [password, setPassword] = useState("");

    const [authToken, setAuthToken] = useState('')
    const [userInfo, setUserInfo] = useState([])

    const [errorFlag, setErrorFlag] = useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        const storedPassword = localStorage.getItem('password');

        if (storedEmail && storedPassword) {
            setEmailid(storedEmail);
            setPassword(storedPassword);
            setRememberMe(true);
        }
    }, []);

    const removeStoredCredentials = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
    };



    const handleSignin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(emailid, password);

            if (data && data.data) {
                setAuthToken(data.data.token);
                localStorage.setItem('token', data.data.token);
                dispatch(loginSuccess(data));
                setUserInfo(data);

                if (rememberMe) {
                    localStorage.setItem('email', emailid);
                    localStorage.setItem('password', password);
                } else {
                    removeStoredCredentials();
                }

                if (data.data.role === 'Admin') {
                    toast.success('Logged in successfully');
                    navigate('/admindashboard');
                } else if (data.data.role === 'Project Manager') {
                    toast.success('Logged in successfully');
                    navigate('/projectmanagerdashboard');
                } else if (data.data.role === 'Developer') {
                    toast.success('Logged in successfully');
                    navigate('/developerdashboard');
                } else if (data.data.role === 'Tester') {
                    toast.success('Logged in successfully');
                    navigate('/testerdashboard');
                } else {
                    toast.error('Invalid Credentials');
                }
            } else {
                toast.error('Invalid Credentials');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error('An error occurred while signing in. Please try again later.');
        }
    };


    return (
        <>
            <div className="container-area">
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
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    component={Paper}
                    square
                    className="container-info"
                    sx={{
                        justify: "space-between",
                        alignItems: "100%",
                        overflowY: "auto",
                    }}
                >
                    <div className="brand-and-toggler d-flex align-items-center justify-content-between" style={{ marginTop: '5%' }}>
                        <a className="navbar-brand d-flex align-items-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <span className="brand-shape d-inline-block">&nbsp;</span>
                            <span className="brand-text fw-7"
                                style={{
                                    marginLeft: "10%",
                                    // fontFamily: 'Nunito Sans',
                                    fontFamily: 'Roboto',
                                    fontSize: '24px',
                                    fontWeight: 800,
                                    color: '#9854CB'
                                }}>BugTrace</span>
                        </a>

                    </div>
                    <div
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >

                            <Box
                                component="form"
                                noValidate
                                sx={{
                                    marginTop: "6%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Item sx={{ marginTop: "7%" }}>
                                    <Typography
                                        component="h1"
                                        className="heading"
                                        fontWeight={600}
                                        fontSize={34}
                                        // fontFamily={"Nunito Sans"}
                                        fontFamily={"Roboto"}
                                    >
                                        Sign In
                                    </Typography>
                                </Item>

                                <Item>
                                    <FormControl variant="outlined" sx={{
                                        width: "100%",
                                        "& label.Mui-focused": {
                                            color: "#9854CB"
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#9854CB"
                                            }
                                        }
                                    }} >
                                        <InputLabel
                                            sx={{ color: "#9CA3AF" }}
                                            required
                                            htmlFor="outlined-adornment-email"
                                        >
                                            Email
                                        </InputLabel>

                                        <OutlinedInput
                                            id="email"
                                            name="email"
                                            autoComplete="off"
                                            sx={Styles.text}
                                            value={emailid}
                                            onChange={(e) => setEmailid(e.target.value)}
                                            label="Email"
                                            type="email"
                                        />
                                    </FormControl>
                                    {!emailid.trim() && errorFlag && (
                                        <Typography sx={{
                                            color: "red",
                                            fontFamily: "Roboto",
                                            textAlign: "left",
                                            fontSize: "12px",
                                            marginTop: "2px"
                                        }}>
                                            Email required
                                        </Typography>
                                    )}
                                    {!emailRegex.test(emailid.trim()) &&
                                        errorFlag &&
                                        emailid.trim() && (
                                            <Typography sx={{
                                                color: "red",
                                                fontFamily: "Roboto",
                                                textAlign: "left",
                                                fontSize: "12px",
                                                marginTop: "2px"
                                            }}>
                                                Invalid Email
                                            </Typography>
                                        )}


                                </Item>

                                <Item>
                                    <FormControl
                                        variant="outlined"
                                        sx={{
                                            width: "100%", marginTop: "6%",
                                            "& label.Mui-focused": {
                                                color: "#9854CB"
                                            },
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#9854CB"
                                                }
                                            }
                                        }}
                                    >
                                        <InputLabel
                                            sx={{
                                                color: "#9CA3AF",
                                            }}
                                            htmlFor="outlined-adornment-password"
                                            required
                                        >
                                            Password
                                        </InputLabel>
                                        <OutlinedInput

                                            sx={{
                                                fontFamily: "Roboto",
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
                                    {!password.trim() && errorFlag && (
                                        <Typography sx={{
                                            color: "red",
                                            fontFamily: "Roboto",
                                            textAlign: "left",
                                            fontSize: "12px",
                                            marginTop: "2px"
                                        }}>
                                            Password required
                                        </Typography>
                                    )}

                                </Item>

                                <Item>
                                    <Grid container marginTop={1}>
                                        <Grid item xs>
                                            <Box
                                                textAlign="left"
                                                className="checkboxStyle"
                                                width={251}
                                                display="flex"
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 500,
                                                        fontSize: "16px",
                                                        color: "#333",
                                                        fontFamily: 'Roboto'

                                                    }}
                                                >
                                                    Remember Me
                                                </Typography>
                                                {/* <Checkbox defaultChecked sx={{ marginTop: "-3%" }} /> */}
                                                <Checkbox
                                                    checked={rememberMe}
                                                    onChange={(e) => {
                                                        setRememberMe(e.target.checked);
                                                        if (!e.target.checked) {
                                                            removeStoredCredentials();
                                                        }
                                                    }}
                                                    sx={{
                                                        marginTop: "-3%",
                                                        color: '#9854CB', // Default checkbox color
                                                        '&.Mui-checked': {
                                                            color: '#9854CB', // Color for checked state
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid item>
                                            <Box>
                                                <Link
                                                    to="/login"
                                                    style={{ textDecoration: 'none', fontFamily: 'Roboto', color: '#333' }}
                                                >
                                                    Forgot password?
                                                </Link>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Item>

                                <Item sx={{ marginTop: "2%" }}>

                                    <Button
                                        onClick={handleSignin}
                                        type="submit"
                                        sx={{
                                            borderRadius: 3, marginTop: 3,
                                            backgroundColor: '#9854CB',
                                            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;',
                                            width: '150px',
                                            '&:hover': {
                                                backgroundColor: '#784FB1',
                                            },
                                        }}
                                        variant="contained">
                                        Sign In
                                    </Button>
                                </Item>


                            </Box>

                        </div>
                    </div>
                </Grid >

                <Grid
                    className="container-main"
                    item
                    xs={false}
                    sm={6}
                    md={6}
                    sx={{
                        backgroundColor: "#E5E5E5",
                        height: '100vh',
                        overflow: 'hidden',

                    }}
                >
                    <img
                        src={SignInImage}
                        alt="SignUpImage"

                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />

                </Grid>
            </div >

        </>
    )
}

export default Login


import axios from "axios";
import baseURL from '../api/endPoint'


//Login
export async function loginUser(email, password) {

    const url = `https://bugtrace.onrender.com/api/auth/login`
    console.log(url)
    try {
        const response = await axios.post(url, JSON.stringify({
            "username": email,
            "password": password
        }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        if (response.status === 200) {
            // return response.data;
            return response;
        }

    } catch (error) {
        console.log('Error', error)
    }
}

//Register 
export async function addUser(fullname, username, email, password, role, projectid) {

    const URL = 'https://bugtrace.onrender.com/api/auth/register'
    try {
        const response = await axios.post(URL,
            {
                "fullname": fullname,
                "username": username,
                "email": email,
                "password": password,
                "role": role,
                "projectId": projectid
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (response.status === 200) {
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}


//Get all Users

export async function getAllUsers() {
    const URL = 'https://bugtrace.onrender.com/api/auth/users'
    try {
        const response = await axios.get(URL,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }
        );

        if (response.status === 200) {
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}


//Get user details by ID

export async function getUserByID(id) {
    const URL = `https://bugtrace.onrender.com/api/auth/users/${id}`
    try {
        const response = await axios.get(URL,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }
        );
        if (response.status === 200) {
            console.log('Backend', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}

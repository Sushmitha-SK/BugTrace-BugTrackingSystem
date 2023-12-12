import axios from "axios";
import api from '../api/endPoint'

//Create New Project

export async function addProjectDetails(projectname, description, projectmanager) {

    const URL = 'https://bugtrace.onrender.com/api/projects/create-project/'
    try {
        const response = await axios.post(URL,
            {
                "name": projectname,
                "description": description,
                "projectManager": projectmanager,

            },
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

//Get all projects
export async function getAllProjects() {
    // const URL = `${api}/api/projects/get-all-projects`
    const URL = `https://bugtrace.onrender.com/api/projects/get-all-projects`

    try {
        const response = await axios.get(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        if (response.status == 200) {
            console.log('API Response', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}

//Get all users under Project Manager
export async function getusersunderPM(pmid) {
    const URL = `https://bugtrace.onrender.com/api/projects/get-users-under-manager/${pmid}`
    try {
        const response = await axios.get(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        if (response.status == 200) {
            console.log('API Response', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}

//Assign project member
export async function assignProjectMember(project, member) {
    console.log('ID', project, member)

    const URL = `https://bugtrace.onrender.com/api/projects/assign-project/${project}/${member}`; // Use template literals to insert values

    try {
        const response = await axios.post(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });

        if (response.status === 200) {
            console.log('Response assign', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}

//Get userinfo of project
export async function getUserDataofProject({ projectid }) {
    // const URL = `${api}/api/projects/get-all-projects`
    const URL = `https://bugtrace.onrender.com/api/projects/project/${projectid}/assignedUsers`

    try {
        const response = await axios.get(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        if (response.status == 200) {
            console.log('API Response', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}

//Update Project
export async function updateProject({ projectid, projectname, description, projectmanager }) {
    const URL = `https://bugtrace.onrender.com/api/projects/update-project/${projectid}`
    try {
        const response = await axios.post(URL,
            {
                "name": projectname,
                "description": description,
                "projectManager": projectmanager,

            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }
        );
        if (response.status == 200) {
            console.log('API Response', response)
            return response;
        }
    } catch (error) {
        console.log('Error', error);
    }


}
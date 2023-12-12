import axios from "axios";

//Get all bug tickets
export async function getAllBugTickets() {
    // const URL = `http://localhost:5000/api/bugs/bug-tickets/`
    const URL = `https://bugtrace.onrender.com/api/bugs/bug-tickets/`
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

//Get bug ticket by ID
export async function getBugTicketByID(id) {
    const URL = `https://bugtrace.onrender.com/api/bugs/bug-tickets/${id}`

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

//Create new ticket
export async function createBugTicket(summary, description, project, priority, status, assignee) {

    const url = `https://bugtrace.onrender.com/api/bugs/bug-tickets`
    console.log(url)
    try {
        const response = await axios.post(url, JSON.stringify({
            "title": summary,
            "description": description,
            "projectId": project,
            "priority": priority,
            "status": status,
            "assignedTo": assignee,
        }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            });

        if (response.status === 200) {
            // return response.data;
            console.log('API Ticket response', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error)
    }
}


//Get All Bugs Logged By Tester 
export async function getBugTicketsTester(id) {
    const URL = `https://bugtrace.onrender.com/api/bugs/bug-tickets/logged-by/${id}`

    try {
        const response = await axios.get(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        if (response.status == 200) {
            console.log('API Tester Response', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}

//Get All Bugs Assigned to Developer 
export async function getBugTicketsAssignedToDeveloper(id) {
    const URL = `https://bugtrace.onrender.com/api/bugs/bug-tickets/assigned-to/${id}`


    try {
        const response = await axios.get(URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        if (response.status == 200) {
            console.log('API Developer Response', response)
            return response;
        }

    } catch (error) {
        console.log('Error', error);
    }
}

//Add Comment
export async function createBugComment(bugid, text) {
    const url = `https://bugtrace.onrender.com/api/bugs/bug-tickets/${bugid}/comments`
    console.log(url);

    try {
        const response = await axios.post(url, JSON.stringify({
            "text": text
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        if (response.status === 200) {
            // return response.data;
            return response;
        }

    } catch (error) {
        console.log('Error', error)
    }
}

//Update Bug ticket
export async function updateBugTicket(bugid, status, priority, assignee) {
    const url = `https://bugtrace.onrender.com/api/bugs/bug-tickets/${bugid}/updateStatus`
    try {
        const response = await axios.put(url,
            JSON.stringify({
                "status": status,
                "priority": priority,
                "assignedTo": assignee
            }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        if (response.status === 200) {
            // return response.data;
            return response;
        }

    } catch (error) {
        console.log(error)
    }
}
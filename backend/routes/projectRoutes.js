const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Create a new project
router.post('/create-project', projectController.createProject);

// Get all projects
router.get('/get-all-projects', projectController.getAllProjects);

// Get users under a specific project manager
router.get('/get-users-under-manager/:projectManagerId', projectController.getUsersUnderProjectManager);

// Assign a project to a user
router.post('/assign-project/:projectId/:userId', projectController.assignProjectToUser);

// Get usernames of assignedUsers for a specific project (new route)
router.get('/project/:projectId/assignedUsers', projectController.getUsersAssignedToProject);

// Update a project
router.put('/update-project/:projectId', projectController.updateProject);



module.exports = router;

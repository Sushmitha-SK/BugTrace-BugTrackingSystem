const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bugController = require('../controllers/bugController');

// Create a new bug ticket (protected route)
router.post('/bug-tickets', authMiddleware, bugController.createBugTicket);

// Get all bug tickets
router.get('/bug-tickets', bugController.getAllBugTickets);

// Get a single bug ticket by ID
router.get('/bug-tickets/:id', bugController.getBugTicketById);

// Update the status of a bug ticket
router.put('/bug-tickets/:id/updateStatus', authMiddleware, bugController.updateBugTicket);

// Get All Bugs Logged By Tester 
router.get('/bug-tickets/logged-by/:testerId', bugController.getAllBugsLoggedByTester);

// Get All Bugs Assigned to Developer
router.get('/bug-tickets/assigned-to/:developerId', bugController.getAllBugsAssignedToDeveloper);

// Get bugs by project
router.get('/bug-tickets/project/:projectId', bugController.getBugsByProject);

// // Get bug tickets by project manager
// router.get('/bug-tickets/project-manager/:managerId', authMiddleware, bugController.getBugsByProjectManager);

// Get bug tickets by project manager
router.get('/bug-tickets/project-manager/:managerId', authMiddleware, bugController.getBugsByProjectManager);


// Create a new comment on a bug ticket
router.post('/bug-tickets/:id/comments', authMiddleware, bugController.createComment);

//Bug Statistics
router.get('/project/:projectId/bug-statistics', bugController.getBugStatisticsByProject);

//Get Bug Statistics of each project
router.get('/bug-status-percentage/:projectId', bugController.getBugStatusPercentageByProject);

//Get Bug Statistics of All Projects
router.get('/bug-status-percentage-all-projects', bugController.getBugStatusPercentageAllProjects);


module.exports = router;

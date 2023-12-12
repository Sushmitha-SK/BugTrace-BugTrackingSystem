import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProjectManagerDashboard from './pages/ProjectManager/ProjectManagerDashboard';
import DeveloperDashboard from './pages/Developer/DeveloperDashboard';
import TesterDashboard from './pages/Tester/TesterDashboard';
import User from './pages/Admin/User';
import Project from './pages/Admin/Project';
import ProjectManager_Users from './pages/ProjectManager/ProjectManager_Users';
import BugTracker_Tester from './pages/Tester/BugTracker_Tester';
import Projects_Tester from './pages/Tester/Projects_Tester';
import Profile from './pages/Profile';
import ProjectManager_Projects from './pages/ProjectManager/ProjectManager_Projects';
import ProjectManager_BugTracker from './pages/ProjectManager/ProjectManager_BugTracker';
import BugTracker_Developer from './pages/Developer/BugTracker_Developer';
import Projects_Developer from './pages/Developer/Projects_Developer';
import BugTracker from './pages/Admin/BugTracker';



const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/projectmanagerdashboard" element={<ProjectManagerDashboard />} />
          <Route path="/projectmanager-projects" element={<ProjectManager_Projects />} />
          <Route path="/projectmanager-bugtickets" element={<ProjectManager_BugTracker />} />
          <Route path="/pm-users" element={<ProjectManager_Users />} />
          <Route path="/developerdashboard" element={<DeveloperDashboard />} />
          <Route path="/testerdashboard" element={<TesterDashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/bug-tickets" element={<BugTracker />} />
          <Route path="/bug-tickets-developer" element={<BugTracker_Developer />} />
          <Route path="/bug-tickets-tester" element={<BugTracker_Tester />} />
          <Route path="/projects-developer" element={<Projects_Developer />} />
          <Route path="/projects-tester" element={<Projects_Tester />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

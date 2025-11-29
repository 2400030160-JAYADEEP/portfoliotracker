// Local Storage Utility Functions

const STORAGE_KEYS = {
  USER: 'portfolioHub_user',
  PROJECTS: 'portfolioHub_projects',
  USERS: 'portfolioHub_users',
};

// User Management
export const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Users Database
export const getAllUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveAllUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user) => {
  const users = getAllUsers();
  users.push(user);
  saveAllUsers(users);
};

export const findUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Projects Management
export const getAllProjects = () => {
  const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return projects ? JSON.parse(projects) : [];
};

export const saveAllProjects = (projects) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const addProject = (project) => {
  const projects = getAllProjects();
  projects.push(project);
  saveAllProjects(projects);
  return project;
};

export const updateProject = (projectId, updatedData) => {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updatedData, updatedAt: new Date().toISOString() };
    saveAllProjects(projects);
    return projects[index];
  }
  return null;
};

export const deleteProject = (projectId) => {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  saveAllProjects(filtered);
};

export const getProjectById = (projectId) => {
  const projects = getAllProjects();
  return projects.find(p => p.id === projectId);
};

export const getProjectsByUserId = (userId) => {
  const projects = getAllProjects();
  return projects.filter(p => p.userId === userId);
};

// Initialize default admin user if no users exist
export const initializeDefaultUsers = () => {
  const users = getAllUsers();
  if (users.length === 0) {
    const defaultAdmin = {
      id: 'admin-001',
      email: 'admin@portfoliohub.com',
      password: 'Admin@123', // In production, this should be hashed
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    
    const defaultStudent = {
      id: 'student-001',
      email: 'student@example.com',
      password: 'Student@123',
      name: 'Demo Student',
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    
    saveAllUsers([defaultAdmin, defaultStudent]);
  }
};

// Generate unique ID
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

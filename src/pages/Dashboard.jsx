import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    LogOut,
    FolderOpen,
    User,
    Search,
    Filter,
    Grid,
    List,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    getAllProjects,
    getProjectsByUserId,
    deleteProject
} from '../utils/storage';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import Toast from '../components/Toast';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadProjects();
    }, [user, isAdmin]);

    useEffect(() => {
        filterProjects();
    }, [projects, searchQuery, filterStatus]);

    const loadProjects = () => {
        const allProjects = isAdmin ? getAllProjects() : getProjectsByUserId(user.id);
        setProjects(allProjects);
    };

    const filterProjects = () => {
        let filtered = [...projects];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(project => project.status === filterStatus);
        }

        setFilteredProjects(filtered);
    };

    const handleCreateProject = () => {
        setEditingProject(null);
        setShowModal(true);
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setShowModal(true);
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            deleteProject(projectId);
            loadProjects();
            setToast({ message: 'Project deleted successfully', type: 'success' });
        }
    };

    const handleModalClose = (saved) => {
        setShowModal(false);
        setEditingProject(null);
        if (saved) {
            loadProjects();
            setToast({
                message: editingProject ? 'Project updated successfully' : 'Project created successfully',
                type: 'success'
            });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const stats = {
        total: projects.length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        planned: projects.filter(p => p.status === 'planned').length,
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-left">
                            <div className="logo">
                                <FolderOpen size={32} />
                                <h1>PortfolioHub</h1>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="user-info">
                                <div className="user-avatar">
                                    <User size={20} />
                                </div>
                                <div className="user-details">
                                    <p className="user-name">{user.name}</p>
                                    <p className="user-role">{isAdmin ? 'Administrator' : 'Student'}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="btn btn-ghost btn-icon" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <div className="stat-icon stat-primary">
                                <FolderOpen size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Projects</p>
                                <p className="stat-value">{stats.total}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-warning">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">In Progress</p>
                                <p className="stat-value">{stats.inProgress}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-success">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Completed</p>
                                <p className="stat-value">{stats.completed}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-secondary">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Planned</p>
                                <p className="stat-value">{stats.planned}</p>
                            </div>
                        </div>
                    </div>

                    <div className="projects-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                {isAdmin ? 'All Projects' : 'My Projects'}
                            </h2>
                            <button onClick={handleCreateProject} className="btn btn-primary">
                                <Plus size={20} />
                                New Project
                            </button>
                        </div>

                        <div className="projects-controls">
                            <div className="search-box">
                                <Search className="search-icon" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="filter-controls">
                                <div className="filter-group">
                                    <Filter size={18} />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="planned">Planned</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                <div className="view-toggle">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                        title="Grid view"
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                        title="List view"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {filteredProjects.length === 0 ? (
                            <div className="empty-state">
                                <FolderOpen size={64} />
                                <h3>No projects found</h3>
                                <p>
                                    {searchQuery || filterStatus !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Get started by creating your first project'}
                                </p>
                                {!searchQuery && filterStatus === 'all' && (
                                    <button onClick={handleCreateProject} className="btn btn-primary">
                                        <Plus size={20} />
                                        Create Project
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className={`projects-grid ${viewMode}`}>
                                {filteredProjects.map(project => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onEdit={handleEditProject}
                                        onDelete={handleDeleteProject}
                                        isAdmin={isAdmin}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showModal && (
                <ProjectModal
                    project={editingProject}
                    onClose={handleModalClose}
                    userId={user.id}
                />
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;

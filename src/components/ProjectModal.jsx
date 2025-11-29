import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import {
    addProject,
    updateProject,
    generateId
} from '../utils/storage';
import {
    validateProjectTitle,
    validateProjectDescription,
    validateDate,
    validateUrl
} from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose, userId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'planned',
        startDate: '',
        endDate: '',
        technologies: [],
        projectUrl: '',
        milestones: [],
        feedback: '',
    });
    const [techInput, setTechInput] = useState('');
    const [milestoneInput, setMilestoneInput] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                status: project.status || 'planned',
                startDate: project.startDate || '',
                endDate: project.endDate || '',
                technologies: project.technologies || [],
                projectUrl: project.projectUrl || '',
                milestones: project.milestones || [],
                feedback: project.feedback || '',
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddTechnology = () => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, techInput.trim()]
            }));
            setTechInput('');
        }
    };

    const handleRemoveTechnology = (tech) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleAddMilestone = () => {
        if (milestoneInput.trim()) {
            setFormData(prev => ({
                ...prev,
                milestones: [
                    ...prev.milestones,
                    { id: generateId('milestone'), title: milestoneInput.trim(), completed: false }
                ]
            }));
            setMilestoneInput('');
        }
    };

    const handleToggleMilestone = (milestoneId) => {
        setFormData(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
            )
        }));
    };

    const handleRemoveMilestone = (milestoneId) => {
        setFormData(prev => ({
            ...prev,
            milestones: prev.milestones.filter(m => m.id !== milestoneId)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        const titleError = validateProjectTitle(formData.title);
        if (titleError) newErrors.title = titleError;

        const descError = validateProjectDescription(formData.description);
        if (descError) newErrors.description = descError;

        if (formData.startDate) {
            const startDateError = validateDate(formData.startDate);
            if (startDateError) newErrors.startDate = startDateError;
        }

        if (formData.endDate) {
            const endDateError = validateDate(formData.endDate);
            if (endDateError) newErrors.endDate = endDateError;

            if (formData.startDate && formData.endDate) {
                const start = new Date(formData.startDate);
                const end = new Date(formData.endDate);
                if (end < start) {
                    newErrors.endDate = 'End date must be after start date';
                }
            }
        }

        if (formData.projectUrl) {
            const urlError = validateUrl(formData.projectUrl);
            if (urlError) newErrors.projectUrl = urlError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            if (project) {
                // Update existing project
                updateProject(project.id, formData);
            } else {
                // Create new project
                const newProject = {
                    id: generateId('project'),
                    ...formData,
                    userId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                addProject(newProject);
            }

            onClose(true);
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal project-modal">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {project ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <button
                        onClick={() => onClose(false)}
                        className="btn btn-ghost btn-icon"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label required">
                            Project Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            placeholder="Enter project title"
                            disabled={loading}
                        />
                        {errors.title && (
                            <div className="form-error">{errors.title}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label required">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                            placeholder="Describe your project"
                            rows="4"
                            disabled={loading}
                        />
                        {errors.description && (
                            <div className="form-error">{errors.description}</div>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status" className="form-label required">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="planned">Planned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="projectUrl" className="form-label">
                                Project URL
                            </label>
                            <input
                                type="url"
                                id="projectUrl"
                                name="projectUrl"
                                value={formData.projectUrl}
                                onChange={handleChange}
                                className={`form-input ${errors.projectUrl ? 'error' : ''}`}
                                placeholder="https://example.com"
                                disabled={loading}
                            />
                            {errors.projectUrl && (
                                <div className="form-error">{errors.projectUrl}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate" className="form-label">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`form-input ${errors.startDate ? 'error' : ''}`}
                                disabled={loading}
                            />
                            {errors.startDate && (
                                <div className="form-error">{errors.startDate}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate" className="form-label">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`form-input ${errors.endDate ? 'error' : ''}`}
                                disabled={loading}
                            />
                            {errors.endDate && (
                                <div className="form-error">{errors.endDate}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Technologies</label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                                className="form-input"
                                placeholder="Add technology (e.g., React, Node.js)"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddTechnology}
                                className="btn btn-secondary"
                                disabled={loading || !techInput.trim()}
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                        {formData.technologies.length > 0 && (
                            <div className="tags-list">
                                {formData.technologies.map((tech, index) => (
                                    <div key={index} className="tag-item">
                                        <span>{tech}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTechnology(tech)}
                                            className="tag-remove"
                                            disabled={loading}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Milestones</label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                value={milestoneInput}
                                onChange={(e) => setMilestoneInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMilestone())}
                                className="form-input"
                                placeholder="Add milestone"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddMilestone}
                                className="btn btn-secondary"
                                disabled={loading || !milestoneInput.trim()}
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                        {formData.milestones.length > 0 && (
                            <div className="milestones-list">
                                {formData.milestones.map((milestone) => (
                                    <div key={milestone.id} className="milestone-item">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleMilestone(milestone.id)}
                                            className="milestone-checkbox"
                                            disabled={loading}
                                        >
                                            {milestone.completed ? (
                                                <CheckSquare size={18} className="checked" />
                                            ) : (
                                                <Square size={18} />
                                            )}
                                        </button>
                                        <span className={milestone.completed ? 'completed' : ''}>
                                            {milestone.title}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMilestone(milestone.id)}
                                            className="milestone-remove"
                                            disabled={loading}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="feedback" className="form-label">
                            Feedback / Notes
                        </label>
                        <textarea
                            id="feedback"
                            name="feedback"
                            value={formData.feedback}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Add feedback or notes about this project"
                            rows="3"
                            disabled={loading}
                        />
                    </div>
                </form>

                <div className="modal-footer">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                {project ? 'Update Project' : 'Create Project'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;

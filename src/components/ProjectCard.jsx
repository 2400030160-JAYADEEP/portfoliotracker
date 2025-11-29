import {
    Calendar,
    Edit2,
    Trash2,
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import './ProjectCard.css';

const ProjectCard = ({ project, onEdit, onDelete, isAdmin, viewMode = 'grid' }) => {
    const statusConfig = {
        planned: {
            label: 'Planned',
            icon: <AlertCircle size={14} />,
            className: 'badge-secondary'
        },
        'in-progress': {
            label: 'In Progress',
            icon: <Clock size={14} />,
            className: 'badge-warning'
        },
        completed: {
            label: 'Completed',
            icon: <CheckCircle2 size={14} />,
            className: 'badge-success'
        }
    };

    const status = statusConfig[project.status] || statusConfig.planned;

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateProgress = () => {
        if (!project.milestones || project.milestones.length === 0) return 0;
        const completed = project.milestones.filter(m => m.completed).length;
        return Math.round((completed / project.milestones.length) * 100);
    };

    const progress = calculateProgress();

    return (
        <div className={`project-card ${viewMode}`}>
            <div className="project-card-header">
                <div className="project-status">
                    <span className={`badge ${status.className}`}>
                        {status.icon}
                        {status.label}
                    </span>
                </div>
                <div className="project-actions">
                    <button
                        onClick={() => onEdit(project)}
                        className="btn-icon-sm"
                        title="Edit project"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(project.id)}
                        className="btn-icon-sm btn-danger-ghost"
                        title="Delete project"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="project-card-body">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                {project.technologies && project.technologies.length > 0 && (
                    <div className="project-technologies">
                        {project.technologies.map((tech, index) => (
                            <span key={index} className="tech-tag">{tech}</span>
                        ))}
                    </div>
                )}

                <div className="project-progress">
                    <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-value">{progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="project-meta">
                    <div className="meta-item">
                        <Calendar size={16} />
                        <span>Start: {formatDate(project.startDate)}</span>
                    </div>
                    <div className="meta-item">
                        <Calendar size={16} />
                        <span>End: {formatDate(project.endDate)}</span>
                    </div>
                </div>

                {project.milestones && project.milestones.length > 0 && (
                    <div className="project-milestones">
                        <p className="milestones-label">
                            Milestones: {project.milestones.filter(m => m.completed).length}/{project.milestones.length}
                        </p>
                    </div>
                )}

                {project.feedback && (
                    <div className="project-feedback">
                        <MessageSquare size={16} />
                        <span className="feedback-preview">{project.feedback}</span>
                    </div>
                )}
            </div>

            {project.projectUrl && (
                <div className="project-card-footer">
                    <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                    >
                        <ExternalLink size={16} />
                        View Project
                    </a>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;

import { Link } from 'react-router-dom';

import './ProjectCard.scss';

function ProjectCard({ record }) {
  return (
    <Link to={record.link} className="project-card" style={{ backgroundImage: record ? `url(${record.thumbURL})` : 'none' }}>
      <div className="project-card__details">
        <div className="project-card__name">{record.name}</div>
      </div>
    </Link>
  );
}
export default ProjectCard;

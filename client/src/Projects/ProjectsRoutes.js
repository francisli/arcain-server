import { Route, Routes } from 'react-router-dom';

import Project from './Project';
import ProjectsList from './ProjectsList';

function ProjectsRoutes() {
  return (
    <Routes>
      <Route path=":ProjectId" element={<Project />} />
      <Route path="" element={<ProjectsList />} />
    </Routes>
  );
}

export default ProjectsRoutes;

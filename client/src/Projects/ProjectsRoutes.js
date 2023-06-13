import { Route, Routes } from 'react-router-dom';

import ProjectsList from './ProjectsList';

function ProjectsRoutes() {
  return (
    <Routes>
      <Route path="" element={<ProjectsList />} />
    </Routes>
  );
}

export default ProjectsRoutes;

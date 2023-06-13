import { Routes, Route } from 'react-router-dom';

import AdminProject from './AdminProject';
import AdminProjectsList from './AdminProjectsList';
import ProjectForm from './ProjectForm';

function AdminProjectsRoutes() {
  return (
    <Routes>
      <Route path="new" element={<ProjectForm />} />
      <Route path=":ProjectId/edit" element={<ProjectForm />} />
      <Route path=":ProjectId" element={<AdminProject />} />
      <Route path="" element={<AdminProjectsList />} />
    </Routes>
  );
}

export default AdminProjectsRoutes;

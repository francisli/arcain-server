import { Routes, Route } from 'react-router-dom';

import AdminPage from './AdminPage';
import AdminPagesList from './AdminPagesList';
import PageForm from './PageForm';

function AdminPagesRoutes() {
  return (
    <Routes>
      <Route path="new" element={<PageForm />} />
      <Route path=":PageId/edit" element={<PageForm />} />
      <Route path=":PageId" element={<AdminPage />} />
      <Route path="" element={<AdminPagesList />} />
    </Routes>
  );
}

export default AdminPagesRoutes;

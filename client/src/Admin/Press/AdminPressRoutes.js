import { Routes, Route } from 'react-router-dom';

import AdminLinksList from './AdminLinksList';
import LinkForm from './LinkForm';

function AdminPressRoutes() {
  return (
    <Routes>
      <Route path="new" element={<LinkForm />} />
      <Route path=":LinkId" element={<LinkForm />} />
      <Route path="" element={<AdminLinksList />} />
    </Routes>
  );
}

export default AdminPressRoutes;

import { Routes, Route } from 'react-router-dom';

import AdminSidebar from './AdminSidebar';
import AdminUsersRoutes from './Users/AdminUsersRoutes';
import AdminProjectsRoutes from './Projects/AdminProjectsRoutes';
import AdminPagesRoutes from './Pages/AdminPagesRoutes';

function AdminRoutes() {
  return (
    <main className="users container">
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <AdminSidebar />
        </div>
        <div className="col-md-9 col-lg-10">
          <Routes>
            <Route path="pages/*" element={<AdminPagesRoutes />} />
            <Route path="projects/*" element={<AdminProjectsRoutes />} />
            <Route path="users/*" element={<AdminUsersRoutes />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default AdminRoutes;

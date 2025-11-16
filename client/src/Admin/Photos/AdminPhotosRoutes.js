import { Routes, Route } from 'react-router-dom';

import AdminPhoto from './AdminPhoto';
import AdminPhotosList from './AdminPhotosList';
import PhotoUploader from './PhotoUploader';

function AdminPhotosRoutes() {
  return (
    <Routes>
      <Route path="new" element={<PhotoUploader />} />
      <Route path=":PhotoId" element={<AdminPhoto />} />
      <Route path="" element={<AdminPhotosList />} />
    </Routes>
  );
}

export default AdminPhotosRoutes;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../Api';

import PhotoForm from './PhotoForm';

function AdminPhoto() {
  const navigate = useNavigate();
  const { PhotoId } = useParams();
  const [record, setRecord] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (PhotoId) {
      Api.photos.get(PhotoId).then((response) => {
        if (isCancelled) return;
        setRecord(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [PhotoId]);

  function onDeleted() {
    navigate('/admin/photos');
  }

  return (
    <>
      <h1 className="display-6">Photo</h1>
      <div className="row mb-5">
        <div className="row">
          <div className="col-4">
            <img className="img-fluid" src={record?.fileURL} alt={record?.desc} />
          </div>
          <div className="col-8">{record && <PhotoForm onDeleted={onDeleted} record={record} />}</div>
        </div>
      </div>
    </>
  );
}
export default AdminPhoto;

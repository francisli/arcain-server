import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';

function AdminPhotosList() {
  const staticContext = useStaticContext();
  const [records, setRecords] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.photos.index({ showAll: true }).then((response) => {
      if (isCancelled) return;
      setRecords(response.data);
    });
    return () => (isCancelled = true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Photos - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <>
        <h1 className="display-6">Manage Photos</h1>
        <div className="mb-5">
          <Link to="new" className="btn btn-outline-primary">
            Upload new Photo
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th className="w-40">Name</th>
                <th className="w-40">Link</th>
                <th className="w-5">Is visible?</th>
                <th className="w-15">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span className="draggable">&equiv;</span>
                  </td>
                  <td>{r.fileName}</td>
                  <td>{r.fileURL}</td>
                  <td>{r.isVisible && 'Visible'}</td>
                  <td>
                    <Link to={r.id}>Edit&nbsp;Photo</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    </>
  );
}
export default AdminPhotosList;

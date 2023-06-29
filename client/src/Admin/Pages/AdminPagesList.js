import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';

function AdminPagesList() {
  const staticContext = useStaticContext();
  const [records, setRecords] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.pages.index({ showAll: true }).then((response) => {
      if (isCancelled) return;
      setRecords(response.data);
    });
    return () => (isCancelled = true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Pages - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <>
        <h1 className="display-6">Manage Pages</h1>
        <div className="mb-5">
          <Link to="new" className="btn btn-outline-primary">
            Create new Page
          </Link>
        </div>
        <h2 className="display-6">Pages</h2>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th className="w-40">Title</th>
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
                  <td>{r.title}</td>
                  <td>{r.link}</td>
                  <td>{r.isVisible && 'Visible'}</td>
                  <td>
                    <Link to={r.id}>Edit&nbsp;Page</Link>
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
export default AdminPagesList;

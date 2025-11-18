import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';

function AdminLinksList() {
  const staticContext = useStaticContext();
  const [records, setRecords] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.links.index({ showAll: true }).then((response) => {
      if (isCancelled) return;
      setRecords(response.data);
    });
    return () => (isCancelled = true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Links - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <>
        <h1 className="display-6">Manage Links</h1>
        <div className="mb-5">
          <Link to="new" className="btn btn-outline-primary">
            Create new Link
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="w-35">Name</th>
                <th className="w-15">Date</th>
                <th className="w-35">Url</th>
                <th className="w-15">Is visible?</th>
                <th className="w-15">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.date}</td>
                  <td>{r.url}</td>
                  <td>{r.isVisible && 'Visible'}</td>
                  <td>
                    <Link to={r.id}>Edit&nbsp;Link</Link>
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

export default AdminLinksList;

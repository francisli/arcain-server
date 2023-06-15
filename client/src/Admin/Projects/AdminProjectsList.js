import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';

function AdminProjectsList() {
  const staticContext = useStaticContext();
  const [records, setRecords] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.projects.index({ showAll: true }).then((response) => {
      if (isCancelled) return;
      setRecords(response.data);
    });
    return () => (isCancelled = true);
  }, []);

  async function reorder(newRecords) {
    setRecords(newRecords);
    await Api.projects.reorder(newRecords.map((p, i) => ({ id: p.id, position: i })));
  }

  return (
    <>
      <Helmet>
        <title>Manage Projects - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <>
        <h1 className="display-6">Manage Projects</h1>
        <div className="mb-5">
          <Link to="new" className="btn btn-outline-primary">
            Create new Project
          </Link>
        </div>
        <h2 className="display-6">Projects</h2>
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
            <ReactSortable tag="tbody" list={records ?? []} setList={reorder}>
              {records?.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span className="draggable">&equiv;</span>
                  </td>
                  <td>{r.name}</td>
                  <td>{r.link}</td>
                  <td>{r.isVisible && 'Visible'}</td>
                  <td>
                    <Link to={r.id}>Edit&nbsp;Project</Link>
                  </td>
                </tr>
              ))}
            </ReactSortable>
          </table>
        </div>
      </>
    </>
  );
}
export default AdminProjectsList;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import FormGroup from '../../Components/FormGroup';
import Api from '../../Api';

function AdminPage() {
  const { PageId } = useParams();
  const [record, setRecord] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (PageId) {
      Api.pages.get(PageId).then((response) => {
        if (isCancelled) return;
        setRecord(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [PageId]);

  return (
    <>
      <h1 className="display-6">Page</h1>
      <div className="row mb-5">
        <div className="col-md-6">
          {record && (
            <>
              <FormGroup label="Title" name="title" record={record} plaintext={true} />
              <FormGroup label="Link" name="link" record={record} plaintext={true} />
              <FormGroup label="Body" name="body" type="textarea" record={record} plaintext={true} />
              <FormGroup label="Is visible?" name="isVisible" type="checkbox" record={record} disabled={true} />
            </>
          )}
          <div className="mb-3">
            <Link to="edit" className="btn btn-primary">
              Edit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminPage;

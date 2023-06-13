import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FormGroup from '../../Components/FormGroup';
import Api from '../../Api';

function AdminProject() {
  const { ProjectId } = useParams();
  const [record, setRecord] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (ProjectId) {
      Api.projects.get(ProjectId).then((response) => {
        if (isCancelled) return;
        setRecord(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [ProjectId]);

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h1 className="display-6">Project</h1>
          {record && (
            <>
              <FormGroup label="Name" name="name" record={record} plaintext={true} />
              <FormGroup label="Link" name="link" record={record} plaintext={true} />
              <FormGroup label="Description" name="desc" type="textarea" record={record} plaintext={true} />
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
export default AdminProject;

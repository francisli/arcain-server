import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import FormGroup from '../../Components/FormGroup';
import Api from '../../Api';

import PhotoForm from './PhotoForm';

function AdminProject() {
  const { ProjectId } = useParams();
  const [record, setRecord] = useState();
  const [photos, setPhotos] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (ProjectId) {
      Api.projects
        .get(ProjectId)
        .then((response) => {
          if (isCancelled) return;
          setRecord(response.data);
          return Api.photos.index({ ProjectId, showAll: true });
        })
        .then((response) => {
          if (isCancelled) return;
          setPhotos(response.data);
        });
    }
    return () => (isCancelled = true);
  }, [ProjectId]);

  return (
    <>
      <h1 className="display-6">Project</h1>
      <div className="row mb-5">
        <div className="col-md-6">
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
      <h2 className="display-6">Photos</h2>
      <div className="mb-5">
        <Link to="upload" className="btn btn-outline-primary">
          Upload new Photos
        </Link>
      </div>
      {photos?.map((p) => (
        <div key={p.id} className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <img className="img-fluid" src={p.thumbURL} alt={p.desc} />
              </div>
              <div className="col-8">
                <PhotoForm record={p} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default AdminProject;

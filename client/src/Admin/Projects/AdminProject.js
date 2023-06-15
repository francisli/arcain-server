import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';

import FormGroup from '../../Components/FormGroup';
import Api from '../../Api';

import PhotoForm from './PhotoForm';

function AdminProject() {
  const { ProjectId } = useParams();
  const [record, setRecord] = useState();
  const [photos, setPhotos] = useState();
  const [isReordering, setReordering] = useState(false);
  const [reorderedPhotos, setReorderedPhotos] = useState();

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

  function startReordering() {
    setReorderedPhotos([...photos]);
    setReordering(true);
  }

  function cancelReordering() {
    setReorderedPhotos();
    setReordering(false);
  }

  async function finishReordering() {
    setPhotos(reorderedPhotos);
    setReordering(false);
    await Api.photos.reorder(reorderedPhotos.map((p, i) => ({ id: p.id, position: i })));
  }

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
      {!isReordering && (
        <div className="mb-3">
          <Link to="upload" className="btn btn-outline-primary me-2">
            Upload new Photos
          </Link>
          <button onClick={startReordering} type="button" className="btn btn-outline-secondary">
            Re-order Photos
          </button>
        </div>
      )}
      {isReordering && (
        <div className="mb-3">
          <button onClick={finishReordering} type="button" className="btn btn-primary me-2">
            Done
          </button>
          <button onClick={cancelReordering} type="button" className="btn btn-outline-secondary">
            Cancel
          </button>
        </div>
      )}
      {!isReordering &&
        photos?.map((p) => (
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
      {isReordering && (
        <table className="table table-hover">
          <thead>
            <tr>
              <th></th>
              <th className="w-25"></th>
              <th className="w-50">Name</th>
              <th className="w-25">Is visible?</th>
            </tr>
          </thead>
          <ReactSortable tag="tbody" list={reorderedPhotos ?? []} setList={setReorderedPhotos}>
            {reorderedPhotos?.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="draggable">&equiv;</span>
                </td>
                <td>
                  <img className="img-fluid" src={r.thumbURL} alt={r.desc} />
                </td>
                <td>{r.fileName}</td>
                <td>{r.isVisible && 'Visible'}</td>
              </tr>
            ))}
          </ReactSortable>
        </table>
      )}
    </>
  );
}
export default AdminProject;

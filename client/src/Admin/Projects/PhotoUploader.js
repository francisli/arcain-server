import { useParams } from 'react-router-dom';

import Api from '../../Api';
import DropzoneUploader from '../../Components/DropzoneUploader';

import PhotoForm from './PhotoForm';

function PhotoUploader() {
  const { ProjectId } = useParams();

  async function onUploaded(status) {
    try {
      const data = {
        ProjectId,
        fileName: status.file.name,
        file: status.signedId,
        desc: '',
      };
      let response;
      response = await Api.photos.create(data);
      status.PhotoId = response.data.id;
      status.status = 'submitted';
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DropzoneUploader id="photo-uploader" className="photo-uploader" multiple={true} onUploaded={onUploaded}>
      {({ statuses, onRemove, rejectedFiles }) => {
        if (statuses.length === 0) {
          return (
            <div className="card">
              <div className="card-body">
                <div className="card-text text-center">Drag-and-drop photo files here, or click here to browse and select files.</div>
              </div>
            </div>
          );
        } else {
          return statuses
            .sort((a, b) => a.file.name.localeCompare(b.file.name))
            .map((status) => (
              <div key={status.id} className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-4">
                      <img src={status.file.preview} className="img-fluid" alt={status.file.name} />
                    </div>
                    <div className="col-8">
                      {status.status !== 'submitted' && <span>Please wait...</span>}
                      {status.status === 'submitted' && <PhotoForm id={status.PhotoId} onDeleted={() => onRemove(status)} />}
                    </div>
                  </div>
                </div>
              </div>
            ));
        }
      }}
    </DropzoneUploader>
  );
}

export default PhotoUploader;

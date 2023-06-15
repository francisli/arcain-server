import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { Helmet } from 'react-helmet-async';

import { useStaticContext } from '../StaticContext';
import Api from '../Api';
import './Project.scss';

function Project() {
  const staticContext = useStaticContext();
  const { ProjectId } = useParams();
  const [record, setRecord] = useState();
  const [photos, setPhotos] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.projects.get(ProjectId).then((response) => {
      if (isCancelled) return;
      setRecord(response.data);
    });
    Api.photos.index({ ProjectId }).then((response) => {
      if (isCancelled) return;
      setPhotos(response.data);
    });
    return () => (isCancelled = true);
  }, [ProjectId]);

  return (
    <>
      <Helmet>
        <title>
          {record?.name ?? ''} - {staticContext?.env?.REACT_APP_SITE_TITLE}
        </title>
      </Helmet>
      <main className="project">
        <div className="project__lightbox mb-5">
          <div className="container">
            <div className="project__carousel">
              <Carousel pause="hover">
                {photos?.map((p) => (
                  <Carousel.Item>
                    <div className="project__photo" style={{ backgroundImage: `url(${p.fileURL})` }}></div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 mb-5">
              <h1 className="display-6">{record?.name}</h1>
              <p>{record?.desc}</p>
            </div>
            <div className="col-md-4 offset-md-1">
              <div className="row">
                {photos?.map((p) => (
                  <div className="col-6 mb-4">
                    <div className="project__photo" style={{ backgroundImage: `url(${p.thumbURL})` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default Project;

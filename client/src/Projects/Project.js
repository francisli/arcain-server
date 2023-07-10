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
  const [record, setRecord] = useState(staticContext?.record?.link === ProjectId ? staticContext?.record : undefined);
  const [photos, setPhotos] = useState(staticContext?.record?.link === ProjectId ? staticContext?.photos : undefined);
  const [photoIndex, setPhotoIndex] = useState(0);

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

  function onSelect(newPhotoIndex) {
    setPhotoIndex(newPhotoIndex);
    if (window.scrollY !== 0) {
      window.scrollTo({ top: 0, smooth: true });
    }
  }

  const baseURL = staticContext?.env?.BASE_URL ?? `${window.location.protocol}//${window.location.host}`;
  const imageURL = `${baseURL}${photos?.[0]?.fileURL}`;
  return (
    <>
      <Helmet>
        <title>
          {record?.name ?? ''} - {staticContext?.env?.REACT_APP_SITE_TITLE}
        </title>
        <meta property="og:image" content={imageURL} />
        <meta property="og:title" content={record?.name ?? ''} />
        <meta property="og:description" content={record?.desc ?? ''} />
      </Helmet>
      <main className="project">
        <div className="project__lightbox mb-5">
          <div className="container">
            <div className="project__carousel">
              <Carousel activeIndex={photoIndex} onSelect={setPhotoIndex} interval={5000} pause="hover">
                {photos?.map((p) => (
                  <Carousel.Item key={p.id}>
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
                {photos?.map((p, i) => (
                  <div key={p.id} className="col-6 mb-4">
                    <div onClick={() => onSelect(i)} className="project__thumbnail" style={{ backgroundImage: `url(${p.thumbURL})` }}></div>
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

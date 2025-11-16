import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Api from './Api';
import { useStaticContext } from './StaticContext';
import './Home.scss';

function Home() {
  const staticContext = useStaticContext();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.photos
      .random()
      .then((response) => {
        if (isCancelled) return;
        if (response.data?.length) {
          setPhoto(response.data[0]);
        }
      })
      .catch(() => {});
    return () => (isCancelled = true);
  }, []);

  const baseURL = staticContext?.env?.BASE_URL ?? `${window.location.protocol}//${window.location.host}`;

  return (
    <>
      <Helmet>
        <title>Home - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
        <meta name="description" content="Arcain Design is a full service design firm specializing in all things residential." />
        <link rel="canonical" href={`${baseURL}/`} />
      </Helmet>
      <div className="home" style={{ backgroundImage: photo ? `url(${photo.fileURL})` : 'none' }}></div>
    </>
  );
}

export default Home;

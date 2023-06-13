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
      .index()
      .then((response) => {
        if (isCancelled) return;
        if (response.data?.length) {
          setPhoto(response.data[0]);
        }
      })
      .catch(() => {});
    return () => (isCancelled = true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Home - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <div className="home" style={{ backgroundImage: photo ? `url(${photo.fileURL})` : 'none' }}></div>
    </>
  );
}

export default Home;

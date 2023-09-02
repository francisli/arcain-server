import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { useStaticContext } from './StaticContext';

import './FrontDoor.scss';

function FrontDoor() {
  const staticContext = useStaticContext();
  const [isShowing, setShowing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowing(true);
    }, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Home - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
        <meta name="description" content="Arcain Design is a full service design firm specializing in all things residential." />
      </Helmet>
      <div className={classNames('frontdoor', { 'frontdoor--showing': isShowing })}>
        <div className="frontdoor__content">
          <img className="frontdoor__logo" src="/logo.svg" alt="Arcain" />
          <Link to="/home" className="frontdoor__button btn btn-lg btn-outline-primary">
            Enter
          </Link>
        </div>
      </div>
    </>
  );
}
export default FrontDoor;

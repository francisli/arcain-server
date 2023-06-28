import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import './FrontDoor.scss';

function FrontDoor() {
  const [isShowing, setShowing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowing(true);
    }, 0);
  }, []);

  return (
    <div className={classNames('frontdoor', { 'frontdoor--showing': isShowing })}>
      <div className="frontdoor__content">
        <img className="frontdoor__logo" src="/logo.svg" alt="Arcain" />
        <Link to="/home" className="frontdoor__button btn btn-lg btn-outline-primary">
          Enter
        </Link>
      </div>
    </div>
  );
}
export default FrontDoor;

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';

import './Header.scss';
import Api from './Api';
import { useAuthContext } from './AuthContext';

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();
  const [isNavbarShowing, setNavbarShowing] = useState(false);

  useEffect(
    function () {
      Api.users.me().then((response) => {
        if (response.status === 204) {
          setUser(null);
        } else {
          setUser(response.data);
        }
      });
    },
    [setUser]
  );

  async function onLogout(event) {
    event.preventDefault();
    await Api.auth.logout();
    setUser(null);
    hideNavbar();
    navigate('/');
  }

  function toggleNavbar() {
    setNavbarShowing(!isNavbarShowing);
  }

  function hideNavbar() {
    setNavbarShowing(false);
  }

  return (
    <nav className="header navbar navbar-expand-md fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/home" onClick={hideNavbar}>
          <img src="/logo.svg" alt="Arcain" />
        </Link>
        <button onClick={toggleNavbar} className="navbar-toggler" type="button" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={classNames('collapse navbar-collapse', { show: isNavbarShowing })}>
          <ul className="navbar-nav flex-grow-1 mb-2 mb-md-0">
            <div className="flex-grow-1 d-flex flex-column flex-md-row align-items-stretch align-items-md-start justify-content-end">
              <li className="nav-item text-center py-2 py-md-0">
                <Link className="header__link" to="/portfolio" onClick={hideNavbar}>
                  Portfolio
                </Link>
              </li>
              <li className="nav-item text-center py-2 py-md-0">
                <Link className="header__link" to="/about" onClick={hideNavbar}>
                  About
                </Link>
              </li>
              <li className="nav-item text-center py-2 py-md-0">
                <Link className={classNames('header__link', { 'me-md-0': !user })} to="/contact" onClick={hideNavbar}>
                  Contact
                </Link>
              </li>
              {user && (
                <>
                  {user.isAdmin && (
                    <li className="nav-item text-center py-2 py-md-0">
                      <Link className="header__link" to="/admin" onClick={hideNavbar}>
                        Admin
                      </Link>
                    </li>
                  )}
                  <li className="nav-item text-center py-2 py-md-0">
                    <a className="header__link me-md-0" href="/logout" onClick={onLogout}>
                      Log out
                    </a>
                  </li>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;

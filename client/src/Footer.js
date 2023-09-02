import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer>
      <div className="container text-center py-5">
        Follow us:
        <div className="fs-2 mb-3">
          <a className="me-2" href="https://www.linkedin.com/company/arcain-design/" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faLinkedin} title="Arcain Design on LinkedIn" />
          </a>
          <a href="https://instagram.com/arcaindesign/" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faInstagram} title="Arcain Design (@arcaindesign) on Instagram" />
          </a>
        </div>
        <small>
          Copyright &copy; {new Date().getFullYear()} Arcain Design LLC - <Link to="/admin">Admin</Link>
        </small>
      </div>
    </footer>
  );
}
export default Footer;

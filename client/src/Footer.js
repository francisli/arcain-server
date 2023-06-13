import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="container text-center py-5">
        <small>
          Copyright &copy; {new Date().getFullYear()} Jacob L. Green - <Link to="/admin">Admin</Link>
        </small>
      </div>
    </footer>
  );
}
export default Footer;

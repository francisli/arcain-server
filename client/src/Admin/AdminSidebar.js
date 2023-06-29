import { NavLink } from 'react-router-dom';

function AdminSidebar() {
  return (
    <ul className="list-group">
      <NavLink to="projects" className="list-group-item">
        Projects
      </NavLink>
      <NavLink to="pages" className="list-group-item">
        Pages
      </NavLink>
      <NavLink to="users" className="list-group-item">
        Users
      </NavLink>
    </ul>
  );
}
export default AdminSidebar;

import { Routes, Route } from 'react-router-dom';

import './App.scss';

import { AuthContextProvider } from './AuthContext';
import { useStaticContext } from './StaticContext';
import AppRedirects from './AppRedirects';
import Header from './Header';
import Footer from './Footer';
import FrontDoor from './FrontDoor';
import Home from './Home';
import Contact from './Contact';
import Page from './Page';
import Login from './Login';
import AdminRoutes from './Admin/AdminRoutes';
import InvitesRoutes from './Invites/InvitesRoutes';
import PasswordsRoutes from './Passwords/PasswordsRoutes';
import Register from './Register';
import UsersRoutes from './Users/UsersRoutes';
import ProjectsRoutes from './Projects/ProjectsRoutes';

function App() {
  const { staticContext } = useStaticContext();

  return (
    <AuthContextProvider>
      <Routes>
        <Route
          path="*"
          element={
            <AppRedirects>
              <Routes>
                <Route
                  path="/*"
                  element={
                    <>
                      <Header />
                      <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/portfolio/*" element={<ProjectsRoutes />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/passwords/*" element={<PasswordsRoutes />} />
                        <Route path="/invites/*" element={<InvitesRoutes />} />
                        {staticContext?.env?.REACT_APP_FEATURE_REGISTRATION === 'true' && <Route path="/register" element={<Register />} />}
                        <Route path="/account/*" element={<UsersRoutes />} />
                        <Route path="/admin/*" element={<AdminRoutes />} />
                        <Route path="/:link" element={<Page />} />
                      </Routes>
                      <Footer />
                    </>
                  }
                />
                <Route path="/" element={<FrontDoor />} />
              </Routes>
            </AppRedirects>
          }
        />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;

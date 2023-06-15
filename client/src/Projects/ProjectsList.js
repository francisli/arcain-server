import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useStaticContext } from '../StaticContext';
import Api from '../Api';
import ProjectCard from './ProjectCard';

function ProjectsList() {
  const staticContext = useStaticContext();
  const [projects, setProjects] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.projects.index().then((response) => {
      if (isCancelled) return;
      setProjects(response.data);
    });
    return () => (isCancelled = true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Portfolio - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="projects container">
        <h1 className="display-6 text-center mt-3 mb-4">Portfolio</h1>
        <div className="row">
          {projects?.map((p) => (
            <div key={p.id} className="col-md-6">
              <ProjectCard record={p} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
export default ProjectsList;

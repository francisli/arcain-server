import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet-async';

import Api from './Api';
import { useStaticContext } from './StaticContext';

function Press() {
  const staticContext = useStaticContext();
  const [records, setRecords] = useState(staticContext?.records);

  useEffect(() => {
    let isCancelled = false;
    Api.links.index().then((response) => {
      if (isCancelled) return;
      setRecords(response.data);
    });
    return () => (isCancelled = true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Press - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="page container">
        <h1 className="display-6 text-center mt-3 mb-4">Press</h1>
        <div className="row justify-content-center">
          <div className="col col-lg-6">
            {records?.map((r) => (
              <div key={r.id} className="link mb-4">
                <div className="link__name">
                  {DateTime.fromISO(r.date).toLocaleString(DateTime.DATE_FULL)} - {r.name}
                </div>
                <div className="link__link">
                  <a href={r.url}>{r.url}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
export default Press;

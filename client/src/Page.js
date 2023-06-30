import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Api from './Api';
import { useStaticContext } from './StaticContext';

function Page() {
  const staticContext = useStaticContext();
  const { link } = useParams();
  const [record, setRecord] = useState(staticContext?.record?.link === link ? staticContext.record : undefined);

  useEffect(() => {
    let isCancelled = false;
    if (link && !record) {
      Api.pages.get(link).then((response) => {
        if (isCancelled) return;
        setRecord(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [link, record]);

  return (
    <>
      <Helmet>
        <title>
          {record?.title ?? ''} - {staticContext?.env?.REACT_APP_SITE_TITLE}
        </title>
      </Helmet>
      <main className="page container">
        <h1 className="display-6 text-center mt-3 mb-4">{record?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: record?.body }} />
      </main>
    </>
  );
}
export default Page;

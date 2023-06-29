import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Api from './Api';
import FormGroup from './Components/FormGroup';
import { useStaticContext } from './StaticContext';

function Contact() {
  const staticContext = useStaticContext();
  const [record, setRecord] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.pages.get('contact').then((response) => {
      if (isCancelled) return;
      setRecord(response.data);
    });
    return () => (isCancelled = true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="page container">
        <h1 className="display-6 text-center mt-3 mb-4">Contact</h1>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-6">
            {record && <p>{record.body}</p>}
            <form>
              <fieldset>
                <div className="row gx-3">
                  <div className="col-sm">
                    <FormGroup label="First Name" id="firstName" type="text" />
                  </div>
                  <div className="col-sm">
                    <FormGroup label="Last Name" id="lastName" type="text" />
                  </div>
                </div>
                <FormGroup label="Email" id="email" type="text" />
                <FormGroup label="Please provide a brief description of your project" id="desc" type="textarea" />
                <FormGroup label="Property address" id="address" type="text" />
                <FormGroup label="Budget range, if known" id="budget" type="text" />
                <FormGroup label="Desired timeframe" id="timeframe" type="text" />
                <div className="mb-3">
                  <button type="submit" className="btn btn-lg btn-outline-primary">
                    Submit
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
export default Contact;

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

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    desc: '',
    address: '',
    budget: '',
    timeframe: '',
  });

  function onChange(event) {
    const newData = { ...data };
    newData[event.target.name] = event.target.value;
    setData(newData);
  }

  async function onSubmit(event) {
    event.preventDefault();
    console.log(data);
  }

  return (
    <>
      <Helmet>
        <title>Contact - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="page container">
        <h1 className="display-6 text-center mt-3 mb-4">Contact</h1>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-6">
            {record && <p className="mb-3" dangerouslySetInnerHTML={{ __html: record.body }} />}
            <form onSubmit={onSubmit} autoComplete="off">
              <fieldset>
                <div className="row gx-3">
                  <div className="col-sm">
                    <FormGroup label="First Name" name="firstName" type="text" record={data} onChange={onChange} />
                  </div>
                  <div className="col-sm">
                    <FormGroup label="Last Name" name="lastName" type="text" record={data} onChange={onChange} />
                  </div>
                </div>
                <FormGroup label="Email" name="email" type="email" record={data} onChange={onChange} />
                <FormGroup
                  label="Please provide a brief description of your project"
                  name="desc"
                  type="textarea"
                  record={data}
                  onChange={onChange}
                />
                <FormGroup label="Property address" name="address" type="text" record={data} onChange={onChange} />
                <FormGroup label="Budget range, if known" name="budget" type="text" record={data} onChange={onChange} />
                <FormGroup label="Desired timeframe" name="timeframe" type="text" record={data} onChange={onChange} />
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

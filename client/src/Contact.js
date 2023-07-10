import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Api from './Api';
import FormGroup from './Components/FormGroup';
import { useStaticContext } from './StaticContext';

const defaultValue = {
  firstName: '',
  lastName: '',
  email: '',
  desc: '',
  address: '',
  budget: '',
  timeframe: '',
};

function Contact() {
  const staticContext = useStaticContext();
  const [record, setRecord] = useState(staticContext?.record?.link === 'contact' ? staticContext.record : undefined);

  useEffect(() => {
    let isCancelled = false;
    if (!record) {
      Api.pages.get('contact').then((response) => {
        if (isCancelled) return;
        setRecord(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [record]);

  const [data, setData] = useState(defaultValue);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  function isValid() {
    return (
      data.firstName.trim() !== '' &&
      data.lastName.trim() !== '' &&
      data.email.trim() !== '' &&
      data.desc.trim() !== '' &&
      data.address.trim() !== '' &&
      data.budget.trim() !== '' &&
      data.timeframe.trim() !== ''
    );
  }

  function onBlur(event) {
    const { parentElement } = event.target;
    if (!parentElement.className.includes('was-validated')) {
      parentElement.className = `${parentElement.className ?? ''} was-validated`.trim();
    }
  }

  function onChange(event) {
    const newData = { ...data };
    newData[event.target.name] = event.target.value;
    setData(newData);
  }

  async function onSubmit(event) {
    event.preventDefault();
    const { target } = event;
    if (!target.className.includes('was-validated')) {
      target.className = `${target.className ?? ''} was-validated`.trim();
    }
    if (isValid()) {
      setLoading(true);
      try {
        await Api.contact.create(data);
        setSubmitted(true);
      } finally {
        setLoading(false);
      }
    }
  }

  function reset() {
    setSubmitted(false);
    setData(defaultValue);
  }

  return (
    <>
      <Helmet>
        <title>Contact - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="page container">
        <h1 className="display-6 text-center mt-3 mb-4">Contact</h1>
        <div className="row">
          <div className="col-lg-3 mb-4 text-center">
            <div className="card d-inline-block">
              <div className="card-body text-start">
                <span className="display-7">Jacob L. Green</span>
                <br />
                <small>
                  Principal/Owner
                  <br />
                  <a href="mailto:jacob@arcaindesign.com">jacob@arcaindesign.com</a>
                  <br />
                  <a href="tel:4158183848">(415) 818-3848</a>
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            {!isSubmitted && (
              <>
                {record && <p className="mb-3" dangerouslySetInnerHTML={{ __html: record.body }} />}
                <form onSubmit={onSubmit} autoComplete="off">
                  <fieldset>
                    <div className="row gx-3">
                      <div className="col-sm">
                        <FormGroup
                          label="First Name"
                          name="firstName"
                          type="text"
                          record={data}
                          onChange={onChange}
                          onBlur={onBlur}
                          required={true}
                        />
                      </div>
                      <div className="col-sm">
                        <FormGroup
                          label="Last Name"
                          name="lastName"
                          type="text"
                          record={data}
                          onChange={onChange}
                          onBlur={onBlur}
                          required={true}
                        />
                      </div>
                    </div>
                    <FormGroup label="Email" name="email" type="email" record={data} onChange={onChange} onBlur={onBlur} required={true} />
                    <FormGroup
                      label="Please provide a brief description of your project"
                      name="desc"
                      type="textarea"
                      record={data}
                      onChange={onChange}
                      onBlur={onBlur}
                      required={true}
                    />
                    <FormGroup
                      label="Property address"
                      name="address"
                      type="text"
                      record={data}
                      onChange={onChange}
                      onBlur={onBlur}
                      required={true}
                    />
                    <FormGroup
                      label="Budget range, if known"
                      name="budget"
                      type="text"
                      record={data}
                      onChange={onChange}
                      onBlur={onBlur}
                      required={true}
                    />
                    <FormGroup
                      label="Desired timeframe"
                      name="timeframe"
                      type="text"
                      record={data}
                      onChange={onChange}
                      onBlur={onBlur}
                      required={true}
                    />
                    <div className="mb-3">
                      <button disabled={isLoading} type="submit" className="btn btn-lg btn-outline-primary">
                        Submit
                      </button>
                      {isLoading && <div className="spinner-border spinner-border-sm ms-2"></div>}
                    </div>
                  </fieldset>
                </form>
              </>
            )}
            {isSubmitted && (
              <div>
                <p className="text-center mb-3">Thank you for reaching out!</p>
                <div className="text-center mb-3">
                  <button type="button" className="btn btn-lg btn-outline-primary" onClick={reset}>
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
export default Contact;

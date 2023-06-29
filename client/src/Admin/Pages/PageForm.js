import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';
import UnexpectedError from '../../UnexpectedError';
import ValidationError from '../../ValidationError';
import FormGroup from '../../Components/FormGroup';

function PageForm() {
  const staticContext = useStaticContext();
  const navigate = useNavigate();
  const { PageId } = useParams();

  const [record, setRecord] = useState({
    title: '',
    link: '',
    body: '',
    isVisible: false,
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    if (PageId) {
      Api.pages.get(PageId).then((response) => {
        if (isCancelled) return;
        setRecord(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [PageId]);

  function onChange(event) {
    const newRecord = { ...record };
    newRecord[event.target.name] = event.target.value;
    setRecord(newRecord);
  }

  function onToggle(event) {
    const newRecord = { ...record };
    newRecord[event.target.name] = event.target.checked;
    setRecord(newRecord);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (record.id) {
        response = await Api.pages.update(record.id, record);
      } else {
        response = await Api.pages.create(record);
      }
      navigate(`/admin/pages/${response.data.id}`);
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>
          {PageId ? 'Edit' : 'New'} Page - {staticContext?.env?.REACT_APP_SITE_TITLE}
        </title>
      </Helmet>
      <div className="row">
        <div className="col-md-6">
          <h2 className="display-6">{PageId ? 'Edit' : 'New'} Page</h2>
          <form onSubmit={onSubmit}>
            {error && error.message && <div className="alert alert-danger">{error.message}</div>}
            <fieldset disabled={isLoading}>
              <FormGroup label="Title" name="title" record={record} onChange={onChange} />
              <FormGroup label="Link" name="link" record={record} onChange={onChange} />
              <FormGroup label="Body" name="body" type="textarea" record={record} onChange={onChange} />
              <FormGroup label="Is visible?" name="isVisible" type="checkbox" record={record} onChange={onToggle} />
              <div className="mb-3">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}

export default PageForm;

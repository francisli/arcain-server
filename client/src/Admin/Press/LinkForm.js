import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';
import UnexpectedError from '../../UnexpectedError';
import ValidationError from '../../ValidationError';
import FormGroup from '../../Components/FormGroup';

function LinkForm() {
  const staticContext = useStaticContext();
  const navigate = useNavigate();
  const { LinkId } = useParams();

  const [record, setRecord] = useState({
    name: '',
    date: '',
    desc: '',
    url: '',
    isVisible: false,
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    if (LinkId) {
      Api.links.get(LinkId).then((response) => {
        if (isCancelled) return;
        setRecord(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [LinkId]);

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
      if (record.id) {
        await Api.links.update(record.id, record);
      } else {
        await Api.links.create(record);
      }
      navigate(`/admin/press`);
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
          {LinkId ? 'Edit' : 'New'} Link - {staticContext?.env?.REACT_APP_SITE_TITLE}
        </title>
      </Helmet>
      <div className="row">
        <div className="col-md-6">
          <h2 className="display-6">{LinkId ? 'Edit' : 'New'} Link</h2>
          <form onSubmit={onSubmit}>
            {error && error.message && <div className="alert alert-danger">{error.message}</div>}
            <fieldset disabled={isLoading}>
              <FormGroup label="Name" name="name" record={record} onChange={onChange} />
              <FormGroup label="Date" name="date" type="date" record={record} onChange={onChange} />
              <FormGroup label="Description" name="desc" type="textarea" record={record} onChange={onChange} />
              <FormGroup label="Url" name="url" record={record} onChange={onChange} />
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

export default LinkForm;

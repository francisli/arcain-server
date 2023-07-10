import { useEffect, useState } from 'react';

import Api from '../../Api';
import Confirm from '../../Components/Confirm';
import FormGroup from '../../Components/FormGroup';

function PhotoForm({ id, record, onChange, fileName, file, onCancel, onUpdated, onDeleted }) {
  const [data, setData] = useState(
    record ?? {
      fileName,
      file,
      desc: '',
      isVisible: true,
      isVisibleOnHome: true,
    }
  );
  const [isLoading, setLoading] = useState(false);
  const [isCreated, setCreated] = useState(false);
  const [isUpdated, setUpdated] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (id) {
      Api.photos.get(id).then((response) => setData(response.data));
    }
  }, [id]);

  function onChangeInternal(event) {
    const newData = { ...data };
    newData[event.target.name] = event.target.value;
    setData(newData);
    setUpdated(false);
    setCreated(false);
    onChange?.(newData);
  }

  function onToggleInternal(event) {
    const newData = { ...data };
    newData[event.target.name] = event.target.checked;
    setData(newData);
    setUpdated(false);
    setCreated(false);
    onChange?.(newData);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setCreated(false);
    setUpdated(false);
    try {
      let response;
      if (data.id) {
        response = await Api.photos.update(data.id, data);
      } else {
        response = await Api.photos.create(data);
      }
      setLoading(false);
      setData(response.data);
      if (data.id) {
        setUpdated(true);
        onUpdated?.(response.data);
      } else {
        setCreated(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    return false;
  }

  function showConfirmDeleteModal() {
    setShowConfirmDelete(true);
  }

  function hideConfirmDeleteModal() {
    setShowConfirmDelete(false);
  }

  async function onDelete(event) {
    try {
      setLoading(true);
      await Api.photos.delete(data?.id);
      hideConfirmDeleteModal();
      onDeleted?.();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={isLoading}>
        <FormGroup label="Original File Name" name="fileName" record={data} plaintext={true} />
        <FormGroup label="Description" name="desc" record={data} onChange={onChangeInternal} type="textarea" />
        <FormGroup label="Is visible?" name="isVisible" record={data} onChange={onToggleInternal} type="checkbox" />
        <FormGroup label="Is visible on homepage?" name="isVisibleOnHome" record={data} onChange={onToggleInternal} type="checkbox" />
        <div className="d-flex justify-content-between">
          <div>
            <button className="btn btn-outline-primary" type="submit">
              {data.id ? 'Update' : 'Submit'}
            </button>
            {onCancel && (
              <>
                &nbsp;&nbsp;
                <button onClick={onCancel} className="btn btn-outline-secondary" type="button">
                  Cancel
                </button>
              </>
            )}
            &nbsp;&nbsp;
            {isCreated && <span className="text-success">Photo added!</span>}
            {isUpdated && <span className="text-success">Photo updated!</span>}
          </div>
          {data.id && (
            <button onClick={showConfirmDeleteModal} className="btn btn-outline-danger" type="button">
              Delete
            </button>
          )}
        </div>
      </fieldset>
      <Confirm
        isShowing={showConfirmDelete}
        onHide={hideConfirmDeleteModal}
        onConfirm={onDelete}
        title="Are you sure?"
        cancelLabel="Cancel"
        dangerLabel="Delete">
        Are you sure you wish to delete this photo? This cannot be undone.
      </Confirm>
    </form>
  );
}
export default PhotoForm;

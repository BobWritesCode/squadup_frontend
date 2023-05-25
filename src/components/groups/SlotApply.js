import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import btnStyles from '../../styles/Buttons.module.css';
import modalStyles from '../../styles/Modal.module.css';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import formStyles from '../../styles/Forms.module.css';
import LoadSpinner from '../Spinner';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import Table from 'react-bootstrap/Table';
import RankBadge from '../utils/RankBadge';
import appStyles from '../../App.module.css';
import Badge from 'react-bootstrap/Badge';
import myApplicationsSignalContext from '../../contexts/myApplicationsSignalContext';

const SlotApply = (props) => {
  const { slotData, slotID, onUpdate } = props;
  // Context to force refresh when signal received.
  const { myApplicationsSignal, setMyApplicationsSignal } = useContext(
    myApplicationsSignalContext,
  );
  const currentUser = useCurrentUser();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [show, setShow] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});
  // Used to display character count under note input
  const [charCount, setCharCount] = useState(0);
  const [formData, setFormData] = useState({
    id: 0,
    slot: slotData?.id || slotID,
    role: 'Any',
    rank: 0,
    content: '',
    status: '',
    reply_content: '',
  });
  const { role, content } = formData;

  const Status = (s) => {
    switch (s) {
      case 'Awaiting':
        return <Badge bg="warning">Awaiting</Badge>;
      case 'Accepted':
        return <Badge bg="success">Accepted</Badge>;
      case 'Rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
    }
  };

  const handleClose = () => {
    // Send refresh signal to update MyApplications
    setMyApplicationsSignal(!myApplicationsSignal);
    setShow(false);
    setHasLoaded(false);
    setShowEditForm(false);
    setErrors({});
    setSuccessMessage(false);
    setDeleted(false);
    // reset status back to blank, so correct modal view is shown.
    setFormData({
      ...formData,
      status: '',
    });
  };

  const handleShow = () => {
    CheckForApplication();
    setShow(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update character count on change.
  useEffect(() => {
    setCharCount(String(content).length);
  }, [content]);

  // Switch inputs to disabled or active
  const disableInputs = (toggle) => {
    const modal = document.getElementById('my-modal');
    const inputs = modal.querySelectorAll('select, textarea, button, input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = toggle;
    }
    const closeModalBtn = modal.querySelector('#close-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.disabled = false;
    }
  };

  // Check to see if player has already applied for this role.
  const CheckForApplication = async () => {
    try {
      const { data } = await axiosReq.get(
        `/lfg_slots_apply/?slot=${formData.slot}&owner=${currentUser.pk}`,
      );
      if (data.count > 0) {
        setFormData({
          ...formData,
          id: data.results[0].id,
          role: data.results[0].role,
          rank: data.results[0].rank,
          content: data.results[0].content,
          status: data.results[0].status,
          created_at: data.results[0].created_at,
          reply_content: data.results[0].reply_content,
        });
      }
      setHasLoaded(true);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      disableInputs(false);
    }
  };

  // Handle submit button press
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    disableInputs(true);
    try {
      await axiosReq.post(`/lfg_slots_apply/`, formData);
      setSuccessMessage('Application submitted.');
      onUpdate();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      disableInputs(false);
    }
  };

  // Handle delete button press
  const handleDelete = async (event) => {
    event.preventDefault();
    setErrors({});
    disableInputs(true);
    try {
      await axiosReq.delete(`/lfg_slots_apply/${formData.id}`);
      setDeleted(true);
      onUpdate();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      disableInputs(false);
    }
  };

  // Handle edit button press
  const handleEdit = (event) => {
    event.preventDefault();
    setShowEditForm(true);
  };

  // Handle save edit button press
  const handleSaveEdit = async (event) => {
    event.preventDefault();
    setErrors({});
    disableInputs(true);
    // Create new FormData object and append correct data to be patched.
    const updateForm = new FormData();
    updateForm.append('content', formData.content);
    updateForm.append('role', formData.role);
    updateForm.append('rank', formData.rank);
    try {
      await axiosReq.patch(`/lfg_slots_apply/${formData.id}/`, updateForm);
      setShowEditForm(false);
      disableInputs(false);
      onUpdate();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      disableInputs(false);
    }
  };

  const ShowApplied = (
    <>
      <h3 className={`${appStyles.YellowText}`}>Request status.</h3>
      <Table striped bordered hover variant="dark">
        <tbody>
          <tr>
            <th>Status</th>
            <td>{Status(formData.status)}</td>
          </tr>

          <tr>
            <th>Role</th>
            <td>{formData.role}</td>
          </tr>
          <tr>
            <th>Rank</th>
            <td>
              <RankBadge rank={formData.rank} />
            </td>
          </tr>
          <tr>
            <th>Info</th>
            <td className="text-break">
              {formData.content ? formData.content : <em>No info provided.</em>}
            </td>
          </tr>
          <tr>
            <th>Applied when</th>
            <td>{formData.created_at}</td>
          </tr>
          {formData.status === 'Accepted' && (
            <tr>
              <th>Message from leader</th>
              <td>{formData.reply_content}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );

  const ShowMyForm = (
    <Form className={formStyles.Form}>
      <Form.Group className="mb-2 d-flex" controlId="role">
        <Form.Label className="w-25">Role type:</Form.Label>
        <Form.Select
          aria-label="Select desired player role"
          name="role"
          value={role}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Duelist">Duelist</option>
          <option value="Controller">Controller</option>
          <option value="Initiator">Initiator</option>
          <option value="Sentinel">Sentinel</option>
        </Form.Select>
      </Form.Group>

      {errors.role?.map((m, idx) => (
        <Alert variant="warning" key={idx}>
          {m}
        </Alert>
      ))}

      <Form.Group className="mb-2 d-flex" controlId="rank">
        <Form.Label className="w-25">Your rank:</Form.Label>
        <Form.Select
          aria-label="Select your current rank"
          name="rank"
          value={formData.rank}
          onChange={handleChange}
        >
          <option value="0">Unranked</option>
          <option value="1">Iron</option>
          <option value="2">Bronze</option>
          <option value="3">Silver</option>
          <option value="4">Gold</option>
          <option value="5">Platinum</option>
          <option value="6">Diamond</option>
          <option value="7">Ascendant</option>
          <option value="8">Immortal</option>
          <option value="9">Radiant</option>
        </Form.Select>
      </Form.Group>

      {errors.rank?.map((m, idx) => (
        <Alert variant="warning" key={idx}>
          {m}
        </Alert>
      ))}

      <Form.Group className="mb-2 d-flex" controlId="content">
        <Form.Label>Extra information:</Form.Label>
        <div className="d-flex flex-column w-100">
          <Form.Control
            className={`${formStyles.Form} mb-0`}
            as="textarea"
            placeholder="You can write some extra information here."
            name="content"
            value={content}
            onChange={handleChange}
          />
          <Form.Text className="ms-auto">({charCount}/100)</Form.Text>
        </div>
      </Form.Group>

      {errors.content?.map((m, idx) => (
        <Alert variant="warning" key={idx}>
          {m}
        </Alert>
      ))}

      {errors.non_field_errors?.map((m, idx) => (
        <Alert variant="warning" key={idx}>
          {m}
        </Alert>
      ))}

      {successMessage && (
        // Show success message if get 20x from server response.
        <Alert variant="success" key={9999} className="mt-3">
          {successMessage}
        </Alert>
      )}
    </Form>
  );

  const ShowApplyButton = (
    <Button variant="success" onClick={handleSubmit}>
      Request to join
    </Button>
  );

  const ShowDeleteButton = (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );

  const ShowEditButton = (
    <Button variant="success" onClick={handleEdit}>
      Edit
    </Button>
  );

  const ShowSaveEditButton = (
    <Button variant="success" onClick={handleSaveEdit}>
      Save Update
    </Button>
  );

  const ShowDeleted = (
    <Alert key={'danger'} variant={'danger'}>
      Application deleted.
    </Alert>
  );

  return (
    <>
      {slotData && slotData.status && slotData.status === 'Closed' ? (
        <Button
          disabled
          variant="light"
          className={`${btnStyles.Single} w-100`}
        >
          <i className="bi bi-arrow-right-square text-light"></i>
        </Button>
      ) : (
        <Button
          variant="light"
          className={`${btnStyles.Single} w-100`}
          onClick={handleShow}
        >
          <i className="bi bi-arrow-right-square text-light"></i>
        </Button>
      )}

      <Modal show={show} onHide={handleClose} id={'my-modal'}>
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Request to join</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          {!hasLoaded && <LoadSpinner />}
          {hasLoaded && deleted && ShowDeleted}
          {
            // Check to see if should show request summary if already requested to join role.
            hasLoaded &&
              formData.status &&
              !showEditForm &&
              !deleted &&
              ShowApplied
          }

          {
            // Show form if not already requested to join or editing a request to join.
            hasLoaded &&
              (!formData.status || showEditForm) &&
              !deleted &&
              ShowMyForm
          }
        </Modal.Body>
        <Modal.Footer className={modalStyles.Footer}>
          {
            // Show Delete or Apply Button
            hasLoaded
              ? formData.status
                ? !deleted && ShowDeleteButton
                : ShowApplyButton
              : null
          }
          {
            // Show Edit Button
            hasLoaded
              ? formData.status
                ? !deleted && !showEditForm && ShowEditButton
                : null
              : null
          }
          {
            // Show Save Edit Button
            hasLoaded
              ? formData.status
                ? !deleted && showEditForm && ShowSaveEditButton
                : null
              : null
          }
          <Button
            variant="secondary"
            onClick={handleClose}
            id={'close-modal-btn'}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SlotApply;

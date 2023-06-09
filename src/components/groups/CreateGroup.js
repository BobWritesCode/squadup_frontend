import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import btnStyles from '../../styles/Buttons.module.css';
import modalStyles from '../../styles/Modal.module.css';
import formStyles from '../../styles/Forms.module.css';
import CreateGroupSlot from './CreateGroupSlot';
import { axiosReq } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import PropTypes from 'prop-types';

const CreateGroup = (props) => {
  const { onNewGroup } = props;
  // Show spinner while waiting for API result
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  // set up key for slots components
  const [slots, setSlots] = useState([]);
  // set up variables for errors from request.
  const [errors, setErrors] = useState({});
  // set up variables for success message.
  const [successMessage, setSuccessMessage] = useState('');
  // set up modal state
  const [show, setShow] = useState(false);
  // set up variables for fields used in this component
  const [formData, setFormData] = useState({
    game_type: 'Competitive',
    max_team_size: 2,
    current_team_size: 2,
    lowest_rank: 0,
    highest_rank: 9,
    content: '',
    slots: {},
  });
  const { content, max_team_size } = formData;
  const [currentTeamSize, setCurrentTeamSize] = useState(2);
  // Used to display character count under note input
  const [charCount, setCharCount] = useState(0);

  /**
   * Handle closing modal.
   */
  const handleClose = () => {
    setErrors({});
    disableInputs(false);
    setShow(false);
  };

  /**
   * Handle opening modal.
   */
  const handleShow = () => {
    setSuccessMessage('');
    setShow(true);
  };

  useEffect(() => {
    if (slots.length >= Number(max_team_size)) {
      slots.splice(-(slots.length - (max_team_size - 1)));
      // Create new array so react updates correctly.
      const updatedSlots = [...slots];
      setSlots(updatedSlots);
    }
    const updatedCurrentTeamSize = max_team_size - slots.length;
    setCurrentTeamSize(updatedCurrentTeamSize);
    // setCurrentTeamSize(max_team_size-slots.length);
  }, [formData.max_team_size]);

  useEffect(() => {
    // Update character count on change.
    setCharCount(String(content).length);
  }, [content]);

  useEffect(() => {
    const updatedCurrentTeamSize = max_team_size - slots.length;
    setCurrentTeamSize(updatedCurrentTeamSize);
  }, [slots]);

  // Allow user to edit form.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add a player slot to the form
  const handleAddSlot = () => {
    const newSlot = {
      id: slots.length,
      role: 'Any',
      content: '',
    };
    setSlots((prevSlots) => [...prevSlots, newSlot]);
  };

  //  Remove a player slot to the form
  const handleRemoveSlot = () => {
    slots.pop();
    // Create new array so react updates correctly.
    const updatedSlots = [...slots];
    setSlots(updatedSlots);
    const updatedCurrentTeamSize = max_team_size - slots.length;
    setCurrentTeamSize(updatedCurrentTeamSize);
  };

  const handleSlotChange = (e) => {
    // update slots with changes from child component LfgSlot
    const id = e.id;
    const index = slots.findIndex((obj) => obj.id === id);
    if (index !== -1) {
      slots[index] = e;
    }
  };

  // Switch inputs to disabled or active
  const disableInputs = (toggle) => {
    const modal = document.getElementById('lfgModal');
    const inputs = modal.querySelectorAll('select, textarea, button, input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = toggle;
    }
    const closeModalBtn = modal.querySelector('#close-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.disabled = false;
    }
  };

  // Handle submit on button press
  const handleSubmit = async (event) => {
    event.preventDefault();
    setAwaitingResponse(true);
    // make sure current team size is correct in formData
    formData.current_team_size = currentTeamSize;
    // Remove error messages in showing.
    setErrors({});
    disableInputs(true);
    const ctx = {
      formData: formData,
      slots: slots,
    };
    try {
      slots.forEach((s) => {
        if (s.content.length > 100) {
          throw new Error('Content length exceeds 100 characters.');
        }
      });
      try {
        const { data } = await axiosReq.post('/lfg/', JSON.stringify(ctx));
        setSuccessMessage('Group created.');
        onNewGroup(data.slot_id);
      } catch (err) {
        setErrors(err.response?.data);
        disableInputs(false);
      } finally {
        setAwaitingResponse(false);
      }
    } catch (error) {
      disableInputs(false);
      setAwaitingResponse(false);
    }
  };

  return (
    <>
      <Button
        className={`${btnStyles.Success} mb-2 w-100`}
        onClick={handleShow}
        id="modalBtnForCreateLfg"
      >
        Create a group
      </Button>

      <Modal show={show} onHide={handleClose} id="lfgModal">
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Create a group</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyles.Body}>
          <Form className={formStyles.Form}>
            <Form.Group className="mb-2 d-flex" controlId="game_type">
              <Form.Label>Game Types:</Form.Label>
              <Form.Select
                className={`${formStyles.Form}`}
                aria-label="Select game type."
                name="game_type"
                value={formData.game_type}
                onChange={handleChange}
              >
                <option value="Competitive">Competitive</option>
                <option value="Tournament">Tournament</option>
                <option value="Casual">Casual</option>
              </Form.Select>
            </Form.Group>

            {errors.game_type?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            <Form.Group className="mb-2 d-flex" controlId="max_team_size">
              <Form.Label>Team Size:</Form.Label>
              <Form.Select
                aria-label="Team size:"
                name="max_team_size"
                value={max_team_size}
                onChange={handleChange}
              >
                {Array(9)
                  .fill()
                  .map((_, i) => (
                    <option key={i + 2} value={i + 2}>{`${i + 2}`}</option>
                  ))}
              </Form.Select>
            </Form.Group>

            {errors.max_team_size?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            <Form.Group className="mb-2 d-flex" controlId="lowest_rank">
              <Form.Label>Minimum rank:</Form.Label>
              <Form.Select
                aria-label="Select minimum player rank"
                name="lowest_rank"
                value={formData.lowest_rank}
                onChange={handleChange}
              >
                <option value={0}>Unranked</option>
                <option value={1}>Iron</option>
                <option value={2}>Bronze</option>
                <option value={3}>Silver</option>
                <option value={4}>Gold</option>
                <option value={5}>Platinum</option>
                <option value={6}>Diamond</option>
                <option value={7}>Ascendant</option>
                <option value={8}>Immortal</option>
                <option value={9}>Radiant</option>
              </Form.Select>
            </Form.Group>

            {errors.lowest_rank?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            <Form.Group className="mb-2 d-flex" controlId="highest_rank">
              <Form.Label>Maximum rank:</Form.Label>
              <div className="d-flex flex-column">
                <Form.Select
                  aria-label="Select maximum player rank"
                  name="highest_rank"
                  value={formData.highest_rank}
                  onChange={handleChange}
                  className="mb-0"
                >
                  <option value={0}>Unranked</option>
                  <option value={1}>Iron</option>
                  <option value={2}>Bronze</option>
                  <option value={3}>Silver</option>
                  <option value={4}>Gold</option>
                  <option value={5}>Platinum</option>
                  <option value={6}>Diamond</option>
                  <option value={7}>Ascendant</option>
                  <option value={8}>Immortal</option>
                  <option value={9}>Radiant</option>
                </Form.Select>
                <Form.Text id="passwordHelpBlock" muted>
                  Must be of the same level or higher than minimum rank.
                </Form.Text>
              </div>
            </Form.Group>

            {errors.highest_rank?.map((m, idx) => (
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
                <Form.Text className="ms-auto">({charCount}/200)</Form.Text>
              </div>
            </Form.Group>

            {errors.content?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            <Form.Group className="d-flex flex-column">
              <Form.Label>Player slots:</Form.Label>
              {slots.map((slot, i) => (
                <CreateGroupSlot
                  key={`slot-${i}`}
                  {...slot}
                  id={i}
                  slotValue={slot}
                  onSlotChange={handleSlotChange}
                />
              ))}

              {
                // Show button as long as team size is larger than slots
                currentTeamSize > 1 && (
                  <Button
                    className={`${btnStyles.Single} ${btnStyles.Success} mb-2`}
                    onClick={handleAddSlot}
                  >
                    <i className="bi bi-person-plus"></i>
                  </Button>
                )
              }
              {
                // Show button as long there are open slots
                slots.length > 0 && (
                  <Button
                    className={` ${btnStyles.Single} ${btnStyles.Danger} mb-2`}
                    onClick={handleRemoveSlot}
                  >
                    <i className="bi bi-person-dash-fill"></i>
                  </Button>
                )
              }
              {errors.slots?.map((m, idx) => (
                <Alert variant="warning" key={idx}>
                  {m}
                </Alert>
              ))}
            </Form.Group>

            {errors.non_field_errors?.map((m, idx) => (
              <Alert variant="warning" key={idx}>
                {m}
              </Alert>
            ))}

            {
              // Show spinner while waiting for API response
              awaitingResponse && <LoadSpinner className="mt-3" />
            }

            {successMessage && (
              // Show success message if get 20x from server response.
              <Alert variant="success" key={9999} className="mt-3">
                {successMessage}
              </Alert>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer className={modalStyles.Footer}>
          <Button variant="success" onClick={handleSubmit}>
            <i className="bi bi-save"></i> Create group
          </Button>
          <Button
            variant="secondary"
            onClick={handleClose}
            id="close-modal-btn"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Props validation
CreateGroup.propTypes = {
  onNewGroup: PropTypes.func.isRequired,
};

export default CreateGroup;

import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import btnStyles from '../../styles/Buttons.module.css';
import modalStyles from '../../styles/Modal.module.css';
import LoadSpinner from '../Spinner';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import Table from 'react-bootstrap/Table';
import RankBadge from '../utils/RankBadge';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import formStyles from '../../styles/Forms.module.css';
import PropTypes from 'prop-types';
import tableStyles from '../../styles/Table.module.css';

const SlotUser = (props) => {
  const { slotData, onChange } = props;
  // Get current user.
  const currentUser = useCurrentUser();
  // Use to toggle showing modal.
  const [show, setShow] = useState(false);
  // Use to toggle show kick confirm.
  const [showKickConfirm, setShowKickConfirm] = useState(false);
  // Use to store accepted request.
  const [acceptedRequest, setAcceptedRequest] = useState({});
  // Use to store text for confirm kick form
  const [confirmKickText, setConfirmKickText] = useState('');
  // Use to toggle showing incorrect phrase typed
  const [showIncorrectAlert, setShowIncorrectAlert] = useState(false);
  // Use to toggle showing reopen button, in case slot closed and no accepted request
  const [showReopenButton, setShowReopenButton] = useState(false);
  // Use to toggle API has resolved initial data
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * Handle closing modal.
   */
  const handleClose = () => {
    setShow(false);
    setShowKickConfirm(false);
    setConfirmKickText('');
    setShowIncorrectAlert(false);
  };

  /**
   * Handle opening modal.
   */
  const handleShow = () => {
    setShow(true);
  };

  /**
   * Calls API to accepted request for this slot in this group.
   */
  const GetSlotUserData = useCallback(() => {
    const fetchData = async () => {
      try {
        // Get accepted request for this slot
        const { data } = await axiosReq.get(
          `/lfg_slots_apply/?slot=${slotData.id}&status=Accepted`,
        );
        // Set received api data to variable.
        if (data.results.length > 0) {
          setAcceptedRequest(data.results[0]);
        } else {
          setShowReopenButton(true);
        }
      } catch (err) {
        // show errors in console.
        console.log(err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchData();
  }, [slotData.id]);

  /**
   * On component mount run GetSlotData().
   */
  useEffect(() => {
    if (currentUser) {
      GetSlotUserData();
    }
  }, [currentUser, GetSlotUserData]);

  /**
   * On button click shows confirm kick form.
   */
  const handleKick = () => {
    setShowKickConfirm(true);
  };

  /**
   * On button confirms user typed in correct phrase then kicks user from group
   */
  const handleConfirmKick = () => {
    setShowIncorrectAlert(false);
    if (confirmKickText.toLowerCase() !== 'kick') {
      setShowIncorrectAlert(true);
    } else {
      handleReopenSlot();
    }
  };

  /**
   * Contact API, delete all current requests and open slot.
   */
  const handleReopenSlot = async () => {
    try {
      const apiData = new FormData();
      apiData.append('status', 'Open');
      await axiosReq.patch(`/lfg_slots_reopen/${slotData.id}/`, apiData);
      onChange('Open Slot');
    } catch (err) {
      // log errors to console.
      console.log(err);
    } finally { /* empty */ }
  };

  /**
   * Allow user to edit form.
   * @param {*} e
   */
  const handleChange = (e) => {
    setConfirmKickText(e.target.value);
  };

  /**
   * JSX to show kick confirm form.
   */
  const ShowKickConfirmForm = (
    <>
      <Form className={`${formStyles.Form} mt-3 w-100`}>
        <Form.Group
          className="mb-2 d-flex flex-column"
          controlId="confirmKickText"
        >
          <Form.Label>Type &apos;kick&apos; to confirm kick:</Form.Label>
          <div className="d-flex flex-column w-100">
            <Form.Control
              className={`${formStyles.Form} mb-0`}
              as="input"
              placeholder="Type 'kick' to confirm kick"
              name="confirmKickText"
              value={confirmKickText}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        {/* Error messages for content field*/}
        {showIncorrectAlert && (
          <Alert variant="warning" className="mt-3">
            Incorrect phrase typed
          </Alert>
        )}

        <Form.Group className="d-flex justify-content-center">
          <Button variant="danger" onClick={handleConfirmKick}>
            Confirm Kick
          </Button>
        </Form.Group>
      </Form>
    </>
  );

  /**
   * JSX to show reopen button.
   * In case slot is closed but not accepted request.
   */
  const ShowReopenButton = (
    <>
      <Button
        variant="light"
        className={`${btnStyles.Single} w-100`}
        onClick={handleReopenSlot}
      >
        <Badge bg="secondary">Reopen</Badge>
      </Button>
    </>
  );

  /**
   * JSX to show accepted request to join group.
   */
  const ShowRequest = (
    <>
      <Table bordered striped hover variant="dark" className={'mb-1'}>
        <thead>
          <tr>
            <th>Requester</th>
            <th>Role</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link
                to={`/profile/${acceptedRequest.owner}`}
                preventScrollReset={true}
                target={'_blank'}
                className={`${tableStyles.Link}`}
              >
                {acceptedRequest.owner}
              </Link>
            </td>
            <td>{acceptedRequest.role}</td>
            <td>
              <RankBadge rank={acceptedRequest.rank} />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <strong>{acceptedRequest.owner}</strong>:{' '}
              {acceptedRequest.content}
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <strong>You</strong>: {acceptedRequest.reply_content}
            </td>
          </tr>
        </tbody>
      </Table>
      {!showKickConfirm ? (
        <Button variant="danger" onClick={handleKick} className="mt-2">
          Kick from group
        </Button>
      ) : (
        ShowKickConfirmForm
      )}
    </>
  );

  return (
    <>
      {/* Show Reopen slot Button logic*/}
      {hasLoaded && showReopenButton && ShowReopenButton}
      {/* Show open accepted requester Button logic*/}
      {hasLoaded && acceptedRequest.id && (
        <>
          <Button
            variant="light"
            className={`${btnStyles.Single} w-100`}
            onClick={handleShow}
          >
            <Badge bg="success">{acceptedRequest.owner}</Badge>
          </Button>

          {/*Modal*/}
          <Modal show={show} onHide={handleClose} id={'my-modal'}>
            <Modal.Header className={modalStyles.Header}>
              <Modal.Title>Applicant</Modal.Title>
            </Modal.Header>
            <Modal.Body
              className={`${modalStyles.Body} d-flex flex-column align-items-center`}
            >
              {!hasLoaded ? <LoadSpinner /> : ShowRequest}
            </Modal.Body>
            <Modal.Footer className={modalStyles.Footer}>
              {/*Close modal button*/}
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
      )}
    </>
  );
};

// Props validation
SlotUser.propTypes = {
  slotData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SlotUser;

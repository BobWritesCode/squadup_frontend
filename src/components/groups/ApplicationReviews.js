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
import Pagination from 'react-bootstrap/Pagination';
import paginationStyles from '../../styles/Pagination.module.css';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import formStyles from '../../styles/Forms.module.css';
import PropTypes from 'prop-types';

const ApplicationReviews = (props) => {
  const { slotData, onChange } = props;
  // Get current user.
  const currentUser = useCurrentUser();
  // object of all requests to join group for this slot.
  const [applications, setApplications] = useState({ results: [] });
  // object for current request to be shown.
  const [pageData, setPageData] = useState({});
  // integer: Which page is to be shown for the pagination.
  const [pageNumber, setPageNumber] = useState(0);
  // Use to display character count under note input
  const [charCount, setCharCount] = useState('');
  // Use to toggle success alert on confirmed request accept.
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  // Use to toggle show accept form
  const [showProcessing, setShowProcessing] = useState(false);
  // Use to toggle showing pagination.
  const [showPagination, setShowPagination] = useState(true);
  // Use to toggle showing spinner instead of modal button while waiting for API to resolve.
  const [showButtonSpinner, setButtonSpinner] = useState(false);
  // Use to toggle showing spinner instead of Accept & Reject buttons.
  const [showAccRejSpinner, setShowAccRejSpinner] = useState(false);
  // Use to toggle showing spinner when waiting for data from API for request.
  const [showRequestSpinner, setShowRequestSpinner] = useState(false);
  // Use to toggle showing modal.
  const [show, setShow] = useState(false);
  // Use to any expected errors as alerts.
  const [errors, setErrors] = useState({});
  // Use to control formData in form.
  const [formData, setFormData] = useState({
    reply_content: '',
  });
  const { reply_content } = formData;

  /**
   * Handle closing modal.
   */
  const handleClose = () => {
    setShow(false);
    GetSlotData();
    setPageData({
      ...pageData,
      status: 'Awaiting',
    });
    setShowProcessing(false);
    setPageNumber(0);
    setErrors({});
    setFormData({
      ...formData,
      reply_content: '',
    });
    setShowSuccessMsg(false);
    // refresh parent if request is accepted.
    if (pageData.status === 'Accepted') {
      onChange('Close Slot');
    }
  };

  /**
   * Handle opening modal.
   */
  const handleShow = () => {
    setShow(true);
  };

  /**
   * Calls API to get all requests for this slot in this group.
   */
  const GetSlotData = useCallback(() => {
    const fetchData = async () => {
      try {
        setButtonSpinner(true);
        // Get applications for this slot
        const [{ data: list }] = await Promise.all([
          axiosReq.get(`/lfg_slots_apply/?slot=${slotData.id}`),
        ]);
        // Set received api data to variable.
        setApplications(list);
      } catch (err) {
        // show errors in console.
        console.log(err);
      } finally {
        setButtonSpinner(false);
      }
    };
    fetchData();
  }, [slotData.id, setApplications]);

  /**
   * On component mount run GetSlotData().
   */
  useEffect(() => {
    if (currentUser) {
      GetSlotData();
    }
  }, [currentUser, GetSlotData]);

  /**
   * On pageNumber update.
   */
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        // remove any error messages from DOM.
        setErrors({});
        // show spinner until api resolved.
        setShowRequestSpinner(true);
        // remove success message from DOM.
        setShowSuccessMsg(false);
        // remove accept form from DOM.
        setShowProcessing(false);
        try {
          const { data } = await axiosReq.get(
            `/lfg_slots_apply_pagination/?limit=1&offset=${pageNumber}&slot=${slotData.id}`,
          );
          setPageData(data.results[0]);
        } catch (err) {
          // display any errors in console.
          console.log(err);
          // show expected errors in DOM.
          setErrors(err.response?.data);
        } finally {
          // remove spinner from DOM.
          setShowRequestSpinner(false);
        }
      };
      fetchData();
    }
  }, [currentUser, pageNumber, slotData.id]);

  /**
   * Disables/Enables form controls through arg toggle.
   * @param {boolean} toggle
   */
  const disableInputs = (toggle) => {
    // disable all inputs and buttons in modal.
    const modal = document.getElementById('my-modal');
    const inputs = modal.querySelectorAll('select, textarea, button, input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = toggle;
    }
    // Keep close button enabled.
    const closeModalBtn = modal.querySelector('#close-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.disabled = false;
    }
  };

  /**
   * Submits form to API, and waits for a response.
   *
   * If error, then show expected error messages.
   *
   * If success, show success message to user.
   * @param {*} event
   */
  const handleConfirmAccept = async (event) => {
    event.preventDefault();
    // show spinner until api response.
    setShowAccRejSpinner(true);
    // disable inputs until api response.
    disableInputs(true);
    // remove any error messages from DOM.
    setErrors({});
    try {
      // create new form to control data being sent to API
      const apiData = new FormData();
      apiData.append('status', 'Accepted');
      apiData.append('reply_content', reply_content);
      // contact API with apiData form.
      await axiosReq.patch(`/lfg_slots_apply_update/${pageData.id}/`, apiData);
      // if status:ok, update pageData.status to accepted.
      setPageData({
        ...pageData,
        status: 'Accepted',
      });

      // hide form
      setShowProcessing(false);
      // show alert to user.
      setShowSuccessMsg(true);
      // hide pagination
      setShowPagination(false);
    } catch (err) {
      // log errors to console.
      console.log(err);
      // show any expected errors to user.
      setErrors(err.response?.data);
      // reenable user form controls.
      disableInputs(false);
    } finally {
      // remove spinner.
      setShowAccRejSpinner(false);
    }
  };

  /**
   * Handles the first accept button.
   *
   * Removes any displayed error message, updates status, shows confirmation form to the user.
   * @param {*} event
   */
  const handleAccept = async (event) => {
    event.preventDefault();
    // remove any shown errors.
    setErrors({});
    // update status shown to user with new instruction.
    setPageData({
      ...pageData,
      status: 'Complete form below',
    });
    // display form to user to complete to confirm accept request.
    setShowProcessing(true);
  };

  /**
   * Handles the reject button.
   *
   * Removes any displayed error message, updates status, shows confirmation form to the user.
   * @param {*} event
   */
  const handleReject = async (event) => {
    event.preventDefault();
    // show spinner until receive api response.
    setShowAccRejSpinner(true);
    // remove any shown errors.
    setErrors({});
    // disable form inputs until receive api response.
    disableInputs(true);
    try {
      const apiData = new FormData();
      apiData.append('status', 'Rejected');
      await axiosReq.patch(`/lfg_slots_apply_update/${pageData.id}/`, apiData);
      setPageData({
        ...pageData,
        status: 'Rejected',
      });
    } catch (err) {
      // log errors to console.
      console.log(err);
      // show any expected errors to user.
      setErrors(err.response?.data);
      // reenable user controls.
      disableInputs(false);
    } finally {
      // remove spinner.
      setShowAccRejSpinner(false);
    }
  };

  /**
   * Update character as user changes value of input
   */
  useEffect(() => {
    setCharCount(String(reply_content).length);
  }, [reply_content]);

  /**
   * Allow user to edit form.
   * @param {*} e
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * JSX Pagination to show is application count is 10 or less.
   */
  const ShowPages10 = applications.results?.length > 0 && (
    <Pagination className={`mt-4 ${paginationStyles.Page}`}>
      {pageNumber === 0 ? (
        <Pagination.Prev disabled onClick={() => {}} />
      ) : (
        <Pagination.Prev onClick={() => setPageNumber(pageNumber - 1)} />
      )}
      {Array(applications.results.length)
        .fill()
        .map((_, i) =>
          pageNumber === i ? (
            <Pagination.Item key={i} active onClick={() => setPageNumber(i)}>
              {i + 1}
            </Pagination.Item>
          ) : (
            <Pagination.Item key={i} onClick={() => setPageNumber(i)}>
              {i + 1}
            </Pagination.Item>
          ),
        )}
      {pageNumber === applications.results.length - 1 ? (
        <Pagination.Next disabled onClick={() => setPageNumber(() => {})} />
      ) : (
        <Pagination.Next onClick={() => setPageNumber(pageNumber + 1)} />
      )}
    </Pagination>
  );

  /**
   * JSX Pagination to show is application count is 11 or more.
   */
  const ShowPages11Up = (
    <Pagination className={`mt-4 ${paginationStyles.Page}`}>
      {/* Prev page */}
      {pageNumber <= 0 ? (
        <Pagination.Prev disabled onClick={() => {}} />
      ) : (
        <Pagination.Prev onClick={() => setPageNumber(pageNumber - 1)} />
      )}

      {/* First page number */}
      {pageNumber === 0 ? (
        <Pagination.Item active onClick={() => setPageNumber(0)}>
          {1}
        </Pagination.Item>
      ) : (
        <Pagination.Item onClick={() => setPageNumber(0)}>{1}</Pagination.Item>
      )}

      <Pagination.Ellipsis disabled />

      {pageNumber >= 0 && pageNumber <= 3 ? (
        <>
          {/* Set up pagination 2-6, if the current page is 4 or less */}
          {Array(5)
            .fill()
            .map((_, i) =>
              pageNumber === i + 1 ? (
                <Pagination.Item
                  key={i + 1}
                  active
                  onClick={() => setPageNumber(i + 1)}
                >
                  {i + 2}
                </Pagination.Item>
              ) : (
                <Pagination.Item
                  key={i + 1}
                  onClick={() => setPageNumber(i + 1)}
                >
                  {i + 2}
                </Pagination.Item>
              ),
            )}
        </>
      ) : pageNumber >= applications.count - 3 &&
        pageNumber <= applications.count ? (
          <>
            {/* Set up pagination last-5 to last-1, if the page is within 3 of the end */}
            {Array(5)
              .fill()
              .map((_, i) =>
                pageNumber === applications.count - 6 + i ? (
                  <Pagination.Item
                    key={applications.count - 6 + i}
                    active
                    onClick={() => setPageNumber(applications.count - 6 + i)}
                  >
                    {applications.count - 5 + i}
                  </Pagination.Item>
                ) : (
                  <Pagination.Item
                    key={applications.count - 6 + i}
                    onClick={() => setPageNumber(applications.count - 6 + i)}
                  >
                    {applications.count - 5 + i}
                  </Pagination.Item>
                ),
              )}
          </>
        ) : (
          <>
            <Pagination.Item onClick={() => setPageNumber(pageNumber - 2)}>
              {pageNumber - 1}
            </Pagination.Item>
            <Pagination.Item onClick={() => setPageNumber(pageNumber - 1)}>
              {pageNumber}
            </Pagination.Item>
            <Pagination.Item active>{pageNumber + 1}</Pagination.Item>
            <Pagination.Item onClick={() => setPageNumber(pageNumber + 1)}>
              {pageNumber + 2}
            </Pagination.Item>
            <Pagination.Item onClick={() => setPageNumber(pageNumber + 2)}>
              {pageNumber + 3}
            </Pagination.Item>
          </>
        )}

      <Pagination.Ellipsis disabled />

      {/* Final page number */}
      {pageNumber === applications.count - 1 ? (
        <Pagination.Item
          active
          onClick={() => setPageNumber(applications.count - 1)}
        >
          {applications.count}
        </Pagination.Item>
      ) : (
        <Pagination.Item onClick={() => setPageNumber(applications.count - 1)}>
          {applications.count}
        </Pagination.Item>
      )}

      {/* Next page */}
      {pageNumber >= applications.count - 1 ? (
        <Pagination.Next disabled onClick={() => setPageNumber(() => {})} />
      ) : (
        <Pagination.Next onClick={() => setPageNumber(pageNumber + 1)} />
      )}
    </Pagination>
  );

  /**
   * JSX for Accept and Reject button under each request in modal.
   */
  const ShowAcceptRejectBtns = (
    <>
      {showAccRejSpinner ? (
        <LoadSpinner />
      ) : (
        <>
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
          <Button variant="success" onClick={handleAccept} className="ms-3">
            Accept
          </Button>
        </>
      )}
    </>
  );

  /**
   * JSX status badge for each request in modal..
   */
  const ShowStatus = (
    <>
      {pageData ? (
        pageData.status === 'Rejected' ? (
          <Badge bg="danger">{pageData.status}</Badge>
        ) : pageData.status === 'Complete form below' ? (
          <Badge bg="warning">Complete form below</Badge>
        ) : (
          <Badge bg="success">{pageData.status}</Badge>
        )
      ) : null}
    </>
  );

  /**
   * JSX to show form and button if user clicks accept to a request.
   */
  const ShowProcessing = (
    <>
      <Form className={`${formStyles.Form} mt-3 w-100`}>
        <Form.Group
          className="mb-2 d-flex flex-column"
          controlId="reply_content"
        >
          <Form.Label>Provide instruction to join your group:</Form.Label>
          <div className="d-flex flex-column w-100">
            <Form.Control
              className={`${formStyles.Form} mb-0`}
              as="textarea"
              placeholder="Example: Join our discord server: discord.gg/000000."
              name="reply_content"
              value={reply_content}
              onChange={handleChange}
            />
            <Form.Text className="ms-auto">
              Min: 10 characters. ({charCount}/100)
            </Form.Text>
          </div>
        </Form.Group>

        {/* Error messages for content field*/}
        {errors.reply_content?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))}

        {/* Error messages for no fields.*/}
        {errors.non_field_errors?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))}

        <Form.Group className="d-flex justify-content-center">
          {showAccRejSpinner ? (
            <LoadSpinner />
          ) : (
            <Button variant="success" onClick={handleConfirmAccept}>
              Confirm Accept
            </Button>
          )}
        </Form.Group>
      </Form>
    </>
  );

  /**
   * JSX to show accepted alert once user has confirmed acceptance of a request.
   */
  const ShowAcceptedAlert = (
    <>
      {/*Success messages received from API.*/}
      {showSuccessMsg && (
        <Alert variant="success" className="mt-3 mb-0">
          Accepted
        </Alert>
      )}
    </>
  );

  /**
   * JSX to show request to join group.
   */
  const ShowRequest = (
    <>
      <Table bordered striped hover variant="dark" className={'mb-1'}>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {applications.results?.length > 0 && (
            <>
              <tr>
                <td>
                  <Link
                    to={`/profile/${pageData.ownerID}`}
                    preventScrollReset={true}
                    target={'_blank'}
                  >
                    {pageData.owner}
                  </Link>
                </td>
                <td>{pageData.role}</td>
                <td>
                  <RankBadge rank={pageData.rank} />
                </td>
              </tr>
              <tr>
                <td colSpan={3}>{pageData.content}</td>
              </tr>
              <tr>
                <td colSpan={3} align="center">
                  {pageData.status === 'Awaiting'
                    ? ShowAcceptRejectBtns
                    : ShowStatus}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </>
  );

  return (
    <>
      {/**
       * Open modal button, that also shows number of requests for slot.
       * If 0 requests the button will be disabled.
       * */}
      {showButtonSpinner ? (
        <LoadSpinner />
      ) : applications.count === 0 ? (
        /*Disabled Button*/
        <Button
          variant="light"
          className={`${btnStyles.Single} w-100`}
          disabled
        >
          <Badge bg="danger">{applications.count}</Badge>
        </Button>
      ) : (
        /*Enabled Button*/
        <Button
          variant="light"
          className={`${btnStyles.Single} w-100`}
          onClick={handleShow}
        >
          <Badge bg="danger">{applications.count}</Badge>
        </Button>
      )}

      {/*Modal*/}
      <Modal show={show} onHide={handleClose} id={'my-modal'}>
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Request review</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={`${modalStyles.Body} d-flex flex-column align-items-center`}
        >
          {showRequestSpinner ? <LoadSpinner /> : ShowRequest}
          {showProcessing && ShowProcessing}
          {showSuccessMsg && ShowAcceptedAlert}
          {!showRequestSpinner && showPagination
            ? applications.count <= 10
              ? ShowPages10
              : ShowPages11Up
            : ''}
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
  );
};

ApplicationReviews.propTypes = {
  slotData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ApplicationReviews;

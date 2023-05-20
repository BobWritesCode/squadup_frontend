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
import tableStyles from '../../styles/Table.module.css';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import formStyles from '../../styles/Forms.module.css';

const ApplicationReviews = (props) => {
  const { slotData } = props;

  const currentUser = useCurrentUser();

  const [applications, setApplications] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasLoaded2, setHasLoaded2] = useState(true);
  const [pageDataHasLoaded, setPageDataHasLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({});
  // Use to display character count under note input
  const [charCount, setCharCount] = useState('');
  // Use to toggle success alert on confirmed request accept.
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  // Use to toggle show accept form
  const [showProcessing, setShowProcessing] = useState(false);
  // Use to toggle showing spinner instead of Accept & Reject buttons.
  const [showAccRejSpinner, setShowAccRejSpinner] = useState(true);
  const [errors, setErrors] = useState({});
  // Use to control formData in form.
  const [formData, setFormData] = useState({
    reply_content: '',
  });
  const { reply_content } = formData;

  // function to  close modal
  const handleClose = () => {
    setShow(false);
    setHasLoaded(false);
    GetSlotData();
    setPage(0);
    setErrors({});
    // reset status back to blank, so correct modal view is shown.
    setFormData({
      ...formData,
      reply_content: '',
    });
    setShowProcessing(false);
  };

  // function to show modal
  const handleShow = () => {
    setShow(true);
  };

  const GetSlotData = useCallback(() => {
    const fetchData = async () => {
      try {
        // Get applications for this slot
        const [{ data: list }] = await Promise.all([
          axiosReq.get(`/lfg_slots_apply/?slot=${slotData.id}`),
        ]);
        // Set received api data to variable.
        setApplications(list);
      } catch (err) {
        console.log(err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchData();
  }, [slotData.id, setApplications, setHasLoaded]);

  useEffect(() => {
    if (currentUser) {
      GetSlotData();
    }
  }, [currentUser, GetSlotData]);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setErrors({});
        // remove success message from DOM.
        setShowSuccessMsg(false);
        // remove accept form from DOM.
        setShowProcessing(false);
        try {
          const { data } = await axiosReq.get(
            `/lfg_slots_apply_pagination/?limit=1&offset=${page}`,
          );
          setPageData(data.results[0]);
        } catch (err) {
          setErrors(err.response?.data);
        } finally {
          setPageDataHasLoaded(true);
        }
      };
      fetchData();
    }
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
    setShowAccRejSpinner(false);
    // disable inputs until api response.
    disableInputs(true);

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
      setShowAccRejSpinner(true);
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

  const handleReject = async (event) => {
    event.preventDefault();
    // show spinner until receive api response.
    setShowAccRejSpinner(false);
    setErrors({});
    // disableInputs(true);
    try {
      const apiData = new FormData();
      apiData.append('status', 'Rejected');
      await axiosReq.patch(`/lfg_slots_apply_update/${pageData.id}/`, apiData);
      setPageData({
        ...pageData,
        status: 'Rejected',
      });
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      // disableInputs(false);
    } finally {
      // remove spinner.
      setShowAccRejSpinner(true);
    }
  };

  const Pages10 = applications.results?.length > 0 && (
    <Pagination className="mt-2">
      {page === 0 ? (
        <Pagination.Prev disabled onClick={() => {}} />
      ) : (
        <Pagination.Prev onClick={() => setPage(page - 1)} />
      )}
      {Array(applications.results.length)
        .fill()
        .map((_, i) =>
          page === i ? (
            <Pagination.Item key={i} active onClick={() => setPage(i)}>
              {i + 1}
            </Pagination.Item>
          ) : (
            <Pagination.Item key={i} onClick={() => setPage(i)}>
              {i + 1}
            </Pagination.Item>
          ),
        )}
      {page === applications.results.length - 1 ? (
        <Pagination.Next disabled onClick={() => setPage(() => {})} />
      ) : (
        <Pagination.Next onClick={() => setPage(page + 1)} />
      )}
    </Pagination>
  );

  const Pages11Up = (
    <Pagination className={`mt-4 ${paginationStyles.Page}`}>
      {/* Prev page */}
      {page <= 0 ? (
        <Pagination.Prev disabled onClick={() => {}} />
      ) : (
        <Pagination.Prev onClick={() => setPage(page - 1)} />
      )}

      {/* First page number */}
      {page === 0 ? (
        <Pagination.Item active onClick={() => setPage(0)}>
          {1}
        </Pagination.Item>
      ) : (
        <Pagination.Item onClick={() => setPage(0)}>{1}</Pagination.Item>
      )}

      <Pagination.Ellipsis disabled />

      {page >= 0 && page <= 3 ? (
        <>
          {/* Set up pagination 2-6, if the current page is 4 or less */}
          {Array(5)
            .fill()
            .map((_, i) =>
              page === i + 1 ? (
                <Pagination.Item
                  key={i + 1}
                  active
                  onClick={() => setPage(i + 1)}
                >
                  {i + 2}
                </Pagination.Item>
              ) : (
                <Pagination.Item key={i + 1} onClick={() => setPage(i + 1)}>
                  {i + 2}
                </Pagination.Item>
              ),
            )}
        </>
      ) : page >= applications.count - 3 && page <= applications.count ? (
        <>
          {/* Set up pagination last-5 to last-1, if the page is within 3 of the end */}
          {Array(5)
            .fill()
            .map((_, i) =>
              page === applications.count - 6 + i ? (
                <Pagination.Item
                  key={applications.count - 6 + i}
                  active
                  onClick={() => setPage(applications.count - 6 + i)}
                >
                  {applications.count - 5 + i}
                </Pagination.Item>
              ) : (
                <Pagination.Item
                  key={applications.count - 6 + i}
                  onClick={() => setPage(applications.count - 6 + i)}
                >
                  {applications.count - 5 + i}
                </Pagination.Item>
              ),
            )}
        </>
      ) : (
        <>
          <Pagination.Item onClick={() => setPage(page - 2)}>
            {page - 1}
          </Pagination.Item>
          <Pagination.Item onClick={() => setPage(page - 1)}>
            {page}
          </Pagination.Item>
          <Pagination.Item active>{page + 1}</Pagination.Item>
          <Pagination.Item onClick={() => setPage(page + 1)}>
            {page + 2}
          </Pagination.Item>
          <Pagination.Item onClick={() => setPage(page + 2)}>
            {page + 3}
          </Pagination.Item>
        </>
      )}

      <Pagination.Ellipsis disabled />

      {/* Final page number */}
      {page === applications.count - 1 ? (
        <Pagination.Item active onClick={() => setPage(applications.count - 1)}>
          {applications.count}
        </Pagination.Item>
      ) : (
        <Pagination.Item onClick={() => setPage(applications.count - 1)}>
          {applications.count}
        </Pagination.Item>
      )}

      {/* Next page */}
      {page >= applications.count - 1 ? (
        <Pagination.Next disabled onClick={() => setPage(() => {})} />
      ) : (
        <Pagination.Next onClick={() => setPage(page + 1)} />
      )}
    </Pagination>
  );

  /**
   * JSX for Accept and Reject button under each request in modal.
   */
  const ShowAcceptRejectBtns = (
    <>
      {!showAccRejSpinner ? (
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
      {pageData.status === 'Rejected' ? (
        <Badge bg="danger">{pageData.status}</Badge>
      ) : pageData.status === 'Complete form below' ? (
        <Badge bg="warning">Complete form below</Badge>
      ) : (
        <Badge bg="success">{pageData.status}</Badge>
      )}
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
            <Form.Text className="ms-auto">({charCount}/100)</Form.Text>
          </div>
        </Form.Group>

        {/* Error messages for content field*/}
        {errors.content?.map((message, idx) => (
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
          <Button variant="success" onClick={handleConfirmAccept}>
            Confirm Accept
          </Button>
        </Form.Group>
      </Form>
    </>
  );

  /**
   * JSX to show accepted alert once user has confirmed acceptance of a request.
   */
  const ShowAcceptedAlert =
    /*Success messages received from API.*/
    showSuccessMsg && (
      <Alert variant="success" className="mt-3 mb-0">
        Accepted
      </Alert>
    );

  /**
   * JSX to show request to join group.
   */
  const ShowRequest = (
    <>
      <Table
        bordered
        striped
        hover
        variant="dark"
        className={`${tableStyles} mb-1`}
      >
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
      {applications.count === 0 ? (
        <Button
          variant="light"
          className={`${btnStyles.Single} w-100`}
          disabled
        >
          <Badge bg="danger">{applications.count}</Badge>
        </Button>
      ) : (
        <Button
          variant="light"
          className={`${btnStyles.Single} w-100`}
          onClick={handleShow}
        >
          <Badge bg="danger">{applications.count}</Badge>
        </Button>
      )}

      <Modal show={show} onHide={handleClose} id={'my-modal'}>
        <Modal.Header className={modalStyles.Header}>
          <Modal.Title>Request review</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={`${modalStyles.Body} d-flex flex-column align-items-center`}
        >
          {pageDataHasLoaded ? ShowGroup : <LoadSpinner />}
          {pageDataHasLoaded
            ? applications.count <= 10
              ? Pages10
              : Pages11Up
            : ''}
        </Modal.Body>

        <Modal.Footer className={modalStyles.Footer}>
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

export default ApplicationReviews;

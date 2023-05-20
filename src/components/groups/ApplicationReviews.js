import React, { useEffect, useState } from 'react';
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
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  // function to  close modal
  const handleClose = () => {
    setShow(false);
    setHasLoaded(false);
    setErrors({});
    // reset status back to blank, so correct modal view is shown.
    setFormData({
      ...formData,
    });
  };

  // function to show modal
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          // Get applications for this slot
          const [{ data: list }] = await Promise.all([
            axiosReq.get(
              `/lfg_slots_apply/?slot=${slotData.id}&status=Awaiting`,
            ),
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
    }
  }, [currentUser, slotData]);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setErrors({});
        setPageDataHasLoaded(false);
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
  }, [currentUser, page]);

  // Handle accept button press
  const handleAccept = async (event) => {
    event.preventDefault();
    setHasLoaded2(false);
    setErrors({});
    // disableInputs(true);
    try {
      const apiData = new FormData();
      apiData.append('status', 'Accepted');
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
      setHasLoaded2(true);
    }
  };

  // Handle reject button press
  const handleReject = async (event) => {
    event.preventDefault();
    setHasLoaded2(false);
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
      setHasLoaded2(true);
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

  const ShowAcceptRejectBtns = (
    <>
      {!hasLoaded2 ? (
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

  const ShowStatus = (
    <>
      {pageData.status === 'Rejected' ? (
        <Badge bg="danger">{pageData.status}</Badge>
      ) : (
        <Badge bg="success">{pageData.status}</Badge>
      )}
    </>
  );

  const ShowGroup = (
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

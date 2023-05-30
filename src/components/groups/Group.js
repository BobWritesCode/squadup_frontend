import React, { useEffect, useState } from 'react';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import RankBadge from '../utils/RankBadge';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import LoadSpinner from '../Spinner';
import GroupSlot from './GroupSlot';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import tableStyles from '../../styles/Table.module.css';

const Group = (props) => {
  const { onDelete, group } = props;
  // Get current user.
  const currentUser = useCurrentUser();
  // Use to store slots array
  const [slots, setSlots] = useState({});
  // Use to show spinner while waiting for API result
  const [showSpinner, setShowSpinner] = useState(false);
  // Use to show group deleted messaged if deleted
  const [showGroupDeleted, setShowGroupDeleted] = useState(false);
  // Check to see if viewing user is profile owner.
  const is_owner = currentUser?.username === group?.owner;

  const handleDisbandGroup = async (groupID) => {
    setShowSpinner(true);
    try {
      // Delete group from database
      await axiosReq.delete(`/lfg/${groupID}`);
      setShowGroupDeleted(true);
    } catch { /* empty */ } finally {
      // Hide spinner
      setShowSpinner(false);
      // Hides self after time expires.
      setTimeout(function () {
        onDelete();
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get slots for this group
        const { data } = await axiosReq.get(`/lfg_slots/?lfg=${group.id}`);
        // Set received api data to variable.
        setSlots(data);
      } catch {
        /* empty */
      } finally {
        /* empty */
      }
    };
    fetchData();
  }, [group]);

  const DisbandButton = (
    <>
      {!showSpinner ? (
        is_owner && (
          <Button
            className={`${btnStyles.Single} ${btnStyles.Danger} mb-0 ms-auto`}
            onClick={() => handleDisbandGroup(group.id)}
          >
            <i className="bi bi-trash"></i> Disband
          </Button>
        )
      ) : (
        <LoadSpinner />
      )}
    </>
  );

  const ShowSmallScreenSlots = (
    <>
      <div className="d-md-none">
        {!slots.results ? (
          <div className="d-flex flex-column mb-2 justify-content-center text-center">
            <LoadSpinner />
            <p>Getting group slots...</p>
          </div>
        ) : (
          <Table hover variant="dark" className={'mb-1'}>
            <tbody>
              {slots.results?.map((gs) => (
                <GroupSlot key={gs.id} slotData={gs} />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );

  const ShowLargeScreenSlots = (
    <>
      <div className="d-none d-md-block">
        {!slots.results ? (
          <div className="d-flex flex-column mb-2 justify-content-center text-center">
            <LoadSpinner />
            <p>Getting group slots...</p>
          </div>
        ) : (
          <Table bordered striped hover variant="dark" className={'mb-1'}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Role</th>
                <th>Info</th>
                <th>{is_owner ? 'Applications' : 'Apply'}</th>
              </tr>
            </thead>
            <tbody>
              {slots.results?.map((gs) => (
                <GroupSlot key={gs.id} slotData={gs} />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );

  const ShowSmallScreenHeader = (
    <>
      <Table
        bordered
        striped
        hover
        variant="dark"
        className={'mb-1 d-table d-md-none'}
      >
        <thead>
          <tr>
            <th>#</th>
            <th colSpan={1} className="w-50">
              Type
            </th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{group.id}</td>
            <td colSpan={1}>{group.game_type}</td>
            <td>
              <RankBadge rank={group.lowest_rank} width={'30px'} />
              <i className="bi bi-arrow-right"></i>
              <RankBadge rank={group.highest_rank} width={'30px'} />
            </td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th>Size</th>
            <th colSpan={2}>Leader</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{group.max_team_size}</td>
            <td colSpan={2} className="text-break">
              <Link
                to={`/profile/${group.owner_id}`}
                preventScrollReset={true}
                target={'_blank'}
                className={`${tableStyles.Link}`}
              >
                {group.owner}
              </Link>
            </td>
          </tr>
          {!group.content && (
            <tr>
              <td colSpan="6">{group.content}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );

  const ShowLargeScreenHeader = (
    <>
      <Table
        bordered
        striped
        hover
        variant="dark"
        className={'mb-1 d-none d-md-table'}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Leader</th>
            <th>Game Type</th>
            <th>Group Size</th>
            <th>Min Rank</th>
            <th>Max Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{group.id}</td>
            <td className="text-break">
              <Link
                to={`/profile/${group.owner_id}`}
                preventScrollReset={true}
                target={'_blank'}
                className={`${tableStyles.Link}`}
              >
                {group.owner}
              </Link>
            </td>
            <td>{group.game_type}</td>
            <td>{group.max_team_size}</td>
            <td>
              <RankBadge rank={group.lowest_rank} width={'30px'} />
            </td>
            <td>
              <RankBadge rank={group.highest_rank} width={'30px'} />
            </td>
          </tr>
          {group.content && (
            <tr>
              <td colSpan="6">{group.content}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
  const ShowGroup = () => (
    <>
      <div>
        <div className="d-flex">
          {ShowLargeScreenHeader}
          {ShowSmallScreenHeader}
        </div>
        <div className="d-flex"></div>
        {ShowLargeScreenSlots}
        {ShowSmallScreenSlots}
      </div>
      <div className="d-flex w-100">{DisbandButton}</div>
    </>
  );

  return (
    <div
      id={`lfg-slot-${group.id}`}
      key={group.id}
      className={`${appStyles.InnerBox} mb-0 d-flex flex-column`}
    >
      {
        // Show message if group deleted
        showGroupDeleted ? (
          <Alert key={'danger'} variant={'danger'} className="mb-0">
            Group deleted.
          </Alert>
        ) : (
          ShowGroup(group)
        )
      }
    </div>
  );
};

Group.propTypes = {
  group: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Group;

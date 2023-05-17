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

const Group = (props) => {
  const { onDelete, group } = props;

  const currentUser = useCurrentUser();

  const [slots, setSlots] = useState({});
  // Show spinner while waiting for API result
  const [showSpinner, setShowSpinner] = useState(false);
  // Show group deleted messaged if deleted
  const [showGroupDeleted, setShowGroupDeleted] = useState(false);

  // Check to see if viewing user is profile owner.
  const is_owner = currentUser?.username === group?.owner;

  const GameType = (gameType) => {
    switch (gameType) {
      case '1':
        return 'Competitive';
      case '2':
        return 'Tournament';
      case '3':
        return 'Casual';
      default:
        return 'error';
    }
  };

  const handleDisbandGroup = async (groupID) => {
    setShowSpinner(true);
    try {
      // Delete group from database
      await axiosReq.delete(`/lfg/${groupID}`);
      setShowGroupDeleted(true);
    } catch (err) {
      console.log('Error while deleting group.');
    } finally {
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
      } finally {
      }
    };
    fetchData();
  }, [group]);

  const ShowGroup = (group) => (
    <>
      <div>
        <div className="d-flex">
          <Table bordered striped hover variant="dark" className={`mb-1`}>
            <thead>
              <tr>
                <th>ID</th>
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
                <td>{group.owner}</td>
                <td>{GameType(group.game_type)}</td>
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
        </div>
        <div className="d-flex"></div>
        <div>
          {!slots.results ? (
            <div className="d-flex flex-column mb-2 justify-content-center text-center">
              <LoadSpinner />
              <p>Getting group slots...</p>
            </div>
          ) : (
            <Table bordered striped hover variant="dark" className={`mb-1`}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Info</th>
                  <th>Apply</th>
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
      </div>
      <div className="d-flex w-100">
        {!showSpinner ? (
          is_owner && <Button
            className={`${btnStyles.Single} ${btnStyles.Danger} mb-0 ms-auto`}
            onClick={() => handleDisbandGroup(group.id)}
          >
            <i className="bi bi-trash"></i> Disband
          </Button>
        ) : (
          <LoadSpinner />
        )}
      </div>
    </>
  );

  return (
    <div
      id={`lfg-slot-${group.id}`}
      key={group.id}
      className={`${appStyles.InnerBox} mb-3 d-flex flex-column`}
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

export default Group;

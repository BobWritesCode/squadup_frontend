import React, { useState } from 'react';
import { axiosReq } from '../../contexts/CurrentUserContext';
import RankBadge from '../utils/RankBadge';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import LoadSpinner from '../Spinner';

const UserLFGSlot = (props) => {
  const { onDelete, group } = props;

  // Show spinner while waiting for API result
  const [showSpinner, setShowSpinner] = useState(false);
  // Show group deleted messaged if deleted
  const [showGroupDeleted, setShowGroupDeleted] = useState(false);

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

  const ShowSlot = (group) => (
    <>
      <div>
        <div className="d-flex">
          <p className="mb-1">ID: {group.id}</p>
          <p className="ms-4 mb-1">Type: {GameType(group.game_type)}</p>
          <p className="ms-4 mb-1">
            Min Rank: <RankBadge rank={group.lowest_rank} width={'30px'} />
          </p>
          <p className="ms-4 mb-1">
            Max Rank: <RankBadge rank={group.highest_rank} width={'30px'} />
          </p>
        </div>
        <div className="d-flex"></div>
        <div>
          Team:
          {Array(group.current_team_size)
            .fill()
            .map((_, i) => (
              <i key={i} className="bi bi-person-fill"></i>
            ))}
          {Array(group.max_team_size - group.current_team_size)
            .fill()
            .map((_, i) => (
              <i key={i} className="bi bi-person"></i>
            ))}
        </div>
        <div>
          <p>{group.content}</p>
        </div>
      </div>
      <div className="w-100">
        {!showSpinner ? (
          <Button
            className={`${btnStyles.Single} ${btnStyles.Danger} mb-0 w-100`}
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
          ShowSlot(group)
        )
      }
    </div>
  );
};

export default UserLFGSlot;

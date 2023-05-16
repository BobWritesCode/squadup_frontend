import React, { useEffect, useState } from 'react';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import RankBadge from '../utils/RankBadge';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import { Button } from 'react-bootstrap';

const OwnLFGs = () => {
  const currentUser = useCurrentUser();
  // Show spinner while waiting for API result
  const [hasLoaded, setHasLoaded] = useState(false);
  const [groups, setGroups] = useState({ results: [] });
  // set up variables for errors from request.
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get posts for user.
        const { data } = await axiosReq.get(`/lfg/?owner=${currentUser.pk}`);
        // Set received api data to variable.
        setGroups(data);
      } catch (err) {
        setErrors(err);
      } finally {
        // Remove spinner
        setHasLoaded(true);
      }
    };
    fetchData();
  }, [currentUser]);
  return (
    <>
      {
        // Show spinner while waiting for results
        !hasLoaded && <LoadSpinner />
      }
      {groups.results.map((group) => (
        <div
          key={group.id}
          className={`${appStyles.InnerBox} mb-3 d-flex flex-column`}
        >
          <div>
            <div className="d-flex">
              <p>Group ID: {group.id}</p>
              <p className="ms-4">Type: {GameType(group.game_type)}</p>
            </div>
            <div className="d-flex">
              <p>
                Min Rank: <RankBadge rank={group.lowest_rank} width={'30px'} />
              </p>
              <p className="ms-4">
                Max Rank: <RankBadge rank={group.highest_rank} width={'30px'} />
              </p>
            </div>
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
            <Button
              className={`${btnStyles.Single} ${btnStyles.Danger} mb-2 w-100`}
              onClick={''}
            >
              <i className="bi bi-trash"></i> Disband
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};

export default OwnLFGs;

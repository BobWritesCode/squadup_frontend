import React, { useEffect, useState } from 'react';
import appStyles from '../../App.module.css';
import UserNoteUpdate from './UserNoteUpdate';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import { useParams } from 'react-router-dom';

const UserNote = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [userNote, setUserNote] = useState({});

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          const { data } = await axiosReq.get(
            `/usernotes/?owner=${currentUser.pk}&target_user=${id}`,
          );
          setUserNote(data.results[0]);
        } catch (err) {
          console.log(err);
        } finally {
          setHasLoaded(true);
        }
      };
      fetchData();
    }
  }, [currentUser, id]);

  const handleUserNoteChange = (e) => {
    setUserNote(e);
  };

  return (
    <>
      <div className={` ${appStyles.Box}`}>
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            <h3 className="text-break">Note</h3>
            {!hasLoaded ? (
              ''
            ) : (
              <UserNoteUpdate
                onUserNoteChange={handleUserNoteChange}
                userNote={userNote}
              />
            )}
          </div>
          {!hasLoaded ? (
            <LoadSpinner />
          ) : (
            <p className={`${appStyles.OrangeText} text-break`}>
              {userNote.content}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserNote;

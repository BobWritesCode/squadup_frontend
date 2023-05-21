import React, { useEffect, useState } from 'react';
import appStyles from '../../App.module.css';
import UserNoteUpdate from './UserNoteUpdate';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import { useParams } from 'react-router-dom';

const UserNote = () => {
  // Get url params
  const { id } = useParams();
  // Get current user logged in.
  const currentUser = useCurrentUser();
  // Use to show spinner while waiting for data from API
  const [hasLoaded, setHasLoaded] = useState(false);
  // Use to store form data.
  const [userNote, setUserNote] = useState({
    id: null,
    content: '',
  });

  /**
   * Calls API to get data using filters. If data found set to variable.
   */
  useEffect(() => {
    // Checks for logged in user.
    if (currentUser) {
      const fetchData = async () => {
        try {
          // Make API call with filter options.
          const { data } = await axiosReq.get(
            `/usernotes/?owner=${currentUser.pk}&target_user=${id}`,
          );
          // If results found update variable.
          if (data.results.length > 0) {
            setUserNote(data.results[0]);
          }
        } catch (err) {
          // Show errors in console.
          console.log(err);
        } finally {
          // Remove spinner.
          setHasLoaded(true);
        }
      };
      fetchData();
    }
  }, [currentUser, id]);

  /**
   * Allow user to edit form.
   * @param {*} e
   */
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
              {userNote.content !== '' ? (
                userNote.content
              ) : (
                <em>You have not left a note on this profile yet</em>
              )}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserNote;

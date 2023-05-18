import React, { useContext, useEffect, useState } from 'react';
import appStyles from '../../App.module.css';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import ApplicationTable from './ApplicationTable';
import myApplicationsSignalContext from '../../contexts/myApplicationsSignalContext';

const MyApplications = () => {
  // Context to force refresh when signal received.
  const { myApplicationsSignal, setMyApplicationsSignal } = useContext(
    myApplicationsSignalContext,
  );

  const currentUser = useCurrentUser();
  // Show spinner while waiting for API result
  const [hasLoaded, setHasLoaded] = useState(false);
  const [applications, setApplications] = useState({ results: [] });

  const [update, setUpdate] = useState(true);
  const handleOnUpdate = () => {
    setUpdate(!update);
    setMyApplicationsSignal(!myApplicationsSignal);
  };

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          // Get all applications for current user
          const { data } = await axiosReq.get(
            `/lfg_slots_apply/?owner=${currentUser.pk}`,
          );
          // Set received api data to variable.
          setApplications(data);
        } catch (err) {
          console.log('Error: Unexpected error.');
        } finally {
          // Remove spinner
          setHasLoaded(true);
        }
      };
      fetchData();
    }
  }, [currentUser, update, myApplicationsSignal]);

  const ShowApplications = (
    <>
      {!applications.results?.length === 0 ? (
        <p>
          <em>No current applications to show.</em>
        </p>
      ) : (
        <ApplicationTable
          applications={applications.results}
          onUpdate={handleOnUpdate}
        />
      )}
    </>
  );

  return (
    <div className={`${appStyles.Box} d-flex flex-column`}>
      <h3>My Applications</h3>
      <p>You can have up to 5 applications open at a time.</p>
      {hasLoaded ? ShowApplications : <LoadSpinner />}
    </div>
  );
};

export default MyApplications;

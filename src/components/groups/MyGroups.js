import React, { useEffect, useState } from 'react';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import Group from './Group';
import CreateGroup from './CreateGroup';

const MyGroups = () => {
  const currentUser = useCurrentUser();
  // Show spinner while waiting for API result
  const [hasLoaded, setHasLoaded] = useState(false);
  const [groups, setGroups] = useState({ results: [] });

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          // Get groups for user.
          const { data } = await axiosReq.get(`/lfg/?owner=${currentUser.pk}`);
          // Set received api data to variable.
          setGroups(data);
        } catch (err) {
          console.log('Error: Unexpected error.');
        } finally {
          // Remove spinner
          setHasLoaded(true);
        }
      };
      fetchData();
    }
  }, [currentUser]);

  // Add new group to list when created.
  const handleNewGroup = async (slot_id) => {
    try {
      // Get latest post for user from server.
      const { data } = await axiosReq.get(`/lfg/${slot_id}`);
      // Convert json string into obj.
      const jsonGroup = JSON.parse(data.LFG);
      const newGroup = jsonGroup[0].fields;
      // Adding missing fields to object.
      newGroup.id = jsonGroup[0].pk;
      // Add obj to existing obj array.
      setGroups((prevGroups) => ({
        ...prevGroups,
        results: [newGroup, ...prevGroups.results],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteGroup = (groupId) => {
    // remove deleted group from list
    // first create a copy
    const copyOfGroup = { ...groups };
    // find index of item to be removed
    const index = copyOfGroup.results.findIndex((obj) => obj.id === groupId);
    // remove it
    copyOfGroup.results.splice(index, 1);
    // set new group
    setGroups({ ...groups, results: copyOfGroup.results });
  };

  return (
    <>
      {
        // Show spinner while waiting for results
        !hasLoaded ? (
          <LoadSpinner />
        ) : // Check user has only one group open
        groups.results?.length < 1 ? (
          <CreateGroup onNewGroup={handleNewGroup} />
        ) : (
          <p>You can have one open group at a time.</p>
        )
      }
      {groups.results.length > 0 &&
        groups.results.map((group, index) => (
          <Group
            key={group.id}
            group={group}
            onDelete={() => handleDeleteGroup(group.id)}
          />
        ))}
    </>
  );
};

export default MyGroups;

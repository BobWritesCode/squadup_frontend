import React, { useEffect, useState } from 'react';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import Group from './Group';
import InfiniteScroll from 'react-infinite-scroll-component';
import appStyles from '../../App.module.css';
import { fetchMoreData } from '../../utils/utils';

const GroupList = () => {
  const currentUser = useCurrentUser();
  // Show spinner while waiting for API result
  const [hasLoaded, setHasLoaded] = useState(false);
  const [groups, setGroups] = useState({ results: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all groups that status is true (open)
        const { data } = await axiosReq.get(`/lfg/?status=true`);
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
  }, [currentUser]);

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

  const FullGroupList = () => (
    <InfiniteScroll
      className={appStyles.NoScrollBars}
      children={groups.results.map((g) => {
        if (g.owner !== currentUser.username && g.status) {
          return (
            <Group
              key={g.id}
              {...g}
              setGroups={setGroups}
              group={g}
              onDelete={() => handleDeleteGroup(g.id)}
            />
          );
        }
        return null;
      })}
      dataLength={groups.results.length}
      loader={<LoadSpinner />}
      hasMore={!!groups.next}
      next={() => fetchMoreData(groups, setGroups)}
      endMessage={<p style={{ textAlign: 'center' }}>No more groups to see.</p>}
    />
  );

  return (
    <>
      <div className={`${appStyles.Box}`}>
        <h3>Open Groups</h3>
        <p>
          <em>excludes any groups you own.</em>
        </p>
        {
          // Show spinner while waiting for results
          !hasLoaded ? <LoadSpinner /> : FullGroupList()
        }
      </div>
    </>
  );
};

export default GroupList;

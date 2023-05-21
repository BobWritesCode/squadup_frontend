import React, { useEffect, useState } from 'react';
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadSpinner from '../Spinner';
import Group from './Group';
import InfiniteScroll from 'react-infinite-scroll-component';
import appStyles from '../../App.module.css';
import { fetchMoreData } from '../../utils/utils';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import formStyles from '../../styles/Forms.module.css';

const GroupList = () => {
  // Get current user.
  const currentUser = useCurrentUser();
  // Show spinner while waiting for API result
  const [hasLoaded, setHasLoaded] = useState(false);
  // Use to create URL for api call
  const [url, setUrl] = useState({
    start: '/lfg/?status=true',
    game_type: '',
  });
  // Use to store groups returned by API.
  const [groups, setGroups] = useState({ results: [] });
  // Use to any expected errors as alerts.
  const [errors, setErrors] = useState({});
  // Use to store data and control filters.
  const [searchFormData, setSearchFormData] = useState({
    game_type: '0',
    role: 'Any',
    lowest_rank: 0,
    highest_rank: 9,
  });

  /**
   * Allow user to edit form.
   * @param {*} e
   */
  const handleChange = (e) => {
    setSearchFormData({
      ...searchFormData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * This effect creates the string for the game_type to use in the API URL.
   */
  useEffect(() => {
    setUrl((prevUrl) => {
      let game_type = '';
      // Add game_type filter.
      if (searchFormData.game_type !== '0') {
        game_type = `&game_type=${searchFormData.game_type}`;
      }
      const newUrl = {
        ...prevUrl,
        game_type: game_type,
      };
      return newUrl;
    });
  }, [searchFormData.game_type, setUrl]);

  /**
   * This effect creates the string for the highest_rank to use in the API URL.
   * The string returns groups with a min rank no lower then the highest rank
   * requested.
   */
  useEffect(() => {
    setUrl((prevUrl) => {
      let lowest_rank = '';
      lowest_rank = `&highest_rank__gte=${searchFormData.lowest_rank}`;
      // }
      const newUrl = {
        ...prevUrl,
        lowest_rank: lowest_rank,
      };
      return newUrl;
    });
  }, [searchFormData.lowest_rank, setUrl]);

  /**
   * This effect creates the string for the lowest_rank to use in the API URL.
   * The string returns groups with a max rank no higher then the lowest rank
   * requested.
   */
  useEffect(() => {
    setUrl((prevUrl) => {
      let highest_rank = '';
      highest_rank = `&lowest_rank__lte=${searchFormData.highest_rank}`;
      // }
      const newUrl = {
        ...prevUrl,
        highest_rank: highest_rank,
      };
      return newUrl;
    });
  }, [searchFormData.highest_rank, setUrl]);

  /**
   * This effect makes an API call each time a filter option is changed to get a list of groups that fit the filters selected.
   */
  useEffect(() => {
    const fetchData = async () => {
      // Show spinner
      setHasLoaded(false);
      try {
        // API call to get all groups that status is true, and fit selected user filters.
        const { data } = await axiosReq.get(
          `${url.start}${url.game_type}${url.lowest_rank}${url.highest_rank}`,
        );
        // Set received api data to variable.
        setGroups(data);
      } catch (err) {
        // Show errors to the console.
        console.log('Error: Unexpected error.');
      } finally {
        // Remove spinner
        setHasLoaded(true);
      }
    };
    fetchData();
  }, [currentUser, url]);

  /**
   * Deletes target group from the database, and removes from the group list results.
   * @param {integer} groupId
   */
  const handleDeleteGroup = (groupId) => {
    // First create an unconnected copy.
    const copyOfGroup = { ...groups };
    // find index of item to be removed
    const index = copyOfGroup.results.findIndex((obj) => obj.id === groupId);
    // Remove it using splice.
    copyOfGroup.results.splice(index, 1);
    // Set new group list.
    setGroups({ ...groups, results: copyOfGroup.results });
  };

  /**
   * JSX to groups within an infinite scroll  component.
   */
  const ShowFullGroupList = (
    <>
      {searchFormData.highest_rank >= searchFormData.lowest_rank && (
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
          endMessage={
            <p style={{ textAlign: 'center' }}>No more groups to see.</p>
          }
        />
      )}
    </>
  );

  /**
   * JSX to should filter and search options for groups.
   */
  const ShowFilterSearchOptions = (
    <>
      <div className={`${appStyles.InnerBox} mt-2 mb-3`}>
        <h5>Filters:</h5>

        <Form className={`${formStyles.Form} d-flex flex-column`}>
          <div className={`d-flex flex-row w-100 `}>
            <div className={`d-flex flex-column flex-md-row w-50`}>
              <Form.Group
                className="d-flex flex-column w-100 w-md-50"
                controlId="game_type"
              >
                <Form.Label>Game Types:</Form.Label>
                <Form.Select
                  className={`${formStyles.Form}`}
                  aria-label="Select game type."
                  name="game_type"
                  value={searchFormData.game_type}
                  onChange={handleChange}
                >
                  <option value={0}>Any</option>
                  <option value={1}>Competitive</option>
                  <option value={2}>Tournament</option>
                  <option value={3}>Casual</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="ms-0 ms-md-3 d-flex flex-column w-100 w-md-50"
                controlId="role"
              >
                <Form.Label>Role type:</Form.Label>
                <Form.Select
                  className=""
                  aria-label="Select desired player role"
                  name="role"
                  value={searchFormData.role}
                  onChange={handleChange}
                >
                  <option value="Any">Any</option>
                  <option value="Duelist">Duelist</option>
                  <option value="Controller">Controller</option>
                  <option value="Initiator">Initiator</option>
                  <option value="Sentinel">Sentinel</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className={`d-flex flex-column flex-md-row w-50`}>
              <Form.Group
                className="ms-3 d-flex flex-column w-100 w-md-50  pe-3 pe-md-0"
                controlId="lowest_rank"
              >
                <Form.Label>Minimum rank:</Form.Label>
                <Form.Select
                  aria-label="Select minimum player rank"
                  name="lowest_rank"
                  value={searchFormData.lowest_rank}
                  onChange={handleChange}
                >
                  <option value="0">Unranked</option>
                  <option value="1">Iron</option>
                  <option value="2">Bronze</option>
                  <option value="3">Silver</option>
                  <option value="4">Gold</option>
                  <option value="5">Platinum</option>
                  <option value="6">Diamond</option>
                  <option value="7">Ascendant</option>
                  <option value="8">Immortal</option>
                  <option value="9">Radiant</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="ms-3 d-flex flex-column w-100 w-md-50 pe-3 pe-md-0"
                controlId="highest_rank"
              >
                <Form.Label>Maximum rank:</Form.Label>
                <Form.Select
                  aria-label="Select highest rank"
                  name="highest_rank"
                  value={searchFormData.highest_rank}
                  onChange={handleChange}
                >
                  <option value="0">Unranked</option>
                  <option value="1">Iron</option>
                  <option value="2">Bronze</option>
                  <option value="3">Silver</option>
                  <option value="4">Gold</option>
                  <option value="5">Platinum</option>
                  <option value="6">Diamond</option>
                  <option value="7">Ascendant</option>
                  <option value="8">Immortal</option>
                  <option value="9">Radiant</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          {errors.content?.map((m, idx) => (
            <Alert variant="warning" key={idx}>
              {m}
            </Alert>
          ))}

          {searchFormData.highest_rank < searchFormData.lowest_rank && (
            <Alert variant="warning" className="mt-3 p-2">
              Maximum rank needs to be same or higher then minimum rank.
            </Alert>
          )}

          {errors.non_field_errors?.map((message, idx) => (
            <Alert key={idx} variant="warning" className="mt-3">
              {message}
            </Alert>
          ))}
        </Form>
      </div>
    </>
  );

  return (
    <>
      <div className={`${appStyles.Box}`}>
        <div className="d-flex flex-column flex-md-row">
          <h3>Open Groups</h3>
          <p className="ms-0 ms-md-4 mb-1 align-self-start align-self-md-end">
            <em>excludes any groups you own.</em>
          </p>
        </div>
        {ShowFilterSearchOptions}
        {
          // Show spinner while waiting for results
          !hasLoaded ? <LoadSpinner /> : <>{ShowFullGroupList}</>
        }
      </div>
    </>
  );
};

export default GroupList;

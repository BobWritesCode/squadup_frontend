import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//css
import appStyles from '../../App.module.css';
// app imports
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import {
  useProfileData,
  useSetProfileData,
} from '../../contexts/ProfileDataContext';
import Avatar from '../../components/Avatar';
import EmailUpdate from '../../components/profile/EmailUpdate';
import UsernameUpdate from '../../components/profile/UsernameUpdate';
import TrackerUpdate from '../../components/profile/TrackerUpdate';
import AvatarUpdate from '../../components/profile/AvatarUpdate';
import PasswordUpdate from '../../components/profile/PasswordUpdate';
import NewPost from '../../components/posts/NewPost';
import LoadSpinner from '../../components/Spinner';
import UserPosts from '../../components/posts/UserPosts';
import UserNote from '../../components/profile/UserNote';
import { useRedirect } from '../../components/hooks/useRedirect';

const Profile = () => {
  const { id } = useParams();
  useRedirect('loggedIn')

  const { setProfileData } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const currentUser = useCurrentUser();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tracker, setTracker] = useState('');
  const [avatar, setAvatar] = useState('');
  const [latestPost, setLatestPost] = useState('');

  const [profile] = pageProfile.results;

  // Check to see if viewing user is profile owner.
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: r_pageProfile }, { data: r_details }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/profiles/details/${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [r_pageProfile] },
        }));
        setAvatar(r_pageProfile.image);
        setEmail(r_details.email);
        setUsername(r_pageProfile.owner);
        setTracker(r_pageProfile.tracker);
      } catch (err) {
        console.log(err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchData();
  }, [id, avatar, username, setProfileData]);

  // function to update the username state
  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
  };

  // function to update the email state
  const handleEmailChange = (newEmail) => {
    setEmail(newEmail);
  };

  // function to tracker the email state
  const handleTrackerChange = (newTracker) => {
    setTracker(newTracker);
  };

  // function to avatar the email state
  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
  };

  // function to avatar the email state
  const handleNewPost = (newNewPostID) => {
    setLatestPost(newNewPostID);
  };

  const Profile = (
    <>
      {hasLoaded ? (
        <div className={` ${appStyles.Box}`}>
          <div className="d-flex">
            <h3 className="text-break">{username}</h3>
            {is_owner ? (
              <UsernameUpdate onUsernameChange={handleUsernameChange} />
            ) : (
              ''
            )}
          </div>

          {is_owner ? (
            <AvatarUpdate onAvatarChange={handleAvatarChange} avatar={avatar} />
          ) : (
            <Avatar src={avatar} text="" width={'100%'} />
          )}

          <p>
            Member since:
            <span className={`${appStyles.OrangeText} ms-2`}>
              {profile?.created_at ? profile?.created_at : ''}
            </span>
          </p>

          {is_owner ? (
            <>
              <div>
                <p className="">
                  Password:
                  <span className={`${appStyles.OrangeText} ms-2 mb-0`}>
                    *************
                  </span>
                  <PasswordUpdate />
                </p>
              </div>
            </>
          ) : (
            ''
          )}

          {is_owner ? (
            <>
              <div>
                <p className="mb-0">
                  Email:
                  <span className={`${appStyles.OrangeText} ms-2 mb-0`}>
                    {email ? email : 'Please add'}
                  </span>
                  <EmailUpdate onEmailChange={handleEmailChange} />
                </p>
                <p className={appStyles.SecondaryText}>(only visible to you)</p>
              </div>

              <p>
                Email verified:
                <span className={`${appStyles.OrangeText} ms-2`}>
                  {profile?.email_verified ? 'Yes' : 'No'}
                </span>
              </p>
            </>
          ) : (
            ''
          )}

          <p>
            Tracker:
            <span className={`${appStyles.OrangeText} ms-2 text-break`}>
              {tracker ? (
                <a
                  href={`https://tracker.gg/valorant/profile/riot/${tracker}`}
                  target="blank"
                  className={appStyles.Link}
                >
                  Click here to view
                </a>
              ) : (
                ''
              )}
            </span>
            {is_owner ? (
              <TrackerUpdate onTrackerChange={handleTrackerChange} />
            ) : (
              ''
            )}
          </p>
        </div>
      ) : (
        <LoadSpinner />
      )}
    </>
  );

  const postsBlock = (
    <>
      <div className={appStyles.Box}>
        <h3>Posts</h3>
        {is_owner && <NewPost onNewPost={handleNewPost} />}
        <div className="mb-3"></div>
        <UserPosts profileId={id} latestNewPost={latestPost} />
      </div>
    </>
  );

  const mainProfile = (
    <>
      <Row>
        <Col xs={{ order: 'first' }} md={{ order: 'last' }}>
          <Row>
            <Col>{Profile}</Col>
          </Row>
          <Row>
            <Col>
              <UserNote />
            </Col>
          </Row>
        </Col>

        <Col xs={{ order: 'last' }} md={{ order: 'first' }}>
          <Row>
            <Col>{postsBlock}</Col>
          </Row>
        </Col>
      </Row>
    </>
  );

  return (
    <>
      <Row>
        <Col>{hasLoaded ? <>{mainProfile}</> : <LoadSpinner />}</Col>
      </Row>
    </>
  );
};

export default Profile;

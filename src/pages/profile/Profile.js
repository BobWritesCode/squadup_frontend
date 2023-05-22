import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//css
import appStyles from '../../App.module.css';
// app imports
import { axiosReq, useCurrentUser } from '../../contexts/CurrentUserContext';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
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
import ReactTimeago from 'react-timeago';

const Profile = () => {
  const { id } = useParams();
  useRedirect('loggedIn');

  const { setProfileData } = useSetProfileData();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState({
    owner: '',
    email: '',
    tracker: '',
    image: '',
  });
  const { owner, email, tracker, image } = profile;
  const [hasLoaded, setHasLoaded] = useState(false);
  const [latestPost, setLatestPost] = useState('');

  // Check to see if viewing user is profile owner.
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);

        setProfile((prevState) => ({
          ...prevState,
          ...data,
        }));

        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [data] },
        }));
      } catch (err) {
        console.log(err);
      } finally {
        setHasLoaded(true);
      }
    };
    fetchData();
  }, [id, owner, setProfileData, setProfile]);

  // function to update the username state
  const handleUsernameChange = (newUsername) => {
    // setUsername(newUsername);
    setProfile({
      ...profile,
      owner: newUsername,
    });
  };

  // function to update the email state
  const handleEmailChange = (newEmail) => {
    // setEmail(newEmail);
    setProfile({
      ...profile,
      email: newEmail,
    });
  };

  // function to tracker the email state
  const handleTrackerChange = (newTracker) => {
    // setTracker(newTracker);
    setProfile({
      ...profile,
      tracker: newTracker,
    });
  };

  // function to avatar the email state
  const handleAvatarChange = (newAvatar) => {
    // setAvatar(newAvatar);
    setProfile({
      ...profile,
      avatar: newAvatar,
    });
  };

  // function to avatar the email state
  const handleNewPost = (newNewPostID) => {
    setLatestPost(newNewPostID);
  };

  const Profile = (
    <>
      {hasLoaded ? (
        <div className={` ${appStyles.Box}`}>
          <div className="d-flex justify-content-center">
            {is_owner ? (
              <AvatarUpdate
                onAvatarChange={handleAvatarChange}
                avatar={image}
              />
            ) : (
              <Avatar src={image} />
            )}
          </div>
          <div className="d-flex flex-column align-items-start mt-3">
            <h3 className="text-break">
              {owner}
              <span>
                {' '}
                {is_owner ? (
                  <UsernameUpdate onUsernameChange={handleUsernameChange} />
                ) : (
                  ''
                )}
              </span>
            </h3>

            <p className="mt-3">
              Member since:
              {profile?.created_at ? (
                <ReactTimeago
                  date={profile?.created_at}
                  minPeriod={10}
                  className={`${appStyles.OrangeText} ms-2`}
                />
              ) : (
                ''
              )}
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
                  <p className={appStyles.SecondaryText}>
                    (only visible to you)
                  </p>
                </div>
              </>
            ) : (
              ''
            )}

            <p>
              Tracker.gg:
              <span className={`${appStyles.OrangeText} ms-2 text-break`}>
                {tracker ? (
                  <a
                    href={`https://tracker.gg/valorant/profile/riot/${tracker}`}
                    target="blank"
                    className={appStyles.Link}
                  >
                    {tracker}
                  </a>
                ) : (
                  ''
                )}
              </span>
              {is_owner ? (
                <TrackerUpdate onTrackerChange={handleTrackerChange} />
              ) : (
                <em>No tracker ID given yet.</em>
              )}
            </p>
          </div>
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

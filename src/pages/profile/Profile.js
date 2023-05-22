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

const Profile = () => {
  const { id } = useParams();
  useRedirect('loggedIn')

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
      username: newUsername,
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
          <div className="d-flex">
            <h3 className="text-break">{username}</h3>
            {is_owner ? (
                avatar={image}
            ) : (
              <Avatar src={image} />
            )}
          </div>
              {owner}

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

                      {email ? email : 'Please add'}

                {tracker ? (
                    href={`https://tracker.gg/valorant/profile/riot/${tracker}`}
                    {tracker}
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

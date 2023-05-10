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
import UserNoteUpdate from '../../components/profile/UserNoteUpdate';
import NewPost from '../../components/posts/NewPost';
import LoadSpinner from '../../components/Spinner';
import UserPosts from '../../components/posts/UserPosts';

const Profile = (props) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tracker, setTracker] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userNote, setUserNote] = useState('');
  const [latestPost, setLatestPost] = useState('');

  const currentUser = useCurrentUser();
  const { id } = useParams();
  const { setProfileData } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  // Check to see if viewing user is profile owner.
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: r_pageProfile },
          { data: r_userNote },
          { data: r_details },
        ] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/usernotes/${id}`),
          axiosReq.get(`/profiles/details/${id}`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [r_pageProfile] },
        }));
        setUserNote(r_userNote.user_note);
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
  const handleUserNoteChange = (newUserNote) => {
    setUserNote(newUserNote);
  };

  // function to avatar the email state
  const handleNewPost = (newNewPostID) => {
    setLatestPost(newNewPostID);
  };

  const Profile = (
    <>
      { hasLoaded ? (
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
      ) : (<LoadSpinner/>)}
    </>
  );

  const userNoteBlock = (
    <>
      <div className={` ${appStyles.Box}`}>
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            <h4 className="text-break">Note</h4>
            <UserNoteUpdate
              onUserNoteChange={handleUserNoteChange}
              userNote={userNote}
            />
          </div>
          <p className={`${appStyles.OrangeText} text-break`}>{userNote}</p>
        </div>
      </div>
    </>
  );

  const postsBlock = (
    <>
      <Row className="d-flex justify-content-between">
        <Col className={appStyles.Box}>
          <h3>Posts</h3>
          {is_owner && <NewPost onNewPost={handleNewPost} /> }
          <div className="mb-3"></div>
          <UserPosts profileId={id} latestNewPost={latestPost} />
        </Col>
      </Row>
    </>
  );

  const mainProfile = (
    <Row>
      <Col xs="7">{postsBlock}</Col>
      <Col xs="5">
        {Profile}
        <p></p>
        {userNoteBlock}
      </Col>
      {profile?.content && <Col className="p-3">{profile.content}</Col>}
    </Row>
  );

  return (
    <Row>
      <Col className="">
        {hasLoaded ? <>{mainProfile}</> : <LoadSpinner/>}
      </Col>
    </Row>
  );
};

export default Profile;

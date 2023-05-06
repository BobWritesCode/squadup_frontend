import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
//css
import appStyles from '../../App.module.css';
// app imports
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../api/axiosDefaults';
import {
  useProfileData,
  useSetProfileData,
} from '../../contexts/ProfileDataContext';
import Avatar from '../../components/Avatar';
import EmailUpdate from '../../components/profile/EmailUpdate';
import UsernameUpdate from '../../components/profile/UsernameUpdate';
import TrackerUpdate from '../../components/profile/TrackerUpdate';
import AvatarUpdate from '../../components/profile/AvatarUpdate';

const Profile = (props) => {
  const [username, setUsername] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [tracker, setTracker] = useState('');
  const [avatar, setAvatar] = useState('');

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
        const [{ data: pageProfile }, { data: details }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/profiles/details/${id}`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setAvatar(pageProfile.image);
        setEmail(details.email);
        setUsername(pageProfile.owner);
        setTracker(pageProfile.tracker);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
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

  const Profile = (
    <>
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
            <a href={`https://tracker.gg/valorant/profile/riot/${tracker}`} target="blank" className={appStyles.Link}>
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
    </>
  );

  const mainProfile = (
    <Row>
      <Col>
        <Row className="d-flex justify-content-between">
          <Col xs="7" className={appStyles.Box}>
            {Posts}
          </Col>
          <Col xs="4" className={appStyles.Box}>
            {Profile}
          </Col>
        </Row>
      </Col>
      {profile?.content && <Col className="p-3">{profile.content}</Col>}
    </Row>
  );

  return (
    <Row>
      <Col className="">
        {hasLoaded ? <>{mainProfile}</> : <p>Loading...</p>}
      </Col>
    </Row>
  );
};

export default Profile;

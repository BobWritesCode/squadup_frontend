import React, { useEffect, useState } from 'react';
import LoadSpinner from '../../components/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import appStyles from '../../App.module.css';
import UserLFGs from '../../components/lfg/UserLFGs';

const LFG = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const myGroups = (
    <div className={`${appStyles.Box}`}>
      <h3>My Groups</h3>
      <UserLFGs />
    </div>
  );
  const listings = (
    <div className={` ${appStyles.Box}`}>
      <h3>Group listings</h3>
    </div>
  );

  return (
    <Row>
      <Col className="">
        <h2>Look for group</h2>
        {myGroups}
        {hasLoaded ? <>{listings}</> : <LoadSpinner />}
      </Col>
    </Row>
  );
};

export default LFG;

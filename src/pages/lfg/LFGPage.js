import React, { useEffect, useState } from 'react';
import LoadSpinner from '../../components/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyGroups from '../../components/groups/MyGroups';
import GroupList from '../../components/groups/GroupList';
import MyApplications from '../../components/groups/MyApplications';

const LFGPage = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  return (
    <Row>
      <Col className="">
        <h2>Look for group</h2>
        <div className='d-flex d-row'>
          <MyGroups />
          <MyApplications />
        </div>
        <div>{hasLoaded ? <GroupList /> : <LoadSpinner />}</div>
      </Col>
    </Row>
  );
};

export default LFGPage;

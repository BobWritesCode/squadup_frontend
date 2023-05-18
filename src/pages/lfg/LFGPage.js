import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyGroups from '../../components/groups/MyGroups';
import GroupList from '../../components/groups/GroupList';
import MyApplications from '../../components/groups/MyApplications';

const LFGPage = () => {
  return (
    <>
      <Row>
        <h2>Look for group</h2>
      </Row>
      <Row>
        <Col>
          <MyGroups />
        </Col>
        <Col>
          <MyApplications />
        </Col>
      </Row>
      <Row>
        <Col>
          <GroupList />
        </Col>
      </Row>
    </>
  );
};

export default LFGPage;

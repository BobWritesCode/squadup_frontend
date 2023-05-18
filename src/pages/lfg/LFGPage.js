import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyGroups from '../../components/groups/MyGroups';
import GroupList from '../../components/groups/GroupList';
import MyApplications from '../../components/groups/MyApplications';

const LFGPage = () => {
  return (
    <Row>
      <Col className="">
        <h2>Look for group</h2>
        <div className="d-flex d-row">
          <MyGroups />
          <MyApplications />
        </div>
        <div>
          <GroupList />
        </div>
      </Col>
    </Row>
  );
};

export default LFGPage;

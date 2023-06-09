import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyGroups from '../../components/groups/MyGroups';
import GroupList from '../../components/groups/GroupList';
import MyApplications from '../../components/groups/MyApplications';
import { useRedirect } from '../../hooks/useRedirect';

const LFGPage = () => {
  useRedirect('loggedIn');
  return (
    <>
      <Row>
        <h2>Squad Finder</h2>
      </Row>
      <Row className="d-flex flex-column flex-xl-row">
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

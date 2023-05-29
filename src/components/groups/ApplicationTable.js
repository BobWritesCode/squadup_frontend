import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import SlotApply from './SlotApply';
import PropTypes from 'prop-types';

const ApplicationTable = (props) => {
  const { applications, onUpdate } = props;

  const [update, setUpdate] = useState(true);

  const Status = (s) => {
    switch (s) {
    case 'Awaiting':
      return <Badge bg="warning">Awaiting</Badge>;
    case 'Accepted':
      return <Badge bg="success">Accepted</Badge>;
    case 'Rejected':
      return <Badge bg="danger">Rejected</Badge>;
    default:
    }
  };

  const handleOnUpdate = () => {
    onUpdate();
    setUpdate(!update);
  };

  const ApplicationRow = (a) => (
    <tr key={a.id}>
      <td>{a.id}</td>
      <td>{Status(a.status)}</td>
      <td>{a.role}</td>
      <td>
        <SlotApply slotID={a.slot} onUpdate={handleOnUpdate} />
      </td>
    </tr>
  );

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>#</th>
          <th>Status</th>
          <th>Role</th>
          <td>Button</td>
        </tr>
      </thead>
      <tbody>{applications?.map((a) => ApplicationRow(a))}</tbody>
    </Table>
  );
};

// Props validation
ApplicationTable.propTypes = {
  applications: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ApplicationTable;

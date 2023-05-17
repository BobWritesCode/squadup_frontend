import React from 'react';
import Badge from 'react-bootstrap/Badge';

const GroupSlot = (props) => {
  const { slotData } = props;

  const Status = () => {
    if (slotData.status === 'Open') {
      return (
        <Badge bg="success">
          Open
        </Badge>
      );
    } else {
      return (
        <Badge bg="danger">
          Closed
        </Badge>
      );
    }
  };

  return (
    <tr>
      <td>{Status()}</td>
      <td>{slotData.role}</td>
      <td>{slotData.content ? slotData.content : <em>No extra info given.</em>}</td>
      <td></td>
    </tr>
  );
};

export default GroupSlot;

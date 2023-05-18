import React from 'react';
import Badge from 'react-bootstrap/Badge';
import SlotApply from './SlotApply';

const GroupSlot = (props) => {
  const { slotData } = props;

  const Status = () => {
    if (slotData.status === 'Open') {
      return <Badge bg="success">Open</Badge>;
    } else {
      return <Badge bg="danger">Closed</Badge>;
    }
  };

  return (
    <tr>
      <td>{Status()}</td>
      <td>{slotData.role}</td>
      <td>
        {slotData.content ? slotData.content : <em>No extra info given.</em>}
      </td>
      <td>
        <SlotApply slotData={slotData} onUpdate={() => {}} />
      </td>
    </tr>
  );
};

export default GroupSlot;

import React from 'react';
import Badge from 'react-bootstrap/Badge';
import SlotApply from './SlotApply';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import ApplicationReviews from './ApplicationReviews';

const GroupSlot = (props) => {
  const { slotData } = props;

  const currentUser = useCurrentUser();
  // Check to see if viewing user is profile owner.
  const is_owner = currentUser?.username === slotData?.owner;

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
        {is_owner ? (
          <ApplicationReviews slotData={slotData} />
        ) : (
          <SlotApply slotData={slotData} onUpdate={() => {}} />
        )}
      </td>
    </tr>
  );
};

export default GroupSlot;

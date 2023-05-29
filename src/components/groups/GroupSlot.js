import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import SlotApply from './SlotApply';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import ApplicationReviews from './ApplicationReviews';
import SlotUser from './SlotUser';
import PropTypes from 'prop-types';

const GroupSlot = (props) => {
  const { slotData } = props;
  // Use to refresh state on child update signal
  const [refresh, setRefresh] = useState(true);
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

  const handleRefresh = (e) => {
    switch (e) {
    case 'Close Slot':
      slotData.status = 'Closed';
      break;
    case 'Open Slot':
      slotData.status = 'Open';
      break;
    default:
      break;
    }
    setRefresh(!refresh);
  };

  const Button = (
    <>
      {is_owner ? (
        slotData.status === 'Closed' ? (
          <SlotUser
            key={slotData.id}
            slotData={slotData}
            onChange={handleRefresh}
          />
        ) : (
          <ApplicationReviews
            key={slotData.id}
            slotData={slotData}
            onChange={handleRefresh}
          />
        )
      ) : (
        <SlotApply key={slotData.id} slotData={slotData} onUpdate={() => {}} />
      )}
    </>
  );

  const LargeScreen = (
    <>
      <tr className="d-none d-md-table-row">
        <td>{Status()}</td>
        <td>{slotData.role}</td>
        <td>
          {slotData.content ? slotData.content : <em>No extra info given.</em>}
        </td>
        <td>{Button}</td>
      </tr>
    </>
  );

  const SmallScreen = (
    <tr className="d-table-row d-md-none">
      <td>
        <table className="w-100">
          <tbody>
            <tr>
              <td className="w-25">{Status()}</td>
              <td className="w-50">
                <strong>Role:</strong>
                <br className="d-sm-none" />
                <span className="d-none d-sm-inline">{'  '}</span>
                {slotData.role}
              </td>
              <td className="w-100">{Button}</td>
            </tr>
            <tr>
              <td colSpan={4}>
                {slotData.content ? (
                  slotData.content
                ) : (
                  <em>No extra info given.</em>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );

  return (
    <>
      {LargeScreen}
      {SmallScreen}
    </>
  );
};

// Props validation
GroupSlot.propTypes = {
  slotData: PropTypes.object.isRequired,
};

export default GroupSlot;

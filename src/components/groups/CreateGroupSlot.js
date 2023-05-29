import React, { useEffect, useState } from 'react';
import appStyles from '../../App.module.css';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

const CreateGroupSlot = (props) => {
  const { onSlotChange, slotValue, id } = props;

  const [role, setRole] = useState(slotValue.role);
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState({
    id: id,
    role: role,
    content: content,
  });

  // Used to display character count under note input
  const [charCount, setCharCount] = useState(0);

  // Update character count on change.
  useEffect(() => {
    setCharCount(String(content).length);
  }, [content]);

  // Send update to parent.
  useEffect(() => {
    onSlotChange(formData);
  }, [onSlotChange, formData]);

  // Allow user to edit form.
  const handleChange = (e) => {
    switch (e.target.name) {
    case 'role':
      setRole(e.target.value);
      setFormData({ ...formData, role: e.target.value });
      break;
    case 'content':
      setContent(e.target.value);
      setFormData({ ...formData, content: e.target.value });
      break;
    default:
      break;
    }
  };

  const form = (
    <div id="LFG_slots">
      <div className={`d-flex flex-column mb-2 pb-2 ${appStyles.Box}`}>
        <Form.Group className="mb-2 d-flex" controlId="role">
          <Form.Label>Role type:</Form.Label>
          <Form.Select
            aria-label="Select desired player role"
            name="role"
            value={role}
            onChange={handleChange}
          >
            <option value="Any">Any</option>
            <option value="Duelist">Duelist</option>
            <option value="Controller">Controller</option>
            <option value="Initiator">Initiator</option>
            <option value="Sentinel">Sentinel</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-0 d-flex" controlId="content">
          <div className="d-flex flex-column w-100">
            <Form.Control
              as="textarea"
              placeholder="You can write some extra information here."
              name="content"
              value={content}
              onChange={handleChange}
              className="mb-0"
            />

            <Form.Text className="ms-auto">({charCount}/100)</Form.Text>
          </div>
        </Form.Group>
      </div>
    </div>
  );

  return <>{form}</>;
};

// Props validation
CreateGroupSlot.propTypes = {
  onSlotChange: PropTypes.func.isRequired,
  slotValue: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
};

export default CreateGroupSlot;

import React, { useEffect, useState } from 'react';
import appStyles from '../../App.module.css';
import Form from 'react-bootstrap/Form';

export const LfgSlot = (props) => {
  const { onAddSlotsChange } = props;

  const [formData, setFormData] = useState({
    agentType: 'Any',
    content: '',
  });
  const { agentType, content } = formData;

  // Used to display character count under note input
  const [charCount, setCharCount] = useState(0);

  // Update character count on change.
  useEffect(() => {
    setCharCount(String(content).length);
  }, [content]);

  const handleRemoveSlot = () => {};

  // Allow user to edit form.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const form = (
    <div id="LFG_slots">
        <div className={`d-flex flex-column mb-2 ${appStyles.Box}`}>
          <Form.Group className="mb-2 d-flex" controlId="agentType">
            <Form.Label>Agent type:</Form.Label>
            <Form.Select aria-label="Select agent type">
              <option value="Any">Any</option>
              <option value="Duelist">Duelist</option>
              <option value="Controller">Controller</option>
              <option value="Initiator">Initiator</option>
              <option value="Sentinel">Sentinel</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-1 d-flex" controlId="content">

            <div className="d-flex flex-column w-100">
            <Form.Control
              as="textarea"
              placeholder="You can write some extra information here."
              name="content"
              value={formData.content}
              onChange={handleChange}
              className='mb-0'
            />

              <Form.Text className='ms-auto'>
                ({charCount}/100)
              </Form.Text>
              </div>

          </Form.Group>
        </div>
    </div>
  );

  return (
    <>
      {form}
    </>
  );
};

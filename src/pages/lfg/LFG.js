import React, { useEffect, useState } from 'react';
import LoadSpinner from '../../components/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import appStyles from '../../App.module.css';
import CreateLFG from '../../components/lfg/CreateLFG';

const LFG = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const listings = <div className={` ${appStyles.Box}`}>sds</div>;

  return (
    <Row>
      <Col className="">
        {hasLoaded ? (
          <>
            <CreateLFG />
            {listings}
          </>
        ) : (
          <LoadSpinner />
        )}
      </Col>
    </Row>
  );
};

export default LFG;

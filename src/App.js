import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import NavBar from './components/NavBar';
import styles from './App.module.css';
import logo from './assets/logo-white-text-no-bg.png';

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container fluid className={styles.Main}>
        <Row className="justify-content-center">
          <Col xs="10" className="d-flex flex-column">
            <img
              src={logo}
              alt="Squad Up logo"
              className="mx-auto"
            />
            <Button variant="outline-light" className="mt-5">Sign In</Button>
            <Button variant="outline-light" className="mt-2">Sign Up</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

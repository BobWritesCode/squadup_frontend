import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import NavBar from './components/NavBar';
import styles from './App.module.css';
import logo from './assets/logo-white-text-no-bg.png';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container fluid className={styles.Main}>
        <Row className="justify-content-center">
          <Col xs="10" className="d-flex flex-column">
            <Routes>
              <Route
                path="/"
                element={
                  <img src={logo} alt="Squad Up logo" className="mx-auto" />
                }
              />
              <Route path="/signin" element={<h1>Sign In</h1>} />
              <Route path="/signup" element={<h1>Sign Up</h1>} />
              <Route path="*" element={<h1>404 Page Not Found</h1>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

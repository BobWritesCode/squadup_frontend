import Container from 'react-bootstrap/Container';
import { Route, Routes } from 'react-router-dom';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from './components/NavBar';
import styles from './App.module.css';
// App imports
import logo from './assets/logo-white-text-no-bg.png';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import Profile from './pages/profile/Profile';
import LFG from './pages/lfg/LFG';

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
              <Route path="/signin" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/lfg" element={<LFG />} />
              <Route path="*" element={<h1>404 Page Not Found</h1>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

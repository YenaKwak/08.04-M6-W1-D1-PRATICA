import React from "react";
import { Button, Container, Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import "./styles.css";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("NavBar: Logging out"); // 로그 추가
    logout();
    navigate("/");
  };

  console.log("NavBar: isAuthenticated:", isAuthenticated); // 로그 추가

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        <Nav>
          {isAuthenticated ? (
            <>
              <Button as={Link} to="/new" className="bg-dark" size="lg">
                New Post
              </Button>
              <Button
                className="ms-2"
                variant="outline-danger"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="outline-primary" size="lg">
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                className="ms-2"
                variant="outline-secondary"
                size="lg"
              >
                Register
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;

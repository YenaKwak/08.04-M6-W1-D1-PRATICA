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
    logout();
    navigate("/");
  };

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
              <Button as={Link} to="/login" variant="outline-primary" siza="lg">
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                className="ms-2"
                variant="outline-secondary"
                siza="lg"
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

// const NavBar = (props) => {
//   return (
//     <Navbar expand="lg" className="blog-navbar" fixed="top">
//       <Container className="justify-content-between">
//         <Navbar.Brand as={Link} to="/">
//           <img className="blog-navbar-brand" alt="logo" src={logo} />
//         </Navbar.Brand>

//         <Button
//           as={Link}
//           to="/new"
//           className="blog-navbar-add-button bg-dark"
//           size="lg"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             fill="currentColor"
//             className="bi bi-plus-lg"
//             viewBox="0 0 16 16"
//           >
//             <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
//           </svg>
//           New Post
//         </Button>
//       </Container>
//     </Navbar>
//   );
// };

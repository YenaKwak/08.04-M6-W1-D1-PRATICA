import React from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import NotFound from "./views/notfound/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import EditBlogPost from "./views/blog/EditBlogPost";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route
            path="/new"
            element={<PrivateRoute component={NewBlogPost} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/edit/:id"
            element={<PrivateRoute component={EditBlogPost} />}
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/login-success" element={<Login />} />{" "}
          {/* 추가된 경로 */}
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

function PrivateRoute({ component: Component }) {
  const { isAuthenticated } = useAuth(); // AuthContext에서 로그인 상태를 가져옵니다.

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}

export default App;

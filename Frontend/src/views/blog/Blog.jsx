import React, { useEffect, useState, useContext } from "react";
import { Container, Image, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import { AuthContext } from "../../contexts/AuthContext";
import "./styles.css";

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext); // Assuming AuthContext provides user details
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params.id) {
        navigate("/404");
        return;
      }

      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/blogPosts/${params.id}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`Blog post not found, status: ${response.status}`);
        }

        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post", error);
        navigate("/404");
      }
    };

    fetchBlog();
  }, [params.id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/blogPosts/${params.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete the blog post");

        alert("Post deleted successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting post", error);
        alert("Failed to delete the post");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return null;

  return (
    <div className="blog-details-root">
      <Container>
        {blog.cover && (
          <Image className="blog-details-cover" src={blog.cover} fluid />
        )}
        <h1 className="blog-details-title">{blog.title}</h1>
        <div className="blog-details-container">
          {blog.author && (
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
          )}
          <div className="blog-details-info">
            <div>
              {blog.createdAt && new Date(blog.createdAt).toLocaleDateString()}
            </div>
            {blog.readTime && (
              <div>{`Read time: ${blog.readTime.value} ${blog.readTime.unit}`}</div>
            )}
            <div style={{ marginTop: 20 }}>
              <BlogLike defaultLikes={["123"]} onChange={console.log} />
            </div>
          </div>
          {blog.content && (
            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          )}
        </div>
        {isAuthenticated && user && user._id === blog.author._id && (
          <div className="mt-3">
            <Button
              variant="info"
              onClick={() => navigate(`/edit/${blog._id}`)}
            >
              Edit Post
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              style={{ marginLeft: "10px" }}
            >
              Delete Post
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Blog;

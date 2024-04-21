// Blog.jsx
import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Params ID:", params.id);
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/blogPosts/${params.id}`
        );
        if (!response.ok) throw new Error("Blog post not found");
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog post not found.</div>;
  }

  return (
    <div className="blog-details-root">
      <Container>
        <Image className="blog-details-cover" src={blog.cover} fluid />
        <h1 className="blog-details-title">{blog.title}</h1>

        <div className="blog-details-container">
          <div className="blog-details-author">
            <BlogAuthor {...blog.author} />
          </div>
          <div className="blog-details-info">
            <div>{new Date(blog.createdAt).toLocaleDateString()}</div>
            <div>{`Read time: ${blog.readTime.value} ${blog.readTime.unit}`}</div>
            <div style={{ marginTop: 20 }}>
              <BlogLike defaultLikes={["123"]} onChange={console.log} />
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </div>
      </Container>
    </div>
  );
};

export default Blog;

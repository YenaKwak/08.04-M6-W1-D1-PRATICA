import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/blogPosts`
        );
        const data = await response.json();
        if (response.ok) {
          // 로그로 불러온 데이터를 확인
          console.log("Fetched data:", data);
          setPosts(data);
        } else {
          // 오류 처리
          console.error("Server response wasn't ok:", response);
        }
      } catch (error) {
        // 오류 로깅
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Row>
      {posts.map((post) => {
        return (
          <Col key={post._id} md={4} style={{ marginBottom: 50 }}>
            <BlogItem key={post._id} {...post} />
          </Col>
        );
      })}
    </Row>
  );
};

export default BlogList;

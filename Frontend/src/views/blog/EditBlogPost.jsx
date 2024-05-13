import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useNavigate, useParams } from "react-router-dom";
import "./styles.css";

const EditBlogPost = () => {
  const [form, setForm] = useState({
    title: "",
    category: "Category 1",
    content: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/api/blogPosts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            title: data.title,
            category: data.category,
            content: data.content,
          });
          setEditorState(EditorState.createWithContent(data.content));
          setCoverImage(data.cover);
          setLoading(false);
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("category", form.category);
    formData.append("content", form.content);
    if (coverImage) {
      formData.append("cover", coverImage);
    }

    const requestOptions = {
      method: id ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/blogPosts/${id ? id : ""}`,
      requestOptions
    );

    if (response.ok) {
      alert("Post " + (id ? "updated" : "created") + " successfully!");
      navigate("/");
    } else {
      const errorMsg = await response.text();
      alert(`An error occurred: ${errorMsg}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form-title" className="mt-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="blog-form-category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            name="category"
            value={form.category}
            onChange={handleInputChange}
            required
          >
            {[
              "Category 1",
              "Category 2",
              "Category 3",
              "Category 4",
              "Category 5",
            ].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-form-cover" className="mt-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control type="file" name="cover" onChange={handleImageChange} />
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Content</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="new-blog-content"
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            {id ? "Update Post" : "Create Post"}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default EditBlogPost;

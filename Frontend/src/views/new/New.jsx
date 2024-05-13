import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "./styles.css";

const NewBlogPost = () => {
  const [form, setForm] = useState({
    title: "",
    category: "Category 1",
    content: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    setForm({ ...form, content: draftToHtml(rawContentState) });
  };

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
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("category", form.category);
    formData.append("content", form.content);
    if (coverImage) {
      formData.append("cover", coverImage);
    }

    console.log("Form Data Prepared: ", {
      title: form.title,
      category: form.category,
      content: form.content.length,
      coverImage: coverImage ? coverImage.name : "No cover image",
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/blogPosts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' should NOT be set manually
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Post sent successfully!");
        setForm({ title: "", category: "Category 1", content: "" });
        setEditorState(EditorState.createEmpty());
        setCoverImage(null);
      } else {
        const errorMsg = await response.text();
        alert(`An error occurred: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error while sending the post:", error);
      alert("Error connecting to the server.");
    }
  };

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
            onEditorStateChange={onEditorStateChange}
            wrapperClassName="new-blog-content"
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button
            type="reset"
            size="lg"
            variant="outline-dark"
            onClick={() => {
              setForm({ title: "", category: "Category 1", content: "" });
              setEditorState(EditorState.createEmpty());
              setCoverImage(null);
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            Send
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;

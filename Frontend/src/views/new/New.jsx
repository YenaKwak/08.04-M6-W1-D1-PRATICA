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
    category: "Category 1", //기본카테고리 설정
    content: "",
  });

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    setForm({ ...form, content: draftToHtml(rawContentState) });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    console.log("sending token:", token);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/blogPosts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
          },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        alert("Post sent successfully!");
        setForm({ title: "", category: "Category 1", content: "" });
        setEditorState(EditorState.createEmpty());
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
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            name="category"
            value={form.category}
            onChange={handleInputChange}
          >
            <option>Category 1</option>
            <option>Category 2</option>
            <option>Category 3</option>
            <option>Category 4</option>
            <option>Category 5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>content Blog</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
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
            style={{
              marginLeft: "1em",
            }}
          >
            Send
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;

// import React, { useState } from "react";
// import { EditorState, convertToRaw } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { Container, Form, Button } from "react-bootstrap";
// import "./styles.css";

// const NewBlogPost = () => {
//   const [form, setForm] = useState({
//     title: "",
//     category: "Category 1", // 기본 카테고리 설정
//   });
//   const [selectedFile, setSelectedFile] = useState(null); // 이미지 파일 상태
//   const [editorState, setEditorState] = useState(EditorState.createEmpty()); // 텍스트 에디터 상태

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//   };

//   const onEditorStateChange = (editorState) => {
//     setEditorState(editorState);
//     const rawContentState = convertToRaw(editorState.getCurrentContent());
//     setForm({ ...form, content: draftToHtml(rawContentState) });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", form.title);
//     formData.append("category", form.category);
//     formData.append("content", form.content);
//     if (selectedFile) {
//       formData.append("cover", selectedFile);
//     }

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/blogPosts`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const error = await response.text();
//         throw new Error(error);
//       }

//       alert("Blog post created successfully");
//       setForm({ title: "", category: "Category 1", content: "" });
//       setEditorState(EditorState.createEmpty());
//       setSelectedFile(null);
//     } catch (error) {
//       alert(`An error occurred: ${error.message}`);
//     }
//   };

//   const resetForm = () => {
//     setForm({ title: "", category: "Category 1", content: "" });
//     setEditorState(EditorState.createEmpty());
//     setSelectedFile(null);
//   };

//   return (
//     <Container className="new-blog-container">
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="blog-form-title">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             size="lg"
//             placeholder="Title"
//             name="title"
//             value={form.title}
//             onChange={handleInputChange}
//           />
//         </Form.Group>
//         <Form.Group controlId="blog-form-category">
//           <Form.Label>Category</Form.Label>
//           <Form.Control
//             as="select"
//             size="lg"
//             name="category"
//             value={form.category}
//             onChange={handleInputChange}
//           >
//             <option>Category 1</option>
//             <option>Category 2</option>
//             <option>Category 3</option>
//             <option>Category 4</option>
//             <option>Category 5</option>
//           </Form.Control>
//         </Form.Group>
//         <Form.Group controlId="blog-form-cover">
//           <Form.Label>Cover Image</Form.Label>
//           <Form.Control type="file" name="cover" onChange={handleFileChange} />
//         </Form.Group>
//         <Form.Group controlId="blog-form-content">
//           <Form.Label>Content</Form.Label>
//           <Editor
//             editorState={editorState}
//             onEditorStateChange={onEditorStateChange}
//             wrapperClassName="new-blog-content"
//             editorClassName="blog-editor"
//           />
//         </Form.Group>
//         <Form.Group className="d-flex justify-content-end">
//           <Button variant="outline-dark" size="lg" onClick={resetForm}>
//             Reset
//           </Button>
//           <Button type="submit" size="lg" variant="dark" className="ms-2">
//           <Button variant="primary" type="submit">
//             Submit
//           </Button>
//         </Form.Group>
//       </Form>
//     </Container>
//   );
// };

// export default NewBlogPost;

import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        { name, email, password },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Profile updated successfully ✅");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <div style={containerStyle}>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <div style={cardStyle}>
        <h1 style={headingStyle}>User Profile</h1>
        <form onSubmit={submitHandler} style={formStyle}>
          <Form.Group controlId="name" style={formGroupStyle}>
            <Form.Label style={labelStyle}>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </Form.Group>
          <Form.Group controlId="email" style={formGroupStyle}>
            <Form.Label style={labelStyle}>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </Form.Group>
          <Form.Group controlId="password" style={formGroupStyle}>
            <Form.Label style={labelStyle}>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" style={formGroupStyle}>
            <Form.Label style={labelStyle}>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </Form.Group>
          <div style={buttonContainerStyle}>
            <Button type="submit" style={buttonStyle} disabled={loadingUpdate}>
              {loadingUpdate ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Internal Advanced CSS
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2f3, #8e9eab)",
  padding: "20px",
};

const cardStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  width: "100%",
  maxWidth: "500px",
  transition: "transform 0.2s ease",
};

const headingStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "30px",
  color: "#333",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const formGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  fontWeight: "600",
  marginBottom: "8px",
  color: "#444",
  fontSize: "1rem",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  transition: "all 0.3s ease",
};

const buttonContainerStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const buttonStyle = {
  background: "linear-gradient(90deg, #667eea, #764ba2)",
  border: "none",
  color: "#fff",
  fontWeight: "600",
  padding: "12px 25px",
  borderRadius: "8px",
  fontSize: "1.1rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default ProfileScreen;

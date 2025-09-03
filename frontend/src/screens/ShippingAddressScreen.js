import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import { ArrowLeft } from "react-bootstrap-icons"; // back arrow icon

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [prescription, setPrescription] = useState(null);
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    let uploadedFilePath = null;

    if (prescription) {
      const formData = new FormData();
      formData.append("file", prescription);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          uploadedFilePath = data.secure_url;
        } else {
          alert("File upload failed: " + (data.message || "Unknown error"));
          return;
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed: " + err.message);
        return;
      }
    }

    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
        prescription: uploadedFilePath,
      },
    });

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
        prescription: uploadedFilePath,
      })
    );

    navigate("/payment");
  };

  useEffect(() => {
    ctxDispatch({ type: "SET_FULLBOX_OFF" });
  }, [ctxDispatch, fullBox]);

  // ✅ Custom Styles
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "25px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  };

  const backBtnStyle = {
    cursor: "pointer",
    marginRight: "12px",
    color: "#004225",
  };

  const headingStyle = {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#004225",
  };

  return (
    <div style={pageStyle}>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>

      <div style={cardStyle}>
        {/* ✅ Back Arrow */}
        <div style={headerStyle}>
          <ArrowLeft
            size={28}
            style={backBtnStyle}
            onClick={() => navigate("/cart")}
          />
          <h2 style={headingStyle}>Shipping Information</h2>
        </div>

        {/* ✅ Prescription Upload */}
        <h5 className="mb-3" style={{ color: "#333" }}>
          Upload Prescription
        </h5>
        <Form.Group className="mb-4" controlId="prescription">
          <Form.Label style={{ fontWeight: "500" }}>
            Upload Medicine Prescription (PDF / Image)
          </Form.Label>
          <Form.Control
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setPrescription(e.target.files[0])}
          />
          {prescription && (
            <div
              className="mt-2 p-2 rounded"
              style={{ backgroundColor: "#f1f5f9", fontSize: "0.9rem" }}
            >
              Selected File: <b>{prescription.name}</b>
            </div>
          )}
        </Form.Group>

        {/* ✅ Shipping Form */}
        <h5 className="mb-3" style={{ color: "#333" }}>
          Shipping Address
        </h5>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Street, Apartment, etc."
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Enter your city"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              placeholder="Enter postal code"
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              placeholder="Enter country"
            />
          </Form.Group>

          <div className="mb-3">
            <Button
              id="chooseOnMap"
              type="button"
              variant="outline-success"
              onClick={() => navigate("/map")}
              className="me-3"
            >
              Choose Location On Map
            </Button>
            {shippingAddress.location && shippingAddress.location.lat ? (
              <span style={{ fontSize: "0.9rem", color: "#444" }}>
                📍 LAT: {shippingAddress.location.lat} | LNG:{" "}
                {shippingAddress.location.lng}
              </span>
            ) : (
              <span style={{ fontSize: "0.9rem", color: "#888" }}>
                No location selected
              </span>
            )}
          </div>

          <div className="d-grid">
            <Button
              variant="success"
              type="submit"
              style={{ borderRadius: "8px", fontWeight: "600" }}
            >
              Continue to Payment →
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_STATUS_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_STATUS_SUCCESS":
      return { ...state, loadingUpdate: false, order: action.payload };
    case "UPDATE_STATUS_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    loadingUpdate: false,
  });

  const [rejectReason, setRejectReason] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      navigate("/login");
    } else {
      fetchOrder();
    }
  }, [userInfo, navigate, orderId]);

  const handleStatus = async (status) => {
    try {
      dispatch({ type: "UPDATE_STATUS_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/status`,
        { status, rejectReason: status === "rejected" ? rejectReason : "" },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_STATUS_SUCCESS", payload: data });
      if (status === "rejected") setRejectReason("");
    } catch (err) {
      dispatch({ type: "UPDATE_STATUS_FAIL" });
      alert(getError(err));
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const styles = {
    container: {
      padding: "20px",
    },
    backBtn: {
      display: "inline-flex",
      alignItems: "center",
      marginBottom: "20px",
      padding: "8px 16px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none",
    },
    backIcon: { marginRight: "8px" },
    sectionTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    layout: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      flexWrap: "wrap",
    },
    leftPanel: {
      flex: 2,
      minWidth: "300px",
    },
    rightPanel: {
      flex: 1,
      minWidth: "280px",
    },
    prescriptionImg: {
      maxHeight: "400px",
      width: "100%",
      objectFit: "contain",
      borderRadius: "8px",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      transition: "transform 0.3s",
    },
    rejectText: { color: "red", marginTop: "10px" },
    statusText: { marginTop: "20px", fontSize: "16px", fontWeight: "bold" },
    statusBox: {
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      marginTop: "20px",
    },
    formGroup: {
      marginTop: "15px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      position: "relative",
      maxWidth: "90vw",
      maxHeight: "90vh",
      backgroundColor: "#fff",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    },
    modalImage: {
      maxWidth: "100%",
      maxHeight: "80vh",
      display: "block",
      borderRadius: "6px",
    },
    closeBtn: {
      position: "absolute",
      top: "5px",
      right: "10px",
      background: "transparent",
      border: "none",
      fontSize: "2rem",
      cursor: "pointer",
      lineHeight: 1,
      color: "#333",
    },
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div style={styles.container}>
      {/* Back Button */}
      <button style={styles.backBtn} onClick={() => navigate("/admin/orders")}>
        <FaArrowLeft style={styles.backIcon} />
        Back to Orders
      </button>

      <h2 className="my-3">Order #{orderId}</h2>

      <div style={styles.layout}>
        {/* Left Side Panel */}
        <div style={styles.leftPanel}>
          {/* Shipping Info */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title style={styles.sectionTitle}>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress?.fullName} <br />
                <strong>Address:</strong> {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode},{" "}
                {order.shippingAddress?.country}{" "}
                {order.shippingAddress?.location?.lat && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                  >
                    &nbsp;[View on Map]
                  </a>
                )}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Ordered Items */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title style={styles.sectionTitle}>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems?.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                          style={{ maxHeight: "80px", marginRight: "10px" }}
                        />
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>Qty: {item.quantity}</Col>
                      <Col md={3}>
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(item.price)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>

        {/* Right Side Panel */}
        <div style={styles.rightPanel}>
          {/* Prescription */}
          {order.shippingAddress?.prescription && (
            <>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title style={styles.sectionTitle}>Prescription</Card.Title>
                  {order.shippingAddress.prescription.endsWith(".pdf") ? (
                    <a
                      href={order.shippingAddress.prescription}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Prescription PDF
                    </a>
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={openModal}
                      aria-label="View prescription image in larger view"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") openModal();
                      }}
                    >
                      <img
                        src={order.shippingAddress.prescription}
                        alt="Prescription"
                        style={styles.prescriptionImg}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>

              {modalOpen && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                  <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <img
                      src={order.shippingAddress.prescription}
                      alt="Prescription Large"
                      style={styles.modalImage}
                    />
                    <button
                      style={styles.closeBtn}
                      onClick={closeModal}
                      aria-label="Close modal"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Status Controls */}
          {userInfo.isAdmin && (
            <div style={styles.statusBox}>
              <Button
                variant="success"
                onClick={() => handleStatus("approved")}
                disabled={loadingUpdate || order.status === "approved"}
                className="me-2"
              >
                Approve
              </Button>

              <Button
                variant="danger"
                onClick={() => handleStatus("rejected")}
                disabled={
                  loadingUpdate || order.status === "rejected" || !rejectReason
                }
                className="me-2"
              >
                Reject
              </Button>

              <Form.Group style={styles.formGroup}>
                <Form.Label>Reject Reason (required for rejection)</Form.Label>
                <Form.Control
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  disabled={order.status === "approved"}
                  placeholder="Enter reason for rejection"
                />
              </Form.Group>

              {order.status === "rejected" && order.rejectReason && (
                <p style={styles.rejectText}>Reject Reason: {order.rejectReason}</p>
              )}

              {loadingUpdate && <LoadingBox />}
            </div>
          )}

          <p style={styles.statusText}>
            Current Status:{" "}
            {order.status
              ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
              : "Pending"}
          </p>
        </div>
      </div>
    </div>
  );
}

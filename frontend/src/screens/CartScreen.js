import React, { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import MessageBox from "../components/MessageBox";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      {/* Back Button + Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <Button
          variant="light"
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#ecf0f1",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" style={{ color: "#2c3e50" }} />
        </Button>

        <h1
          style={{
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          <FontAwesomeIcon icon={faShoppingCart} /> Your Cart
        </h1>
      </div>

      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Shop Now</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item
                  key={item._id}
                  style={{
                    marginBottom: "15px",
                    padding: "20px",
                    border: "1px solid #e1e4e8",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "120px",
                          objectFit: "contain",
                          borderRadius: "10px",
                          background: "#fdfdfd",
                          padding: "8px",
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/product/${item.slug}`}
                        style={{
                          textDecoration: "none",
                          color: "#34495e",
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={3} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                        }}
                      >
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          variant="light"
                          disabled={item.quantity === 1}
                          style={{
                            backgroundColor: "#e74c3c",
                            border: "none",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",
                          }}
                        >
                          −
                        </Button>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            minWidth: "30px",
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          variant="light"
                          disabled={item.quantity === item.countInStock}
                          style={{
                            backgroundColor: "#27ae60",
                            border: "none",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </Col>
                    <Col
                      md={2}
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#2c3e50",
                        textAlign: "center",
                      }}
                    >
                      ₹{item.price}
                    </Col>
                    <Col md={1} style={{ textAlign: "center" }}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                        style={{
                          backgroundColor: "#f8d7da",
                          border: "none",
                          color: "#e74c3c",
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              border: "none",
              background: "#ffffff",
            }}
          >
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#2c3e50",
                    border: "none",
                    paddingBottom: "15px",
                  }}
                >
                  Subtotal (
                  {cartItems.reduce((a, c) => a + c.quantity, 0)} items):{" "}
                  <span style={{ color: "#27ae60" }}>
                    ₹
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "18px",
                      borderRadius: "10px",
                      backgroundColor: "#f1c40f",
                      color: "#000",
                      border: "none",
                      fontWeight: "600",
                      transition: "all 0.3s",
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

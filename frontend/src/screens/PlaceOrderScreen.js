import Axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.DiscountPrice = round2(0.1 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice - cart.DiscountPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          DiscountPrice: cart.DiscountPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      toast.success("Order placed successfully!");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  const styles = {
    page: { padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" },
    header: { fontSize: "1.8rem", fontWeight: "bold", color: "#004225" },
    sectionCard: {
      marginBottom: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    summaryCard: {
      background: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    sectionTitle: { fontSize: "1.3rem", fontWeight: "600", color: "#004225" },
    totalRow: { fontWeight: "bold", color: "#d32f2f" },
    button: {
      backgroundColor: "#004225",
      border: "none",
      borderRadius: "8px",
      padding: "12px",
      fontWeight: "600",
    },
    productImage: {
      width: "50px",
      height: "50px",
      borderRadius: "5px",
      marginRight: "10px",
      objectFit: "cover",
    },
  };

  return (
    <div style={styles.page}>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3" style={styles.header}>
        Preview Order
      </h1>
      <Row>
        <Col md={8}>
          <Card style={styles.sectionCard}>
            <Card.Body>
              <Card.Title style={styles.sectionTitle}>Shipping</Card.Title>
              <p>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address:</strong>{" "}
                {`${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.postalCode}, ${cart.shippingAddress.country}`}
              </p>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card style={styles.sectionCard}>
            <Card.Body>
              <Card.Title style={styles.sectionTitle}>Payment</Card.Title>
              <p>
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card style={styles.sectionCard}>
            <Card.Body>
              <Card.Title style={styles.sectionTitle}>Order Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6} className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={styles.productImage}
                        />
                        {item.name}
                      </Col>
                      <Col md={3}>
                        {item.quantity} × ₹{item.price}
                      </Col>
                      <Col md={3}>₹{item.quantity * item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={styles.summaryCard}>
            <Card.Body>
              <Card.Title style={styles.sectionTitle}>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>₹{cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Delivery Charges</Col>
                    <Col>₹{cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Discount (10%)</Col>
                    <Col>- ₹{cart.DiscountPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={styles.totalRow}>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>₹{cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      style={styles.button}
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox />}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

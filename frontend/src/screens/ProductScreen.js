import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({ behavior: "smooth", top: reviewsRef.current.offsetTop });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  // Styles
  const styles = {
    container: {
      padding: "16px",
      backgroundColor: "#f9fafc",
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "600",
      color: "#2c3e50",
    },
    image: {
      width: "70%",
      maxWidth: "350px",
      display: "block",
      margin: "0 auto 16px auto",
      borderRadius: "10px",
      boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
      objectFit: "contain",
    },
    productTitle: {
      fontSize: "1.6rem",
      fontWeight: "bold",
      color: "#004225",
      marginBottom: "8px",
    },
    price: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#1e293b",
    },
    description: {
      fontSize: "0.95rem",
      color: "#334155",
      marginTop: "6px",
      lineHeight: "1.4",
    },
    cartBtn: {
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
      fontWeight: "600",
      borderRadius: "6px",
      padding: "10px",
      fontSize: "15px",
      transition: "all 0.3s ease",
    },
    likeBtn: {
      backgroundColor: "#22c55e",
      borderColor: "#22c55e",
      fontWeight: "600",
      borderRadius: "6px",
      padding: "6px 12px",
      marginRight: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease",
    },
    dislikeBtn: {
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
      fontWeight: "600",
      borderRadius: "6px",
      padding: "6px 12px",
      fontSize: "14px",
      transition: "all 0.3s ease",
    },
    reviewForm: {
      marginTop: "16px",
      backgroundColor: "#fff",
      padding: "16px",
      borderRadius: "10px",
      boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
    },
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div style={styles.container}>
      {/* Back Arrow Header */}
      <div style={styles.header} onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back</span>
      </div>

      <Row className="gy-4">
        <Col md={6}>
          <img
            style={styles.image}
            src={selectedImage || product.image}
            alt={product.name}
          />
        </Col>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1 style={styles.productTitle}>{product.name}</h1>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              />
            </ListGroup.Item>
            <ListGroup.Item style={styles.price}>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(product.price)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Row xs={2} md={4} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Description:</b>
              <p style={styles.description}>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
          <Card className="mt-3">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  {product.countInStock > 0 ? (
                    <Badge bg="success">In Stock</Badge>
                  ) : (
                    <Badge bg="danger">Unavailable</Badge>
                  )}
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        style={styles.cartBtn}
                        onClick={addToCartHandler}
                      >
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          style={{ marginRight: "8px" }}
                        />
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reviews Section */}
      <div className="my-4">
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" " />
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div style={styles.reviewForm}>
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <div className="mb-3 d-flex">
                <Button
                  style={{
                    ...styles.likeBtn,
                    opacity: like ? 0.7 : 1,
                  }}
                  disabled={buttonsDisabled || like}
                  onClick={() => {
                    setLike(true);
                    setButtonsDisabled(true);
                  }}
                >
                  <FaThumbsUp /> Like
                </Button>
                <Button
                  style={{
                    ...styles.dislikeBtn,
                    opacity: dislike ? 0.7 : 1,
                  }}
                  disabled={buttonsDisabled || dislike}
                  onClick={() => {
                    setDislike(true);
                    setButtonsDisabled(true);
                  }}
                >
                  <FaThumbsDown /> Dislike
                </Button>
              </div>
              <h4>Write a customer review</h4>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excellent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ minHeight: "100px" }}
                />
              </FloatingLabel>
              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Submit
                </Button>
                {loadingCreateReview && <LoadingBox />}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{" "}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{" "}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;

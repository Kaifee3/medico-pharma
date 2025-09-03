import { useEffect, useReducer } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    width: "100%",
  };

  const contentStyle = {
    flex: "1",
    padding: "30px",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#004225",
  };

  return (
    <div style={pageStyle}>
      <Helmet>
        <title>LifeCare</title>
      </Helmet>

      <div style={contentStyle}>
        <h1 style={headingStyle}>Tablets</h1>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox style={{ color: "red" }} variant="danger">
            {error}
          </MessageBox>
        ) : (
          <Container fluid>
            <Row className="justify-content-center" style={{ gap: "20px" }}>
              {products.map((product) => (
                <Col
                  key={product.slug}
                  xs={12}
                  sm={6}
                  lg={3} // 4 products per row on medium and up
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Product
                    product={product}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "15px",
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s ease",
                      width: "100%",
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;

import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import { Row, Col } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload.products, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get("query") || "all";

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
  });

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/search?query=${query}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim().length > 0) {
        try {
          const { data } = await axios.get(`/api/products/search?query=${keyword}`);
          setSuggestions(data.products);
        } catch (err) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [keyword]);

  return (
    <>
      <Helmet>
        <title>Search Medicines</title>
      </Helmet>

      {/* 🔹 Search Box */}
      <div style={{ maxWidth: "500px", margin: "30px auto", position: "relative" }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search medicine..."
          style={{
            width: "100%",
            padding: "12px 20px",
            border: "2px solid #00b37e",
            borderRadius: "50px",
            outline: "none",
            fontSize: "16px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "50px",
              left: 0,
              width: "100%",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "10px",
              maxHeight: "250px",
              overflowY: "auto",
              zIndex: 1000,
              listStyle: "none",
              padding: "10px 0",
              margin: 0,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s._id}
                className="suggestion-item"
                onClick={() => navigate(`/product/${s.slug}`)}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 Search Results */}
      <Row style={{ marginTop: "40px" }}>
        <Col md={9} className="mx-auto">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.length === 0 && <p>No products found, suggesting alternatives...</p>}
              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>

      {/* 🔹 Internal CSS for hover effect */}
      <style>
        {`
          .suggestion-item:hover {
            background-color: #00b37e;
            color: #fff;
            transform: scale(1.03);
          }
        `}
      </style>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SearchBox({ style }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      navigate(`/search?query=${query}`);
    } else {
      navigate('/search');
    }
    setSuggestions([]); // Hide suggestions after submit
  };

  // Fetch live suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 0) {
        try {
          const { data } = await axios.get(`/api/products/search?query=${query}`);
          setSuggestions(data.products);
        } catch (err) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  // Handle clicking on a suggestion
  const handleSuggestionClick = (name) => {
    setQuery(name);        // Fill input with suggestion
    setSuggestions([]);    // Hide dropdown
  };

  return (
<div style={{ position: 'relative', margin: '0 auto', maxWidth: '500px', width: '100%', paddingLeft: '15px', paddingRight: '15px', ...style }}>
      <Form onSubmit={submitHandler}>
        <InputGroup>
          <FormControl
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine..."
            aria-label="Search Products"
            style={{
              borderRadius: '50px',
              padding: '12px 20px',
              fontSize: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              border: '2px solid #00b37e',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
          />
          <Button
            variant="outline-success"
            type="submit"
            style={{
              borderRadius: '50px',
              marginLeft: '-1px',
              padding: '0 20px',
              background: '#00b37e',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            🔍
          </Button>
        </InputGroup>
      </Form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '50px',
            left: 0,
            width: '100%',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '10px',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 1000,
            listStyle: 'none',
            padding: '5px 0',
            margin: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {suggestions.map((s) => (
            <li
              key={s._id}
              onClick={() => handleSuggestionClick(s.name)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '5px',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#00b37e';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#000';
              }}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

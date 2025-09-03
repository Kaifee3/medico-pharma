import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { FaTrashAlt, FaEye } from 'react-icons/fa';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders = [], loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  // Internal styles
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: '1px solid #ddd',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
      fontSize: '14px',
    },
    status: {
      fontWeight: 'bold',
      padding: '4px 8px',
      borderRadius: '5px',
      display: 'inline-block',
    },
    approved: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    rejected: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
    pending: {
      backgroundColor: '#fff3cd',
      color: '#856404',
    },
    actionBtn: {
      padding: '8px 12px',
      marginRight: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1 style={{ marginBottom: '20px' }}>Orders</h1>
      {loadingDelete && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={styles.td}>{order._id}</td>
                <td style={styles.td}>{order.user ? order.user.name : 'DELETED USER'}</td>
                <td style={styles.td}>{order.createdAt.substring(0, 10)}</td>
                <td style={styles.td}>₹{order.totalPrice.toFixed(2)}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      ...(order.status === 'approved'
                        ? styles.approved
                        : order.status === 'rejected'
                        ? styles.rejected
                        : styles.pending),
                    }}
                  >
                    {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                  </span>
                </td>
                <td style={styles.td}>
                  <Button
                    variant="light"
                    onClick={() => navigate(`/order/${order._id}`)}
                    style={styles.actionBtn}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteHandler(order)}
                    style={styles.actionBtn}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

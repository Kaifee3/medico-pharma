import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CANCEL_REQUEST":
      return { ...state, loadingCancel: true };
    case "CANCEL_SUCCESS":
      return {
        ...state,
        loadingCancel: false,
        orders: state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        ),
      };
    case "CANCEL_FAIL":
      return { ...state, loadingCancel: false };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders, loadingCancel }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      orders: [],
      loadingCancel: false,
    }
  );

  useEffect(() => {
    if (!userInfo) return;

    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  if (!userInfo) {
    return <MessageBox>Please login to view your orders.</MessageBox>;
  }

  // Cancel order
  const cancelOrderHandler = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      dispatch({ type: "CANCEL_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "CANCEL_SUCCESS", payload: data });
      alert("Order cancelled successfully.");
    } catch (err) {
      dispatch({ type: "CANCEL_FAIL" });
      alert(getError(err));
    }
  };

  // Download invoice
  const downloadInvoiceHandler = async (orderId) => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}/report`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download invoice. " + getError(err));
    }
  };

  // 🎨 Internal CSS styles
  const styles = {
    container: {
      margin: "20px auto",
      padding: "20px",
      maxWidth: "900px",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
      color: "#004225",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "15px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    label: {
      fontWeight: "bold",
      color: "#333",
    },
    value: {
      color: "#555",
    },
    status: {
      padding: "5px 12px",
      borderRadius: "8px",
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    statusSuccess: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
    },
    statusPending: {
      backgroundColor: "#fef9c3",
      color: "#854d0e",
    },
    statusRejected: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
    statusCancelled: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
    },
    actions: {
      marginTop: "15px",
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    button: {
      padding: "8px 14px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
    btnInvoice: {
      backgroundColor: "#2563eb",
      color: "white",
    },
    btnCancel: {
      backgroundColor: "#dc2626",
      color: "white",
    },
    reason: {
      color: "red",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.container}>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1 style={styles.heading}>Order History</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length === 0 ? (
        <MessageBox>No orders found.</MessageBox>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={styles.card}>
            <div style={styles.row}>
              <span style={styles.label}>Order ID:</span>
              <span style={styles.value}>{order._id}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Date:</span>
              <span style={styles.value}>
                {order.createdAt?.substring(0, 10)}
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Total:</span>
              <span style={styles.value}>
                {order.totalPrice
                  ? new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(order.totalPrice)
                  : "₹0"}
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Status:</span>
              <span
                style={{
                  ...styles.status,
                  ...(order.status === "delivered"
                    ? styles.statusSuccess
                    : order.status === "rejected"
                    ? styles.statusRejected
                    : order.status === "cancelled"
                    ? styles.statusCancelled
                    : styles.statusPending),
                }}
              >
                {order.status || "Pending"}
              </span>
            </div>

            {order.status === "rejected" && order.rejectReason && (
              <div style={styles.row}>
                <span style={styles.label}>Reject Reason:</span>
                <span style={styles.reason}>{order.rejectReason}</span>
              </div>
            )}

            {/* 🎯 Action buttons */}
            <div style={styles.actions}>
              <button
                style={{ ...styles.button, ...styles.btnInvoice }}
                onClick={() => downloadInvoiceHandler(order._id)}
              >
                Download Invoice
              </button>

              {order.status !== "delivered" &&
                order.status !== "rejected" &&
                order.status !== "cancelled" && (
                  <button
                    style={{ ...styles.button, ...styles.btnCancel }}
                    onClick={() => cancelOrderHandler(order._id)}
                    disabled={loadingCancel}
                  >
                    {loadingCancel ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

import React from "react";

// =========================
// SAFE DATE FORMATTER
// =========================
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

// =========================
// PREVIEW COMPONENT
// =========================
export default function InvoicePreview({ order }) {
  const items = order?.items || [];

  const total =
    Number(order?.amount || 0) +
    Number(order?.delivery_fee || 0);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>pharmart</h1>

          <p style={styles.muted}>
            Pharmacy: {order?.pharmacy?.name || order?.pharmacy}
          </p>

          {order?.pharmacy?.address && (
            <p style={styles.muted}>{order.pharmacy.address}</p>
          )}

          {order?.pharmacy?.phone && (
            <p style={styles.muted}>{order.pharmacy.phone}</p>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <h2>INVOICE</h2>

          <p style={styles.muted}>Order ID: {order?.id}</p>
          <p style={styles.muted}>Order No#: {order?.order_number}</p>

          <p style={styles.muted}>
            Order Created: {formatDate(order?.created_at)}
          </p>

          <p style={styles.muted}>
            Invoice Created: {formatDate(order?.invoice_created_at)}
          </p>

          <p style={styles.muted}>Status: {order?.status}</p>
        </div>
      </div>

      {/* CUSTOMER */}
      <div style={styles.section}>
        <h3>BILL TO</h3>
        <p>{order?.customer?.name}</p>
        <p style={styles.muted}>{order?.customer?.email}</p>
        <p style={styles.muted}>{order?.customer?.phone}</p>
      </div>

      {/* PAYMENT */}
      <div style={styles.section}>
        <h3>PAYMENT</h3>
        <p style={styles.muted}>
          Method: {order?.payment_method}
        </p>
        <p style={styles.muted}>
          Status: {order?.payment_status}
        </p>
      </div>

      {/* ITEMS TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th style={{ textAlign: "right" }}>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.unit_price}</td>
              <td style={{ textAlign: "right" }}>
                ${item.line_total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div style={styles.totalBox}>
        <div style={styles.row}>
          <span>Subtotal</span>
          <span>${order?.amount}</span>
        </div>

        <div style={styles.row}>
          <span>Shipping</span>
          <span>${order?.delivery_fee || 0}</span>
        </div>

        <div style={{ ...styles.row, fontWeight: "bold" }}>
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ marginTop: 20 }}>
        <h3>ORDER TIMELINE</h3>

        <p style={styles.muted}>
          Confirmed: {formatDate(order?.history?.confirmed_at)}
        </p>

        <p style={styles.muted}>
          Ready: {formatDate(order?.history?.ready_at)}
        </p>

        <p style={styles.muted}>
          Completed: {formatDate(order?.history?.completed_at)}
        </p>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>Thank you for your purchase via pharmart.</p>
      </div>
    </div>
  );
}

// =========================
// SIMPLE INLINE STYLES
// =========================
const styles = {
  page: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
    maxWidth: "900px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  title: {
    fontSize: "24px",
    color: "#EC4899",
    margin: 0,
  },

  section: {
    marginBottom: "15px",
  },

  muted: {
    color: "#6B7280",
    margin: "2px 0",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "5px",
  },

  totalBox: {
    marginTop: "20px",
    width: "300px",
    marginLeft: "auto",
  },

  footer: {
    marginTop: "30px",
    textAlign: "center",
    color: "#6B7280",
  },
};
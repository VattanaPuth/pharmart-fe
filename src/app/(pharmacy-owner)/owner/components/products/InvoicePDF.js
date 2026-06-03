import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

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
// STYLES (NO CSS)
// =========================
export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#EC4899",
  },

  section: {
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  table: {
    marginTop: 10,
    borderTop: "1 solid #E5E7EB",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E5E7EB",
    paddingVertical: 6,
  },

  col1: { width: "40%" },
  col2: { width: "15%" },
  col3: { width: "20%" },
  col4: { width: "25%", textAlign: "right" },

  totalBox: {
    marginTop: 20,
    width: 200,
    marginLeft: "auto",
  },

  bold: {
    fontWeight: 700,
  },

  muted: {
    color: "#6B7280",
  },
});

// =========================
// MAIN COMPONENT
// =========================
export default function InvoicePDF({ order }) {
  const items = order?.items || [];

  const total =
    Number(order?.amount || 0) +
    Number(order?.delivery_fee || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* =========================
            HEADER (ORDER + PHARMACY)
        ========================= */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>pharmart</Text>

            {/* PHARMACY (MULTI SUPPORT) */}
            <Text style={styles.muted}>
              Pharmacy: {order.pharmacy?.name || order.pharmacy}
            </Text>

            {order.pharmacy?.address && (
              <Text style={styles.muted}>
                {order.pharmacy.address}
              </Text>
            )}

            {order.pharmacy?.phone && (
              <Text style={styles.muted}>
                {order.pharmacy.phone}
              </Text>
            )}
          </View>

          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>
              INVOICE
            </Text>

            {/* ORDER IDENTIFIERS */}
            <Text style={styles.muted}>
              Order ID: {order.id}
            </Text>

            <Text style={styles.muted}>
              Order No#: {order.order_number}
            </Text>

            {/* DATES */}
            <Text style={styles.muted}>
              Order Created At: {formatDate(order.created_at)}
            </Text>

            <Text style={styles.muted}>
              Invoice Created At: {formatDate(order.invoice_created_at)}
            </Text>

            {/* STATUS */}
            <Text style={styles.muted}>
              Status: {order.status}
            </Text>

          </View>
        </View>


        {/* =========================
            CUSTOMER
        ========================= */}
        <View style={styles.section}>
          <Text style={styles.bold}>BILL TO</Text>
          <Text>{order.customer?.name}</Text>
          <Text style={styles.muted}>
            {order.customer?.email}
          </Text>
          <Text style={styles.muted}>
            {order.customer?.phone}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Payment</Text>
            <Text style={styles.muted}>
              Payment Method: {order.payment_method}
            </Text>
            <Text style={styles.muted}>
              Payment Status: {order.payment_status}
            </Text>

        </View>

        {/* =========================
            ITEMS TABLE
        ========================= */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>Item</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col3}>Price</Text>
            <Text style={styles.col4}>Total</Text>
          </View>

          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col1}>
                {item.name}
              </Text>
              <Text style={styles.col2}>
                {item.quantity}
              </Text>
              <Text style={styles.col3}>
                ${item.unit_price}
              </Text>
              <Text style={styles.col4}>
                ${item.line_total}
              </Text>
            </View>
          ))}
        </View>

        {/* =========================
            TOTALS
        ========================= */}
        <View style={styles.totalBox}>
          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>${order.amount}</Text>
          </View>

          <View style={styles.row}>
            <Text>Shipping</Text>
            <Text>${order.delivery_fee || 0}</Text>
          </View>

          <View style={[styles.row, { marginTop: 6 }]}>
            <Text style={styles.bold}>Total</Text>
            <Text style={styles.bold}>
              ${total}
            </Text>
          </View>
        </View>

        {/* =========================
            OPTIONAL HISTORY (GOOD FOR AUDIT)
        ========================= */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.bold}>
            ORDER TIMELINE
          </Text>

          <Text style={styles.muted}>
            Confirmed:{" "}
            {formatDate(order.history?.confirmed_at)}
          </Text>

          <Text style={styles.muted}>
            Ready: {formatDate(order.history?.ready_at)}
          </Text>

          <Text style={styles.muted}>
            Completed:{" "}
            {formatDate(order.history?.completed_at)}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={{ marginTop: 30, textAlign: "center" }}>
          <Text style={styles.muted}>
            Thank you for your purchase via pharmart.
          </Text>
        </View>

      </Page>
    </Document>
  );
}
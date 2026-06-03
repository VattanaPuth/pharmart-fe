"use client";

import { X, Download, Printer } from "lucide-react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import InvoicePreview from "./InvoicePreview";



export default function InvoiceModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handleDownload = async () => {
    const blob = await pdf(<InvoicePDF order={order} />).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.order_id || order.id}.pdf`;
    a.click();
  };



  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold">Invoice</h2>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-2 border rounded-lg flex items-center gap-1"
            >
              <Download size={14} /> Download
            </button>

            <PDFDownloadLink
              document={<InvoicePDF order={order} />}
              fileName={`invoice-${order.id}.pdf`}
              className="px-3 py-2 border rounded-lg"
            >
              {({ loading }) => (loading ? "Generating..." : "Quick PDF")}
            </PDFDownloadLink>

            <button onClick={onClose} className="p-2">
              <X />
            </button>
          </div>
        </div>

        {/* PREVIEW INFO */}
        <div className="p-6 text-sm text-gray-600">
         <InvoicePreview order={order}/>
        </div>
      </div>
    </div>
  );
}
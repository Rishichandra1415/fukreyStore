"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Download, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";

export default function OrderSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const [orderId, setOrderId] = useState<string>("");

    useEffect(() => {
        if (params.id) {
            // Decode if it's URL encoded
            setOrderId(decodeURIComponent(params.id as string));
        } else {
            router.push("/");
        }
    }, [params.id, router]);

    const generateInvoice = () => {
        const doc = new jsPDF();

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(33, 33, 33);
        doc.text("FUKREY", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text("Store", 105, 26, { align: "center" });

        // Invoice Title
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text("INVOICE", 105, 45, { align: "center" });

        // Order Details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Order ID: ${orderId}`, 20, 65);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 75);
        doc.text(`Estimated Delivery: 5 - 7 Days (Pan-India)`, 20, 85);

        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(20, 100, 170, 10, "F");
        doc.setFont("helvetica", "bold");
        doc.text("Item", 25, 107);
        doc.text("Quantity", 120, 107);
        doc.text("Total", 160, 107);

        // Table Content (Mock data since we don't have order details in this route currently)
        doc.setFont("helvetica", "normal");
        doc.text("Fukrey Store Item", 25, 122);
        doc.text("1", 125, 122);
        doc.text("Paid", 160, 122);

        // Footer
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for shopping with Fukrey Store!", 105, 270, { align: "center" });

        // Save the PDF
        doc.save(`Fukrey_Invoice_${orderId}.pdf`);
    };

    if (!orderId) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl overflow-hidden p-8 text-center space-y-8">

                {/* Success Animation / Icon */}
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>

                {/* Main Text */}
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Order Placed Successfully!
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Thank you for your purchase. We've received your order and will begin processing it right away.
                    </p>
                </div>

                {/* Order Info Card */}
                <div className="bg-gray-50 rounded-xl p-6 text-left border border-gray-100">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-lg font-mono font-semibold text-gray-900 break-all">{orderId}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Estimated Delivery</p>
                        <p className="text-base font-medium text-gray-900 flex items-center">
                            5–7 days <span className="text-gray-500 font-normal ml-2">(Pan-India)</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                    <button
                        onClick={generateInvoice}
                        className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Download Invoice (PDF)
                    </button>

                    <Link
                        href="/"
                        className="w-full flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        <Home className="w-5 h-5 mr-2 text-gray-400" />
                        Return to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if this is a verification request or an order creation request
        if (body.action === "verify") {
            return verifyPayment(body);
        } else {
            return createOrder(body);
        }
    } catch (error) {
        console.error("Razorpay route error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

async function createOrder(body: any) {
    const { amount, currency = "INR" } = body;

    if (!amount) {
        return NextResponse.json(
            { error: "Amount is required" },
            { status: 400 }
        );
    }

    // Ensure environment variables are set
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay environment variables are not set");
        return NextResponse.json(
            { error: "Payment gateway configuration error" },
            { status: 500 }
        );
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit
        currency,
        receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
        order_id: order.id,
        currency: order.currency,
        amount: order.amount,
    }, { status: 200 });
}

function verifyPayment(body: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
            { error: "Missing required payment parameters" },
            { status: 400 }
        );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { error: "Payment gateway configuration error" },
            { status: 500 }
        );
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        return NextResponse.json(
            { success: true, message: "Payment verified successfully" },
            { status: 200 }
        );
    } else {
        return NextResponse.json(
            { success: false, error: "Invalid signature" },
            { status: 400 }
        );
    }
}

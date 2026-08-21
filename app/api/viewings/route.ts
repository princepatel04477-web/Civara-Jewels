import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, city, date, piece, notes } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Full Name is required" },
        { status: 400 }
      );
    }

    // Validate 10-digit Indian phone (optionally with +91 or leading 0)
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const last10Digits = cleanPhone.slice(-10);
    if (last10Digits.length !== 10) {
      return NextResponse.json(
        { error: "A valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    if (!city || typeof city !== "string") {
      return NextResponse.json(
        { error: "Preferred city or virtual concierge is required" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "Preferred date is required" },
        { status: 400 }
      );
    }

    // Check minimum date (today + 2 days)
    const bookingDate = new Date(date);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);

    if (bookingDate < minDate) {
      return NextResponse.json(
        { error: "Preferred date must be at least 2 days in advance" },
        { status: 400 }
      );
    }

    // In production, save to database and dispatch email/notification
    console.log("[Atelier Viewing Request]", {
      name: name.trim(),
      phone: `+91${last10Digits}`,
      city,
      date,
      piece: piece?.trim() || "General viewing enquiry",
      notes: notes?.trim() || "",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Received. A private concierge will confirm within 4 hours.",
    });
  } catch (error) {
    console.error("[Viewing Request Error]", error);
    return NextResponse.json(
      { error: "Failed to process viewing request" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    console.log("[Atelier Newsletter Subscription]", {
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
      source: "Footer First Look",
    });

    return NextResponse.json({
      success: true,
      message: "Welcome. First release lands soon.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to join subscriber list" },
      { status: 500 }
    );
  }
}

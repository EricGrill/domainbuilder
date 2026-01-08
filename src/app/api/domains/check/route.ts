import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export interface CheckRequestBody {
  name: string;
  tld?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckRequestBody = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 }
      );
    }

    const checkRequest = {
      name: body.name.toLowerCase().trim(),
      tld: body.tld || "com",
    };

    const response = await fetch(`${PYTHON_API_URL}/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Domain check failed", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Check API error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "Domain service unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

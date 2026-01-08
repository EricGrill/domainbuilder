import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export interface SearchRequestBody {
  keywords: string[];
  tlds?: string[];
  count?: number;
  prefixes?: string[];
  suffixes?: string[];
  metaphors?: string[];
  industry?: string;
  include_combinations?: boolean;
  min_length?: number;
  max_length?: number;
  check_availability?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequestBody = await request.json();

    // Validate required fields
    if (!body.keywords || body.keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords are required" },
        { status: 400 }
      );
    }

    if (body.keywords.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 keywords allowed" },
        { status: 400 }
      );
    }

    // Set defaults
    const searchRequest = {
      keywords: body.keywords.map((k) => k.toLowerCase().trim()),
      tlds: body.tlds || ["com"],
      count: Math.min(body.count || 30, 100),
      prefixes: body.prefixes,
      suffixes: body.suffixes,
      metaphors: body.metaphors,
      industry: body.industry,
      include_combinations: body.include_combinations ?? true,
      min_length: body.min_length || 4,
      max_length: body.max_length || 15,
      check_availability: body.check_availability ?? true,
    };

    // Call Python API
    const response = await fetch(`${PYTHON_API_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Python API error:", error);
      return NextResponse.json(
        { error: "Domain search failed", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API error:", error);

    // If Python API is not available, fall back to mock data
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Domain service unavailable",
          message: "Python API is not running. Start it with: python services/python-api/main.py",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

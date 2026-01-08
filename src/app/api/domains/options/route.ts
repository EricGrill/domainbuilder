import { NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Fallback options if Python API is unavailable
const FALLBACK_OPTIONS = {
  prefixes: {
    action: ["go", "get", "try", "use", "run", "do", "be"],
    possessive: ["my", "our", "the", "your"],
    greeting: ["hey", "hi", "hello"],
    team: ["team", "crew", "squad", "club"],
    time: ["daily", "now", "instant", "quick", "fast"],
  },
  suffixes: {
    app: ["ly", "ify", "io", "app", "er"],
    hub: ["hub", "lab", "hq", "base", "zone"],
    action: ["up", "now", "go", "it"],
    bot: ["bot", "ai", "sync", "flow"],
    ware: ["ware", "works", "stack", "kit"],
  },
  metaphors: {
    speed: ["swift", "flash", "bolt", "dash", "zoom"],
    strength: ["titan", "atlas", "force", "power", "mighty"],
    growth: ["bloom", "sprout", "rise", "flourish", "thrive"],
    intelligence: ["sage", "oracle", "nexus", "mind", "brain"],
    connection: ["bridge", "link", "mesh", "weave", "bond"],
    creation: ["forge", "craft", "make", "build", "create"],
    nature: ["river", "mountain", "forest", "ocean", "sky"],
    space: ["nova", "stellar", "orbit", "cosmos", "lunar"],
    tech: ["byte", "pixel", "code", "data", "cyber"],
    action: ["launch", "spark", "ignite", "surge", "drive"],
  },
  industries: [
    "tech",
    "finance",
    "health",
    "education",
    "ecommerce",
    "travel",
    "food",
    "creative",
  ],
  tlds: ["com", "io", "co", "net", "org", "ai", "app", "dev", "xyz", "tech"],
};

export async function GET() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/options`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Return fallback options
      return NextResponse.json(FALLBACK_OPTIONS);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Options API error:", error);
    // Return fallback options
    return NextResponse.json(FALLBACK_OPTIONS);
  }
}

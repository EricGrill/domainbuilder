import { NextRequest, NextResponse } from "next/server";

// Industry categories with associated keywords and styles
const INDUSTRIES = {
  tech: {
    name: "Technology",
    prefixes: ["cyber", "tech", "digi", "code", "data", "cloud", "net", "web"],
    suffixes: ["tech", "labs", "io", "dev", "hub", "stack", "byte", "bit"],
    themes: ["innovation", "speed", "connection", "intelligence"],
  },
  health: {
    name: "Health & Wellness",
    prefixes: ["vita", "heal", "zen", "pure", "life", "well", "care", "fit"],
    suffixes: ["health", "life", "care", "well", "fit", "med", "cure", "zen"],
    themes: ["wellness", "vitality", "balance", "nature"],
  },
  finance: {
    name: "Finance",
    prefixes: ["fin", "cap", "wealth", "cash", "pay", "fund", "invest", "money"],
    suffixes: ["pay", "fin", "capital", "fund", "bank", "wealth", "cash", "coin"],
    themes: ["trust", "growth", "security", "prosperity"],
  },
  creative: {
    name: "Creative & Design",
    prefixes: ["art", "pixel", "design", "craft", "studio", "visual", "color", "ink"],
    suffixes: ["studio", "designs", "creative", "arts", "works", "craft", "lab", "co"],
    themes: ["creativity", "expression", "beauty", "vision"],
  },
  ecommerce: {
    name: "E-Commerce",
    prefixes: ["shop", "buy", "cart", "store", "deal", "market", "sell", "trade"],
    suffixes: ["shop", "store", "mart", "bay", "market", "deals", "hub", "box"],
    themes: ["convenience", "value", "selection", "service"],
  },
  education: {
    name: "Education",
    prefixes: ["learn", "edu", "study", "class", "skill", "mind", "brain", "smart"],
    suffixes: ["learn", "academy", "school", "class", "edu", "skills", "mind", "iq"],
    themes: ["knowledge", "growth", "discovery", "mastery"],
  },
  food: {
    name: "Food & Beverage",
    prefixes: ["taste", "fresh", "yum", "bite", "flavor", "chef", "cook", "eat"],
    suffixes: ["eats", "bites", "kitchen", "foods", "taste", "chef", "menu", "table"],
    themes: ["flavor", "freshness", "quality", "experience"],
  },
  travel: {
    name: "Travel",
    prefixes: ["go", "trip", "fly", "tour", "voyage", "wander", "roam", "jet"],
    suffixes: ["trips", "tours", "travel", "ways", "go", "fly", "voyage", "away"],
    themes: ["adventure", "discovery", "freedom", "experience"],
  },
};

// Name generation patterns
const PATTERNS = {
  prefix_keyword: (prefix: string, keyword: string) => `${prefix}${keyword}`,
  keyword_suffix: (keyword: string, suffix: string) => `${keyword}${suffix}`,
  compound: (word1: string, word2: string) => `${word1}${word2}`,
  with_vowel: (word1: string, word2: string) => {
    const vowels = ["a", "e", "i", "o", "u"];
    const vowel = vowels[Math.floor(Math.random() * vowels.length)];
    return `${word1}${vowel}${word2}`;
  },
  truncate_blend: (word1: string, word2: string) => {
    const half1 = word1.slice(0, Math.ceil(word1.length / 2));
    const half2 = word2.slice(Math.floor(word2.length / 2));
    return `${half1}${half2}`;
  },
};

// Creative word transformations
const transformWord = (word: string): string[] => {
  const transforms: string[] = [word];

  // Letter swaps
  if (word.includes("c")) transforms.push(word.replace(/c/g, "k"));
  if (word.includes("s")) transforms.push(word.replace(/s/g, "z"));
  if (word.includes("x")) transforms.push(word.replace(/x/g, "ks"));

  // Endings
  if (word.endsWith("er")) transforms.push(word.slice(0, -2) + "r");
  if (word.endsWith("y")) transforms.push(word.slice(0, -1) + "i");

  // Doubling
  if (word.length <= 6) transforms.push(word + word.slice(-1));

  return [...new Set(transforms)];
};

// Generate AI-style names (mock implementation - can be connected to OpenAI)
function generateAINames(
  keywords: string[],
  industry?: string,
  count: number = 20
): Array<{ name: string; score: number; source: string; reasoning?: string }> {
  const results: Array<{ name: string; score: number; source: string; reasoning?: string }> = [];
  const seen = new Set<string>();

  const industryData = industry ? INDUSTRIES[industry as keyof typeof INDUSTRIES] : null;
  const prefixes = industryData?.prefixes || ["go", "my", "get", "try", "use", "the"];
  const suffixes = industryData?.suffixes || ["ly", "ify", "hub", "lab", "io", "co"];

  // Generate using various patterns
  for (const keyword of keywords) {
    const kwLower = keyword.toLowerCase();
    const kwTransforms = transformWord(kwLower);

    for (const kw of kwTransforms) {
      // Prefix + keyword
      for (const prefix of prefixes.slice(0, 4)) {
        const name = PATTERNS.prefix_keyword(prefix, kw);
        if (!seen.has(name) && name.length <= 15) {
          seen.add(name);
          results.push({
            name,
            score: 75 + Math.floor(Math.random() * 20),
            source: "ai",
            reasoning: `Combines "${prefix}" with your keyword for a memorable brand`,
          });
        }
      }

      // Keyword + suffix
      for (const suffix of suffixes.slice(0, 4)) {
        const name = PATTERNS.keyword_suffix(kw, suffix);
        if (!seen.has(name) && name.length <= 15) {
          seen.add(name);
          results.push({
            name,
            score: 70 + Math.floor(Math.random() * 25),
            source: "ai",
            reasoning: `Your keyword with "${suffix}" creates a modern tech feel`,
          });
        }
      }
    }

    // Compound words from multiple keywords
    if (keywords.length > 1) {
      for (const other of keywords) {
        if (other !== keyword) {
          const compound = PATTERNS.compound(
            kwLower.slice(0, 4),
            other.toLowerCase().slice(0, 4)
          );
          if (!seen.has(compound)) {
            seen.add(compound);
            results.push({
              name: compound,
              score: 80 + Math.floor(Math.random() * 15),
              source: "ai",
              reasoning: `Blends your keywords into a unique, brandable name`,
            });
          }

          const blend = PATTERNS.truncate_blend(kwLower, other.toLowerCase());
          if (!seen.has(blend) && blend.length >= 4) {
            seen.add(blend);
            results.push({
              name: blend,
              score: 78 + Math.floor(Math.random() * 17),
              source: "ai",
              reasoning: `Creative portmanteau combining your concepts`,
            });
          }
        }
      }
    }
  }

  // Add some industry-specific suggestions
  if (industryData) {
    for (const theme of industryData.themes) {
      const themeLower = theme.toLowerCase();
      for (const keyword of keywords.slice(0, 2)) {
        const name = `${keyword.toLowerCase()}${themeLower.slice(0, 4)}`;
        if (!seen.has(name) && name.length <= 12) {
          seen.add(name);
          results.push({
            name,
            score: 82 + Math.floor(Math.random() * 13),
            source: "ai",
            reasoning: `Incorporates ${industryData.name} theme of "${theme}"`,
          });
        }
      }
    }
  }

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords, industry, count = 20, style } = body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords array is required" },
        { status: 400 }
      );
    }

    // Generate AI suggestions
    const suggestions = generateAINames(keywords, industry, count);

    return NextResponse.json({
      suggestions,
      meta: {
        keywords,
        industry,
        count: suggestions.length,
        model: "brandspark-v1", // Would be "gpt-4" when connected
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate names" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available industries
  return NextResponse.json({
    industries: Object.entries(INDUSTRIES).map(([key, value]) => ({
      id: key,
      name: value.name,
      themes: value.themes,
    })),
  });
}

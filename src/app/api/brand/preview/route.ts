import { NextRequest, NextResponse } from "next/server";

// Color palette generation based on domain name
function generateColorPalette(name: string): {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  name: string;
} {
  // Generate a seed from the domain name
  let seed = 0;
  for (let i = 0; i < name.length; i++) {
    seed += name.charCodeAt(i);
  }

  // Predefined palettes
  const palettes = [
    {
      name: "Ocean Breeze",
      primary: "#0D9488",
      secondary: "#14B8A6",
      accent: "#F97316",
      background: "#F0FDFA",
      text: "#134E4A",
    },
    {
      name: "Sunset Glow",
      primary: "#F97316",
      secondary: "#FB923C",
      accent: "#0D9488",
      background: "#FFF7ED",
      text: "#7C2D12",
    },
    {
      name: "Royal Purple",
      primary: "#7C3AED",
      secondary: "#8B5CF6",
      accent: "#EC4899",
      background: "#FAF5FF",
      text: "#4C1D95",
    },
    {
      name: "Forest Green",
      primary: "#059669",
      secondary: "#10B981",
      accent: "#FBBF24",
      background: "#ECFDF5",
      text: "#064E3B",
    },
    {
      name: "Midnight Blue",
      primary: "#1E40AF",
      secondary: "#3B82F6",
      accent: "#F59E0B",
      background: "#EFF6FF",
      text: "#1E3A8A",
    },
    {
      name: "Coral Reef",
      primary: "#F43F5E",
      secondary: "#FB7185",
      accent: "#06B6D4",
      background: "#FFF1F2",
      text: "#9F1239",
    },
    {
      name: "Slate Modern",
      primary: "#475569",
      secondary: "#64748B",
      accent: "#0EA5E9",
      background: "#F8FAFC",
      text: "#1E293B",
    },
    {
      name: "Emerald Tech",
      primary: "#10B981",
      secondary: "#34D399",
      accent: "#6366F1",
      background: "#ECFDF5",
      text: "#047857",
    },
  ];

  return palettes[seed % palettes.length];
}

// Generate logo concepts (text-based for now)
function generateLogoSuggestions(name: string, tld: string): Array<{
  style: string;
  icon: string;
  description: string;
  fontStyle: string;
}> {
  const firstLetter = name.charAt(0).toUpperCase();
  const cleanName = name.replace(/[^a-zA-Z]/g, "");

  const styles = [
    {
      style: "minimal",
      icon: firstLetter,
      description: "Clean, minimal lettermark with your brand initial",
      fontStyle: "sans-serif",
    },
    {
      style: "bold",
      icon: cleanName.slice(0, 2).toUpperCase(),
      description: "Bold two-letter monogram for strong brand presence",
      fontStyle: "bold",
    },
    {
      style: "tech",
      icon: `<${firstLetter}/>`,
      description: "Tech-inspired mark with code-like styling",
      fontStyle: "monospace",
    },
    {
      style: "modern",
      icon: firstLetter.toLowerCase(),
      description: "Modern lowercase lettermark with rounded edges",
      fontStyle: "rounded",
    },
  ];

  return styles;
}

// Generate social media handle suggestions
function generateSocialHandles(name: string): Array<{
  platform: string;
  handle: string;
  available: boolean | null;
}> {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  return [
    { platform: "twitter", handle: `@${cleanName}`, available: null },
    { platform: "instagram", handle: `@${cleanName}`, available: null },
    { platform: "linkedin", handle: `/company/${cleanName}`, available: null },
    { platform: "facebook", handle: `/${cleanName}`, available: null },
    { platform: "tiktok", handle: `@${cleanName}`, available: null },
    { platform: "github", handle: `/${cleanName}`, available: null },
  ];
}

// Generate business card preview data
function generateBusinessCardData(
  name: string,
  tld: string,
  palette: ReturnType<typeof generateColorPalette>
) {
  return {
    companyName: name.charAt(0).toUpperCase() + name.slice(1),
    domain: `${name}.${tld}`,
    email: `hello@${name}.${tld}`,
    tagline: `Innovating for tomorrow`,
    colors: {
      background: palette.background,
      text: palette.text,
      accent: palette.primary,
    },
  };
}

// Generate website mockup data
function generateWebsiteMockup(
  name: string,
  tld: string,
  palette: ReturnType<typeof generateColorPalette>
) {
  const brandName = name.charAt(0).toUpperCase() + name.slice(1);

  return {
    header: {
      logo: brandName,
      nav: ["Features", "Pricing", "About", "Contact"],
      cta: "Get Started",
    },
    hero: {
      headline: `Welcome to ${brandName}`,
      subheadline: "Building the future, one step at a time",
      primaryButton: "Start Free Trial",
      secondaryButton: "Learn More",
    },
    features: [
      { title: "Fast", description: "Lightning-quick performance" },
      { title: "Secure", description: "Enterprise-grade security" },
      { title: "Scalable", description: "Grows with your business" },
    ],
    footer: {
      copyright: `© ${new Date().getFullYear()} ${brandName}`,
      links: ["Privacy", "Terms", "Contact"],
    },
    colors: palette,
  };
}

// Generate font pairing suggestions
function generateFontPairings(name: string): Array<{
  heading: string;
  body: string;
  style: string;
}> {
  const pairings = [
    { heading: "Inter", body: "Inter", style: "Modern & Clean" },
    { heading: "Poppins", body: "Open Sans", style: "Friendly & Approachable" },
    { heading: "Playfair Display", body: "Lato", style: "Elegant & Professional" },
    { heading: "Montserrat", body: "Roboto", style: "Bold & Contemporary" },
    { heading: "Space Grotesk", body: "DM Sans", style: "Tech & Startup" },
    { heading: "Outfit", body: "Plus Jakarta Sans", style: "Fresh & Minimal" },
  ];

  // Pick based on name characteristics
  let index = 0;
  for (let i = 0; i < name.length; i++) {
    index += name.charCodeAt(i);
  }

  // Return top 3 most relevant
  const start = index % pairings.length;
  return [
    pairings[start],
    pairings[(start + 1) % pairings.length],
    pairings[(start + 2) % pairings.length],
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, tld = "com" } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 }
      );
    }

    // Generate all brand assets
    const palette = generateColorPalette(name);
    const logos = generateLogoSuggestions(name, tld);
    const socialHandles = generateSocialHandles(name);
    const businessCard = generateBusinessCardData(name, tld, palette);
    const websiteMockup = generateWebsiteMockup(name, tld, palette);
    const fontPairings = generateFontPairings(name);

    return NextResponse.json({
      domain: `${name}.${tld}`,
      brandName: name.charAt(0).toUpperCase() + name.slice(1),
      palette,
      logos,
      socialHandles,
      businessCard,
      websiteMockup,
      fontPairings,
    });
  } catch (error) {
    console.error("Brand preview error:", error);
    return NextResponse.json(
      { error: "Failed to generate brand preview" },
      { status: 500 }
    );
  }
}

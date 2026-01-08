#!/usr/bin/env python3
"""FastAPI server for Brandspark domain search service."""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import asyncio

from domain_service import (
    generate_domain_ideas,
    check_domain,
    check_domains_batch,
    calculate_name_score,
    get_metaphors_for_themes,
    get_available_themes,
    get_available_prefixes,
    get_available_suffixes,
    get_available_industries,
)

app = FastAPI(
    title="Brandspark Domain API",
    description="AI-powered domain name generation and availability checking",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class GenerateRequest(BaseModel):
    keywords: list[str] = Field(..., min_length=1, max_length=5, description="Keywords to generate domain ideas from")
    count: int = Field(default=50, ge=1, le=100, description="Number of ideas to generate")
    prefixes: Optional[list[str]] = Field(default=None, description="Prefix categories to use")
    suffixes: Optional[list[str]] = Field(default=None, description="Suffix categories to use")
    metaphors: Optional[list[str]] = Field(default=None, description="Metaphor themes to use")
    industry: Optional[str] = Field(default=None, description="Industry for specific suggestions")
    include_combinations: bool = Field(default=True, description="Include word combinations")
    min_length: int = Field(default=4, ge=3, le=10, description="Minimum domain length")
    max_length: int = Field(default=15, ge=8, le=20, description="Maximum domain length")


class CheckRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=63, description="Domain name without TLD")
    tld: str = Field(default="com", description="Top-level domain")


class CheckBatchRequest(BaseModel):
    names: list[str] = Field(..., min_length=1, max_length=100, description="Domain names to check")
    tld: str = Field(default="com", description="Top-level domain")


class SearchRequest(BaseModel):
    keywords: list[str] = Field(..., min_length=1, max_length=5)
    tlds: list[str] = Field(default=["com"], description="TLDs to check")
    count: int = Field(default=30, ge=1, le=100)
    prefixes: Optional[list[str]] = None
    suffixes: Optional[list[str]] = None
    metaphors: Optional[list[str]] = None
    industry: Optional[str] = None
    include_combinations: bool = True
    min_length: int = Field(default=4, ge=3, le=10)
    max_length: int = Field(default=15, ge=8, le=20)
    check_availability: bool = Field(default=True, description="Check availability for each domain")


class DomainResult(BaseModel):
    domain: str
    name: str
    tld: str
    available: Optional[bool]
    source: str
    score: Optional[int] = None
    error: Optional[str] = None


class GenerateResponse(BaseModel):
    ideas: list[dict]
    total: int


class SearchResponse(BaseModel):
    results: list[DomainResult]
    total: int
    available_count: int
    taken_count: int


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "Brandspark Domain API", "version": "1.0.0"}


@app.post("/generate", response_model=GenerateResponse)
async def generate_domains(request: GenerateRequest):
    """Generate domain name ideas from keywords."""
    try:
        ideas = generate_domain_ideas(
            keywords=request.keywords,
            count=request.count,
            use_prefixes=request.prefixes,
            use_suffixes=request.suffixes,
            use_metaphors=request.metaphors,
            industry=request.industry,
            include_combinations=request.include_combinations,
            min_length=request.min_length,
            max_length=request.max_length
        )

        # Add scores to each idea
        for idea in ideas:
            score_result = calculate_name_score(idea['name'])
            idea['score'] = score_result['score']

        return GenerateResponse(ideas=ideas, total=len(ideas))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/check")
async def check_single_domain(request: CheckRequest):
    """Check availability of a single domain."""
    try:
        result = await check_domain(request.name, request.tld)
        score_result = calculate_name_score(request.name)
        result['score'] = score_result['score']
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/check-batch")
async def check_batch_domains(request: CheckBatchRequest):
    """Check availability of multiple domains."""
    try:
        results = await check_domains_batch(request.names, request.tld)
        for result in results:
            score_result = calculate_name_score(result['name'])
            result['score'] = score_result['score']
        return {"results": results, "total": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search", response_model=SearchResponse)
async def search_domains(request: SearchRequest):
    """Full search: generate ideas and optionally check availability across TLDs."""
    try:
        # Generate ideas
        ideas = generate_domain_ideas(
            keywords=request.keywords,
            count=request.count,
            use_prefixes=request.prefixes,
            use_suffixes=request.suffixes,
            use_metaphors=request.metaphors,
            industry=request.industry,
            include_combinations=request.include_combinations,
            min_length=request.min_length,
            max_length=request.max_length
        )

        results = []

        if request.check_availability:
            # Check each idea against all requested TLDs
            for idea in ideas:
                for tld in request.tlds:
                    check_result = await check_domain(idea['name'], tld)
                    score_result = calculate_name_score(idea['name'])

                    results.append(DomainResult(
                        domain=check_result['domain'],
                        name=check_result['name'],
                        tld=tld,
                        available=check_result.get('available'),
                        source=idea['source'],
                        score=score_result['score'],
                        error=check_result.get('error')
                    ))
        else:
            # Just return generated ideas without checking
            for idea in ideas:
                for tld in request.tlds:
                    score_result = calculate_name_score(idea['name'])
                    results.append(DomainResult(
                        domain=f"{idea['name']}.{tld}",
                        name=idea['name'],
                        tld=tld,
                        available=None,
                        source=idea['source'],
                        score=score_result['score']
                    ))

        available_count = sum(1 for r in results if r.available is True)
        taken_count = sum(1 for r in results if r.available is False)

        return SearchResponse(
            results=results,
            total=len(results),
            available_count=available_count,
            taken_count=taken_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/score/{name}")
async def score_domain(name: str):
    """Calculate brandability score for a domain name."""
    try:
        result = calculate_name_score(name)
        return {"name": name, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metaphors")
async def get_metaphors(themes: list[str] = Query(default=[])):
    """Get metaphor words for specified themes."""
    if themes:
        words = get_metaphors_for_themes(themes)
        return {"themes": themes, "words": words}
    else:
        return {"themes": get_available_themes()}


@app.get("/options")
async def get_options():
    """Get all available generation options."""
    return {
        "prefixes": get_available_prefixes(),
        "suffixes": get_available_suffixes(),
        "metaphors": get_available_themes(),
        "industries": get_available_industries(),
        "tlds": ["com", "io", "co", "net", "org", "ai", "app", "dev", "xyz", "tech"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

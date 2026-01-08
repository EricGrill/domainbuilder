#!/usr/bin/env python3
"""Enhanced domain name generator and availability checker for Brandspark."""

import subprocess
import itertools
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Optional

# Metaphor themes for creative naming
METAPHORS = {
    'speed': ['swift', 'flash', 'bolt', 'dash', 'zoom', 'rapid', 'turbo', 'velocity', 'blitz', 'rocket'],
    'strength': ['titan', 'atlas', 'force', 'power', 'mighty', 'iron', 'steel', 'solid', 'fortress', 'anchor'],
    'growth': ['bloom', 'sprout', 'rise', 'flourish', 'thrive', 'scale', 'climb', 'surge', 'leap', 'soar'],
    'intelligence': ['sage', 'oracle', 'nexus', 'mind', 'brain', 'genius', 'wise', 'clever', 'sharp', 'bright'],
    'connection': ['bridge', 'link', 'mesh', 'weave', 'bond', 'sync', 'unite', 'join', 'connect', 'hub'],
    'creation': ['forge', 'craft', 'make', 'build', 'create', 'mint', 'spark', 'ignite', 'form', 'shape'],
    'nature': ['river', 'mountain', 'forest', 'ocean', 'sky', 'leaf', 'stone', 'wave', 'wind', 'flame'],
    'space': ['nova', 'stellar', 'orbit', 'cosmos', 'lunar', 'astro', 'star', 'galaxy', 'nebula', 'comet'],
    'tech': ['byte', 'pixel', 'code', 'data', 'cyber', 'digital', 'cloud', 'node', 'core', 'quantum'],
    'action': ['launch', 'spark', 'ignite', 'surge', 'drive', 'push', 'run', 'go', 'start', 'kick']
}

# Prefixes for domain generation
PREFIXES = {
    'action': ['go', 'get', 'try', 'use', 'run', 'do', 'be'],
    'possessive': ['my', 'our', 'the', 'your'],
    'greeting': ['hey', 'hi', 'hello'],
    'team': ['team', 'crew', 'squad', 'club'],
    'time': ['daily', 'now', 'instant', 'quick', 'fast']
}

# Suffixes for domain generation
SUFFIXES = {
    'app': ['ly', 'ify', 'io', 'app', 'er'],
    'hub': ['hub', 'lab', 'hq', 'base', 'zone'],
    'action': ['up', 'now', 'go', 'it'],
    'bot': ['bot', 'ai', 'sync', 'flow'],
    'ware': ['ware', 'works', 'stack', 'kit']
}

# Industry-specific word banks
INDUSTRY_WORDS = {
    'tech': ['code', 'dev', 'stack', 'api', 'cloud', 'data', 'cyber', 'digital', 'smart', 'auto'],
    'finance': ['pay', 'fund', 'cash', 'coin', 'wallet', 'ledger', 'capital', 'wealth', 'invest', 'trade'],
    'health': ['care', 'med', 'health', 'vita', 'life', 'well', 'fit', 'heal', 'cure', 'pulse'],
    'education': ['learn', 'edu', 'study', 'skill', 'course', 'class', 'mentor', 'tutor', 'academy', 'school'],
    'ecommerce': ['shop', 'store', 'buy', 'cart', 'deal', 'market', 'sell', 'trade', 'outlet', 'bazaar'],
    'travel': ['trip', 'tour', 'voyage', 'journey', 'explore', 'wander', 'roam', 'trek', 'venture', 'nomad'],
    'food': ['bite', 'taste', 'chef', 'kitchen', 'meal', 'dish', 'feast', 'flavor', 'spice', 'fresh'],
    'creative': ['art', 'design', 'studio', 'craft', 'pixel', 'canvas', 'palette', 'muse', 'create', 'vision']
}


def generate_domain_ideas(
    keywords: list[str],
    count: int = 50,
    use_prefixes: Optional[list[str]] = None,
    use_suffixes: Optional[list[str]] = None,
    use_metaphors: Optional[list[str]] = None,
    industry: Optional[str] = None,
    include_combinations: bool = True,
    min_length: int = 4,
    max_length: int = 15
) -> list[dict]:
    """Generate brandable domain name ideas from keywords with metadata."""
    ideas = []
    seen = set()

    def add_idea(name: str, source: str):
        name = name.lower().replace(' ', '').replace('-', '')
        if name not in seen and min_length <= len(name) <= max_length:
            seen.add(name)
            ideas.append({
                'name': name,
                'source': source,
                'length': len(name)
            })

    # Get prefixes to use
    prefixes_to_use = []
    if use_prefixes:
        for category in use_prefixes:
            if category in PREFIXES:
                prefixes_to_use.extend(PREFIXES[category])
    else:
        prefixes_to_use = PREFIXES['action'] + PREFIXES['possessive'][:2]

    # Get suffixes to use
    suffixes_to_use = []
    if use_suffixes:
        for category in use_suffixes:
            if category in SUFFIXES:
                suffixes_to_use.extend(SUFFIXES[category])
    else:
        suffixes_to_use = SUFFIXES['app'] + SUFFIXES['hub'][:2]

    # Add base keywords
    for kw in keywords:
        add_idea(kw, 'keyword')

    # Prefix + keyword combinations
    for prefix, kw in itertools.product(prefixes_to_use, keywords):
        add_idea(f"{prefix}{kw}", f"prefix:{prefix}")

    # Keyword + suffix combinations
    for kw, suffix in itertools.product(keywords, suffixes_to_use):
        add_idea(f"{kw}{suffix}", f"suffix:{suffix}")

    # Word combinations (if multiple keywords)
    if include_combinations and len(keywords) >= 2:
        for i in range(len(keywords)):
            for j in range(len(keywords)):
                if i != j:
                    add_idea(f"{keywords[i]}{keywords[j]}", "combination")

    # Metaphor combinations
    if use_metaphors:
        metaphor_words = []
        for theme in use_metaphors:
            if theme in METAPHORS:
                metaphor_words.extend(METAPHORS[theme])

        for kw, metaphor in itertools.product(keywords, metaphor_words):
            add_idea(f"{metaphor}{kw}", f"metaphor:{metaphor}")
            add_idea(f"{kw}{metaphor}", f"metaphor:{metaphor}")

    # Industry-specific combinations
    if industry and industry in INDUSTRY_WORDS:
        industry_words = INDUSTRY_WORDS[industry]
        for kw, ind_word in itertools.product(keywords, industry_words[:5]):
            add_idea(f"{kw}{ind_word}", f"industry:{industry}")
            add_idea(f"{ind_word}{kw}", f"industry:{industry}")

    # Letter swap variations (creative spellings)
    letter_swaps = [('c', 'k'), ('s', 'z'), ('i', 'y'), ('er', 'r'), ('oo', 'u')]
    for idea in list(ideas)[:20]:  # Only do swaps on first 20
        name = idea['name']
        for old, new in letter_swaps:
            if old in name:
                swapped = name.replace(old, new, 1)
                add_idea(swapped, f"spelling:{old}→{new}")

    return ideas[:count]


def check_domain_sync(name: str, tld: str = 'com') -> dict:
    """Check if a domain is available using nslookup (synchronous)."""
    domain = f"{name}.{tld}"
    try:
        result = subprocess.run(
            ['nslookup', domain],
            capture_output=True,
            text=True,
            timeout=5
        )
        output = result.stdout + result.stderr
        if 'Non-existent domain' in output or 'NXDOMAIN' in output or "can't find" in output.lower():
            return {'domain': domain, 'name': name, 'tld': tld, 'available': True}
        else:
            return {'domain': domain, 'name': name, 'tld': tld, 'available': False}
    except subprocess.TimeoutExpired:
        return {'domain': domain, 'name': name, 'tld': tld, 'available': None, 'error': 'timeout'}
    except Exception as e:
        return {'domain': domain, 'name': name, 'tld': tld, 'available': None, 'error': str(e)}


async def check_domain(name: str, tld: str = 'com') -> dict:
    """Check if a domain is available using nslookup (async wrapper)."""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        result = await loop.run_in_executor(executor, check_domain_sync, name, tld)
    return result


async def check_domains_batch(names: list[str], tld: str = 'com', max_concurrent: int = 10) -> list[dict]:
    """Check multiple domains concurrently."""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def check_with_semaphore(name: str) -> dict:
        async with semaphore:
            return await check_domain(name, tld)

    tasks = [check_with_semaphore(name) for name in names]
    results = await asyncio.gather(*tasks)
    return results


def calculate_name_score(name: str) -> dict:
    """Calculate a brandability score for a domain name."""
    score = 100
    factors = {}

    # Length score (optimal: 6-10 characters)
    length = len(name)
    if length < 4:
        score -= 20
        factors['length'] = 'too short'
    elif length <= 6:
        factors['length'] = 'excellent'
    elif length <= 10:
        factors['length'] = 'good'
    elif length <= 12:
        score -= 5
        factors['length'] = 'acceptable'
    else:
        score -= 15
        factors['length'] = 'too long'

    # Pronounceability (vowel/consonant ratio)
    vowels = sum(1 for c in name.lower() if c in 'aeiou')
    consonants = len(name) - vowels
    ratio = vowels / max(consonants, 1)
    if 0.3 <= ratio <= 0.6:
        factors['pronounceability'] = 'excellent'
    elif 0.2 <= ratio <= 0.8:
        score -= 5
        factors['pronounceability'] = 'good'
    else:
        score -= 15
        factors['pronounceability'] = 'difficult'

    # Memorability (repeated letters, patterns)
    if len(set(name)) < len(name) * 0.6:
        score += 5
        factors['memorability'] = 'has patterns'
    else:
        factors['memorability'] = 'unique'

    # No numbers or hyphens (already filtered, but just in case)
    if any(c.isdigit() for c in name):
        score -= 10
        factors['format'] = 'contains numbers'
    elif '-' in name:
        score -= 10
        factors['format'] = 'contains hyphens'
    else:
        factors['format'] = 'clean'

    return {
        'score': max(0, min(100, score)),
        'factors': factors
    }


def get_metaphors_for_themes(themes: list[str]) -> list[str]:
    """Get metaphor words for specified themes."""
    words = []
    for theme in themes:
        if theme in METAPHORS:
            words.extend(METAPHORS[theme])
    return list(set(words))


def get_available_themes() -> dict:
    """Return all available metaphor themes."""
    return {theme: words[:5] for theme, words in METAPHORS.items()}


def get_available_prefixes() -> dict:
    """Return all available prefix categories."""
    return PREFIXES


def get_available_suffixes() -> dict:
    """Return all available suffix categories."""
    return SUFFIXES


def get_available_industries() -> list[str]:
    """Return all available industry categories."""
    return list(INDUSTRY_WORDS.keys())

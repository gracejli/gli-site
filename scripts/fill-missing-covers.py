#!/usr/bin/env python3
"""Look up Open Library covers for library markdown files missing a cover field."""

from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_DIR = ROOT / "content" / "library" / "books"
SSL_CONTEXT = ssl._create_unverified_context()
USER_AGENT = "gli-site/1.0 (personal library; cover lookup)"


def request_json(url: str) -> dict | list | None:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=20, context=SSL_CONTEXT) as response:
            return json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, ValueError):
        return None


def cover_url_isbn(isbn: str) -> str:
    return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false"


def cover_url_id(cover_id: int | str) -> str:
    return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg?default=false"


def url_exists(url: str) -> bool:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=6, context=SSL_CONTEXT) as response:
            return 200 <= response.status < 300
    except urllib.error.URLError:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=6, context=SSL_CONTEXT) as response:
                return 200 <= response.status < 300
        except urllib.error.URLError:
            return False


def normalize(value: str) -> str:
    value = value.lower()
    value = re.sub(r"\(.*?\)", "", value)
    value = value.replace("’", "'").replace("‘", "'").replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def author_last(value: str) -> str:
    tokens = normalize(value).split()
    skip = {"jr", "sr", "ii", "iii", "iv"}
    while tokens and tokens[-1] in skip:
        tokens.pop()
    return tokens[-1] if tokens else ""


def title_core(value: str) -> str:
    return normalize(re.sub(r"\(.*?\)", "", value))


def similar_title(expected: str, candidate: str) -> bool:
    a = title_core(expected)
    b = title_core(candidate)
    if not a or not b:
        return False
    if a == b:
        return True
    if a in b or b in a:
        return True
    aw, bw = set(a.split()), set(b.split())
    if not aw or not bw:
        return False
    overlap = len(aw & bw) / min(len(aw), len(bw))
    return overlap >= 0.7


def similar_author(expected: str, candidate: str) -> bool:
    last = author_last(expected)
    cand = normalize(candidate)
    return bool(last) and last in cand.split()


def isbn13s(values: list[str] | None) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for raw in values or []:
        isbn = re.sub(r"[^0-9Xx]", "", raw)
        if len(isbn) == 10:
            # skip isbn10 unless we have nothing else; collect later
            key = isbn.upper()
        elif len(isbn) == 13 and isbn.isdigit():
            key = isbn
        else:
            continue
        if key not in seen:
            seen.add(key)
            out.append(key)
    out.sort(key=lambda x: 0 if len(x) == 13 and x.startswith("978") else 1)
    return out


def search_openlibrary(title: str, author: str) -> list[dict]:
    queries = [
        {"title": title_core(title), "author": author_last(author)},
        {"q": f"{title_core(title)} {author_last(author)}"},
    ]
    docs: list[dict] = []
    seen_keys: set[str] = set()
    for params in queries:
        url = "https://openlibrary.org/search.json?" + urllib.parse.urlencode(
            {**params, "limit": "8"}
        )
        data = request_json(url)
        time.sleep(0.3)
        if not isinstance(data, dict):
            continue
        for doc in data.get("docs") or []:
            key = str(doc.get("key") or doc.get("cover_edition_key") or id(doc))
            if key in seen_keys:
                continue
            seen_keys.add(key)
            docs.append(doc)
    return docs


def google_isbns(title: str, author: str) -> list[str]:
    q = f'intitle:{title_core(title)} inauthor:{author_last(author)}'
    url = "https://www.googleapis.com/books/v1/volumes?" + urllib.parse.urlencode(
        {"q": q, "maxResults": 5}
    )
    data = request_json(url)
    time.sleep(0.2)
    found: list[str] = []
    if not isinstance(data, dict):
        return found
    for item in data.get("items") or []:
        info = item.get("volumeInfo") or {}
        if not similar_title(title, info.get("title") or ""):
            authors = " ".join(info.get("authors") or [])
            if not similar_author(author, authors):
                continue
        for ident in info.get("industryIdentifiers") or []:
            if ident.get("type") in {"ISBN_13", "ISBN_10"} and ident.get("identifier"):
                found.append(ident["identifier"])
    return isbn13s(found)


def editions_isbns(work_key: str) -> list[str]:
    if not work_key.startswith("/works/"):
        return []
    url = f"https://openlibrary.org{work_key}/editions.json?limit=20"
    data = request_json(url)
    time.sleep(0.3)
    found: list[str] = []
    if not isinstance(data, dict):
        return found
    for entry in data.get("entries") or []:
        found.extend(entry.get("isbn_13") or [])
        found.extend(entry.get("isbn_10") or [])
    return isbn13s(found)


def first_working(urls: list[tuple[str, str]]) -> tuple[str, str] | None:
    if not urls:
        return None
    with ThreadPoolExecutor(max_workers=min(6, len(urls))) as pool:
        future_map = {pool.submit(url_exists, url): (url, source) for url, source in urls}
        for future in as_completed(future_map):
            url, source = future_map[future]
            try:
                if future.result():
                    return url, source
            except Exception:
                continue
    return None


def pick_cover(title: str, author: str) -> tuple[str, str] | None:
    docs = search_openlibrary(title, author)
    ranked: list[dict] = []
    for doc in docs:
        authors = " ".join(doc.get("author_name") or [])
        if similar_title(title, doc.get("title") or "") and similar_author(author, authors):
            ranked.append(doc)
    if not ranked:
        ranked = docs[:1]

    isbns: list[str] = []
    cover_ids: list[int] = []
    for doc in ranked[:3]:
        isbns.extend(isbn13s(doc.get("isbn")))
        if doc.get("cover_i"):
            cover_ids.append(int(doc["cover_i"]))

    seen: set[str] = set()
    unique_isbns: list[str] = []
    for isbn in isbns:
        if isbn not in seen:
            seen.add(isbn)
            unique_isbns.append(isbn)

    isbn_urls = [(cover_url_isbn(isbn), f"isbn:{isbn}") for isbn in unique_isbns[:6]]
    found = first_working(isbn_urls)
    if found:
        return found

    id_urls = [(cover_url_id(cover_id), f"id:{cover_id}") for cover_id in cover_ids[:3]]
    found = first_working(id_urls)
    if found:
        return found

    extra: list[str] = []
    if ranked:
        work_key = ranked[0].get("key")
        if isinstance(work_key, str):
            extra.extend(editions_isbns(work_key))
    extra.extend(google_isbns(title, author))
    extra_isbns = [isbn for isbn in isbn13s(extra) if isbn not in seen][:6]
    found = first_working([(cover_url_isbn(isbn), f"isbn:{isbn}") for isbn in extra_isbns])
    if found:
        return found
    return None


def insert_cover(text: str, url: str) -> str:
    if re.search(r"^cover:\s*", text, re.M):
        return text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return text
    front = parts[1].rstrip() + f'\ncover: "{url}"\n'
    return "---" + front + "---" + parts[2]


def parse_frontmatter(text: str) -> tuple[str, str]:
    title_m = re.search(r'^title:\s*"?(.*?)"?\s*$', text, re.M)
    author_m = re.search(r'^author:\s*"?(.*?)"?\s*$', text, re.M)
    title = title_m.group(1).strip().strip('"') if title_m else ""
    author = author_m.group(1).strip().strip('"') if author_m else ""
    return title, author


def main() -> None:
    missing = []
    for path in sorted(BOOKS_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if re.search(r"^cover:\s*", text, re.M):
            continue
        title, author = parse_frontmatter(text)
        missing.append((path, text, title, author))

    print(f"missing covers: {len(missing)}", flush=True)
    found = 0
    failed: list[str] = []
    for path, text, title, author in missing:
        print(f"lookup: {title} — {author}", flush=True)
        result = pick_cover(title, author)
        if not result:
            print("  FAIL", flush=True)
            failed.append(path.name)
            continue
        url, source = result
        path.write_text(insert_cover(text, url), encoding="utf-8")
        found += 1
        print(f"  OK ({source}) {url}", flush=True)

    print(f"\nupdated {found}/{len(missing)}", flush=True)
    if failed:
        print("still missing:", flush=True)
        for name in failed:
            print(f"  {name}", flush=True)


if __name__ == "__main__":
    main()

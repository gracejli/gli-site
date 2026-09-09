#!/usr/bin/env python3
"""Convert a Goodreads library export into content/library/books/*.md.

Keeps Exclusive Shelf = read with Date Read on or after 2019-01-01.
Skips slugs that already have a markdown file so a re-import does not wipe notes.
Usage: python3 scripts/import-goodreads.py path/to/goodreads_library_export.csv
"""

from __future__ import annotations

import csv
import html
import json
import re
import ssl
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "content" / "library" / "books"

SKIP_SHELVES = {
    "to-read",
    "currently-reading",
    "read",
    "did-not-finish",
    "did-not-finish-2",
}


def clean_isbn(value: str) -> str:
    value = (value or "").strip()
    value = value.replace('="', "").replace('"', "").lstrip("=").strip()
    if not value or value == "0":
        return ""
    return re.sub(r"[^0-9Xx]", "", value)


def parse_date(value: str) -> str:
    value = (value or "").strip()
    if not value:
        return ""
    parts = value.replace("-", "/").split("/")
    if len(parts) != 3:
        return ""
    year, month, day = (int(p) for p in parts)
    return f"{year:04d}-{month:02d}-{day:02d}"


def clean_review(value: str) -> str:
    value = value or ""
    value = re.sub(r"<br\s*/?>", "\n", value, flags=re.I)
    value = re.sub(r"<[^>]+>", "", value)
    value = html.unescape(value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def genre_from_shelves(value: str) -> str:
    shelves = [s.strip() for s in (value or "").split(",") if s.strip()]
    for shelf in shelves:
        if shelf.lower() not in SKIP_SHELVES:
            return shelf.replace("-", " ")
    return ""


def slugify(title: str, book_id: str) -> str:
    slug = title.lower()
    slug = re.sub(r"\(.*?\)", "", slug)
    slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    slug = slug[:60].strip("-")
    return f"{slug}-{book_id}" if slug else book_id


def cover_url(isbn: str) -> str:
    return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false"


SSL_CONTEXT = ssl._create_unverified_context()


def cover_exists(isbn: str) -> bool:
    url = cover_url(isbn)
    try:
        with urllib.request.urlopen(url, timeout=8, context=SSL_CONTEXT) as response:
            return 200 <= response.status < 300
    except urllib.error.URLError:
        return False


def existing_slugs() -> set[str]:
    if not OUT_DIR.exists():
        return set()
    return {path.stem for path in OUT_DIR.glob("*.md")}


def write_book_md(book: dict) -> None:
    lines = ["---"]
    lines.append(f"title: {json.dumps(book['title'], ensure_ascii=False)}")
    lines.append(f"author: {json.dumps(book['author'], ensure_ascii=False)}")
    lines.append(f"dateRead: {json.dumps(book['dateRead'])}")
    if book.get("genre"):
        lines.append(f"genre: {json.dumps(book['genre'], ensure_ascii=False)}")
    if book.get("cover"):
        lines.append(f"cover: {json.dumps(book['cover'])}")
    lines.append("---")
    notes = (book.get("notes") or "").strip()
    if notes:
        lines.append("")
        lines.append(notes)
    lines.append("")
    OUT_DIR.joinpath(f"{book['slug']}.md").write_text("\n".join(lines), encoding="utf-8")


def import_csv(src: Path, skip: set[str]) -> tuple[list[dict], int]:
    with src.open(newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    candidates: list[tuple[dict, str]] = []
    skipped = 0
    for row in rows:
        if row["Exclusive Shelf"] != "read":
            continue
        date_read = parse_date(row["Date Read"])
        if not date_read or date_read < "2019-01-01":
            continue
        slug = slugify(row["Title"], row["Book Id"])
        if slug in skip:
            skipped += 1
            continue
        isbn = clean_isbn(row.get("ISBN13") or "") or clean_isbn(
            row.get("ISBN") or ""
        )
        book = {
            "slug": slug,
            "title": row["Title"].strip(),
            "author": row["Author"].strip(),
            "genre": genre_from_shelves(row.get("Bookshelves") or ""),
            "notes": clean_review(row.get("My Review") or ""),
            "dateRead": date_read,
        }
        candidates.append((book, isbn))

    isbns = [isbn for _, isbn in candidates if isbn]
    found: set[str] = set()
    with ThreadPoolExecutor(max_workers=12) as pool:
        for isbn, exists in zip(isbns, pool.map(cover_exists, isbns)):
            if exists:
                found.add(isbn)

    books = []
    for book, isbn in candidates:
        if isbn in found:
            book["cover"] = cover_url(isbn)
        books.append(book)

    books.sort(key=lambda b: b["dateRead"], reverse=True)
    return books, skipped


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("Usage: python3 scripts/import-goodreads.py <goodreads.csv>")
    src = Path(sys.argv[1])
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    skip = existing_slugs()
    books, skipped = import_csv(src, skip)
    for book in books:
        write_book_md(book)
    covers = sum(1 for book in books if "cover" in book)
    print(
        f"wrote {len(books)} new books ({covers} with covers) to {OUT_DIR}"
        + (f"; skipped {skipped} existing" if skipped else "")
    )


if __name__ == "__main__":
    main()

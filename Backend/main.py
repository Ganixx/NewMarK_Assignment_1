from typing import List, Optional

import logging
import time
import uuid
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse

from settings import settings


class ListingBase(BaseModel):
    title: str = Field(min_length=1)
    price: float = Field(ge=0)
    location: str = Field(min_length=1)
    description: str = Field(min_length=1)
    image_url: Optional[str] = None


class Listing(ListingBase):
    id: int


# Configure basic logging suitable for production (can be overridden by server)
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s [%(request_id)s] %(message)s",
)


class RequestIdLogFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:  # type: ignore[override]
        if not hasattr(record, "request_id"):
            record.request_id = "-"
        return True


logging.getLogger().addFilter(RequestIdLogFilter())


app = FastAPI(title=settings.app_name, version=settings.version)

# CORS
origins = settings.cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    # Request ID management
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

    start = time.perf_counter()
    response: Response = await call_next(request)
    duration_ms = int((time.perf_counter() - start) * 1000)

    response.headers.setdefault("X-Request-ID", request_id)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    response.headers.setdefault("X-Response-Time", f"{duration_ms}ms")

    # Attach request_id to root logger for this request (best-effort)
    for handler in logging.getLogger().handlers:
        try:
            handler.addFilter(lambda record: setattr(record, "request_id", request_id) or True)
        except Exception:
            pass

    return response


# Error handlers (more consistent error shapes)
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": "http_error",
                "message": exc.detail,
            }
        },
    )


# Health and readiness endpoints
@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/ready")
def ready() -> dict:
    # In real apps you'd check DB/cache connections, migrations, etc.
    return {"status": "ready"}


# In-memory store
_listings: List[Listing] = []
_next_id: int = 1


def _generate_id() -> int:
    global _next_id
    new_id = _next_id
    _next_id += 1
    return new_id


@app.get("/listings", response_model=List[Listing])
def get_listings(q: Optional[str] = None) -> List[Listing]:
    if not q:
        return _listings
    query = q.lower().strip()
    def matches(item: Listing) -> bool:
        return (
            query in item.title.lower()
            or query in item.location.lower()
            or query in item.description.lower()
        )
    return [item for item in _listings if matches(item)]


@app.post("/listings", response_model=Listing, status_code=201)
def create_listing(payload: ListingBase) -> Listing:
    new_listing = Listing(id=_generate_id(), **payload.model_dump())
    _listings.append(new_listing)
    return new_listing


@app.get("/listings/{listing_id}", response_model=Listing)
def get_listing_by_id(listing_id: int) -> Listing:
    for item in _listings:
        if item.id == listing_id:
            return item
    raise HTTPException(status_code=404, detail="Listing not found")


class SummaryResponse(BaseModel):
    bullets: List[str]


@app.post("/listings/{listing_id}/summary", response_model=SummaryResponse)
def summarize_listing(listing_id: int) -> SummaryResponse:
    listing = next((l for l in _listings if l.id == listing_id), None)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")

    bullets = _summarize_description(listing.description)
    return SummaryResponse(bullets=bullets)


def _summarize_description(text: str) -> List[str]:
    # Very lightweight heuristic summary: take up to three sentences or phrases
    cleaned = " ".join(text.strip().split())
    if not cleaned:
        return ["No description provided."]

    # Split by sentence terminators
    import re
    sentences = [s.strip() for s in re.split(r"[\.\!\?]+\s+", cleaned) if s.strip()]
    if not sentences:
        sentences = [cleaned]

    selected = sentences[:3]
    bullets = [f"- {s}" for s in selected]
    # Ensure exactly three bullets
    while len(bullets) < 3:
        bullets.append("- Additional details available on the listing page.")
    return bullets[:3]


# Seed with a couple of sample listings for convenience (non-persistent)
def _seed() -> None:
    if _listings:
        return
    demo = [
        ListingBase(
            title="Cozy Studio Downtown",
            price=1200,
            location="Downtown",
            description="Bright studio apartment close to transit and cafes. Pet-friendly with modern finishes.",
            image_url="https://picsum.photos/seed/studio/800/400",
        ),
        ListingBase(
            title="Spacious 3BR Suburban Home",
            price=2650,
            location="Greenvale Suburbs",
            description="Family-friendly neighborhood, large backyard, recently renovated kitchen, and two-car garage.",
            image_url="https://picsum.photos/seed/house/800/400",
        ),
    ]
    for d in demo:
        create_listing(d)


@app.on_event("startup")
def on_startup():
    if settings.seed_demo_data:
        _seed()



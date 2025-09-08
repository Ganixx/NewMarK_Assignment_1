from typing import List

import pytest
from fastapi.testclient import TestClient

# Import the app and module from the current Backend package context.
from main import app  # type: ignore


@pytest.fixture(autouse=True)
def reset_state():
    # Access and reset in-memory store between tests
    import main as m  # type: ignore
    m._listings.clear()
    m._next_id = 1
    m._seed()


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


def test_get_listings_returns_seeded_items(client: TestClient):
    resp = client.get("/listings")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    for item in data:
        assert {"id", "title", "price", "location", "description"}.issubset(item.keys())


def test_search_query_filters_results(client: TestClient):
    resp = client.get("/listings", params={"q": "studio"})
    assert resp.status_code == 200
    data: List[dict] = resp.json()
    assert all("studio" in (d["title"].lower() + d["description"].lower()) or "studio" in d["location"].lower() for d in data)


def test_create_listing_and_fetch_by_id(client: TestClient):
    payload = {
        "title": "New Condo",
        "price": 1999.99,
        "location": "Midtown",
        "description": "Sunlit condo with balcony.",
        "image_url": None,
    }
    create = client.post("/listings", json=payload)
    assert create.status_code == 201
    created = create.json()
    assert created["id"] > 0
    get_one = client.get(f"/listings/{created['id']}")
    assert get_one.status_code == 200
    fetched = get_one.json()
    assert fetched["title"] == payload["title"]


def test_get_listing_not_found(client: TestClient):
    resp = client.get("/listings/99999")
    assert resp.status_code == 404


def test_summary_endpoint_returns_three_bullets(client: TestClient):
    # create a listing with multi-sentence description
    payload = {
        "title": "Townhouse",
        "price": 2500,
        "location": "Riverbank",
        "description": "Close to park. Renovated kitchen! Quiet area?",
    }
    create = client.post("/listings", json=payload)
    listing_id = create.json()["id"]

    resp = client.post(f"/listings/{listing_id}/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert "bullets" in data
    bullets = data["bullets"]
    assert isinstance(bullets, list)
    assert len(bullets) == 3
    assert all(isinstance(b, str) and b.startswith("-") for b in bullets)



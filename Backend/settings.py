from __future__ import annotations

import os
from typing import List

from pydantic import BaseModel


class Settings(BaseModel):
    environment: str = "development"
    debug: bool = False
    app_name: str = "Property Listings API"
    version: str = "0.1.0"
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1",
    ]
    seed_demo_data: bool = True

    @classmethod
    def from_env(cls) -> "Settings":
        env = os.getenv("APP_ENV", os.getenv("ENV", "development")).lower()
        debug = os.getenv("DEBUG", "false").lower() in {"1", "true", "yes", "on"}
        app_name = os.getenv("APP_NAME", "Property Listings API")
        version = os.getenv("APP_VERSION", "0.1.0")
        cors = os.getenv("CORS_ORIGINS", "").strip()
        cors_origins = (
            [o.strip() for o in cors.split(",") if o.strip()]
            if cors
            else [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost",
                "http://127.0.0.1",
            ]
        )
        seed_demo = os.getenv("SEED_DEMO_DATA", "true").lower() in {"1", "true", "yes", "on"}
        return cls(
            environment=env,
            debug=debug,
            app_name=app_name,
            version=version,
            cors_origins=cors_origins,
            seed_demo_data=seed_demo,
        )


# Singleton-ish accessor
settings = Settings.from_env()



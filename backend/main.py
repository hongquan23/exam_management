from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from api.api_router import api_router
from fastapi.staticfiles import StaticFiles

def create_app() -> FastAPI:
    app = FastAPI(
        title = "toeic exam",
        version = "1.0.0",
        description = "An API for managing TOEIC exam data",
)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


    app.include_router(api_router, prefix="/api")

    return app
app = create_app()
app.mount("/images", StaticFiles(directory="images"), name="images")
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

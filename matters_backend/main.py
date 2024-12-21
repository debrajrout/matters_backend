from fastapi import FastAPI
from routers import matter
from fastapi.staticfiles import StaticFiles

# Initialize FastAPI app
app = FastAPI()

# Include router
app.include_router(matter.router)

app.mount("/", StaticFiles(directory="static", html=True), name="static")


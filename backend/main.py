from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import router
from backend.database import get_db_connection

app = FastAPI(title="GovDoc API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://govdoc-1.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.get("/")
def home():
    return {"message": "GovDoc API is running"}


@app.get("/db-test")
def database_test():
    connection = get_db_connection()

    if connection:
        connection.close()
        return {"message": "Database connection successful"}

    return {"message": "Database connection failed"}
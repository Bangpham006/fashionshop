import logging
from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import PORT, HOST
from recommender import recommender
from database import db_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("main")

app = FastAPI(
    title="FashionShop AI Stylist Service",
    description="Microservice tư vấn phong cách thời trang và gợi ý sản phẩm dựa trên AI & MongoDB",
    version="1.0.0"
)

# Cấu hình CORS để React Frontend (port 3000) có thể gọi trực tiếp
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str # "user" hoặc "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None
    user_id: Optional[str] = None

class ProductRecommendation(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    brand: Optional[str] = None
    gender: Optional[str] = None
    type: Optional[str] = None
    basePrice: Optional[float] = None
    image: Optional[str] = None
    matchReason: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    products: List[ProductRecommendation]

@app.on_event("startup")
def on_startup():
    logger.info("Starting FashionShop AI Stylist Service...")
    db_client.connect()

@app.get("/")
def root():
    return {
        "service": "FashionShop AI Stylist Service",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    try:
        products = db_client.get_active_products(limit=1)
        return {
            "status": "healthy",
            "database": "connected",
            "products_sample_count": len(products)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@app.post("/api/chat/recommend", response_model=ChatResponse)
def chat_recommend(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Tin nhắn không được để trống")

    history_dicts = [{"role": m.role, "content": m.content} for m in request.history] if request.history else None
    result = recommender.recommend(user_message=request.message, history=history_dicts)

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)

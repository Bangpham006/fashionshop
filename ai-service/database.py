import logging
from pymongo import MongoClient
from bson import ObjectId
from config import MONGO_URI, DB_NAME

logger = logging.getLogger("database")

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        try:
            self.client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            self.db = self.client[DB_NAME]
            # Ping database
            self.client.admin.command('ping')
            logger.info("Connected to MongoDB Atlas successfully.")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}")
            raise e

    def get_active_products(self, limit: int = 100):
        """Lấy danh sách các sản phẩm đang hoạt động kèm tags, mô tả, ảnh, giá"""
        if self.db is None:
            self.connect()

        products = list(self.db["products"].find(
            {"isActive": True},
            {
                "name": 1,
                "slug": 1,
                "description": 1,
                "brand": 1,
                "gender": 1,
                "type": 1,
                "basePrice": 1,
                "images": 1,
                "tags": 1,
                "isFeatured": 1
            }
        ).limit(limit))

        clean_products = []
        for p in products:
            p["id"] = str(p.get("_id", ""))
            if "_id" in p:
                del p["_id"]
            clean_products.append(p)

        return clean_products

    def get_product_by_slug(self, slug: str):
        if self.db is None:
            self.connect()
        doc = self.db["products"].find_one({"slug": slug})
        if doc and "_id" in doc:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
        return doc

db_client = Database()

import json
import logging
import re
from typing import List, Dict, Any, Optional
from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL
from database import db_client

logger = logging.getLogger("recommender")

class FashionRecommender:
    def __init__(self):
        self.client = None
        if GEMINI_API_KEY:
            try:
                self.client = genai.Client()
                logger.info(f"Initialized Gemini Client with model {GEMINI_MODEL}")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    def _fallback_recommend(self, user_message: str, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Thuật toán tìm kiếm tương đồng ngữ nghĩa & từ khóa dự phòng (Rule-based / Semantic fallback)"""
        user_lower = user_message.lower()

        # Phát hiện giới tính
        detected_gender = None
        if any(w in user_lower for w in ["nam", "men", "trai", "boy", "anh"]):
            detected_gender = "Men"
        elif any(w in user_lower for w in ["nữ", "women", "gái", "girl", "chị", "em"]):
            detected_gender = "Women"

        # Tính điểm phù hợp cho từng sản phẩm
        scored_products = []
        keywords = re.findall(r'\w+', user_lower)

        for p in products:
            score = 0
            p_name = p.get("name", "").lower()
            p_desc = p.get("description", "").lower()
            p_tags = [t.lower() for t in p.get("tags", [])]
            p_type = p.get("type", "").lower()
            p_gender = p.get("gender", "")

            # Ưu tiên giới tính
            if detected_gender:
                if p_gender == detected_gender or p_gender == "Unisex":
                    score += 5
                else:
                    score -= 3

            # So khớp từ khóa
            for kw in keywords:
                if len(kw) < 2:
                    continue
                if kw in p_name:
                    score += 4
                if kw in p_type:
                    score += 3
                if any(kw in tag for tag in p_tags):
                    score += 3
                if kw in p_desc:
                    score += 1

            if p.get("isFeatured", False):
                score += 1

            scored_products.append((score, p))

        # Sắp xếp lấy top sản phẩm có điểm cao nhất
        scored_products.sort(key=lambda x: x[0], reverse=True)
        top_candidates = [p for score, p in scored_products[:3] if score > 0]
        if not top_candidates:
            top_candidates = products[:3]

        matched_items = []
        for p in top_candidates:
            matched_items.append({
                "id": p.get("id"),
                "name": p.get("name"),
                "slug": p.get("slug"),
                "brand": p.get("brand"),
                "gender": p.get("gender"),
                "type": p.get("type"),
                "basePrice": p.get("basePrice"),
                "image": p.get("images", [""])[0] if p.get("images") else "",
                "matchReason": f"Phù hợp với tìm kiếm '{user_message}' theo phong cách {p.get('type')}"
            })

        reply = (
            f"Chào bạn! Dựa trên phong cách bạn miêu tả ('{user_message}'), "
            f"mình đã chọn lọc các mẫu sản phẩm nổi bật và phù hợp nhất từ bộ sưu tập FashionShop dưới đây. "
            f"Bạn có thể bấm vào sản phẩm để xem chi tiết kích cỡ và phối đồ nhé!"
        )

        return {
            "reply": reply,
            "products": matched_items
        }

    def recommend(self, user_message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """Tư vấn và đề xuất sản phẩm dựa trên LLM Gemini RAG"""
        products = db_client.get_active_products(limit=100)
        if not products:
            return {
                "reply": "Hiện tại shop đang cập nhật kho sản phẩm, bạn vui lòng quay lại sau ít phút nhé!",
                "products": []
            }

        # Nếu không có client Gemini, dùng thuật toán fallback
        if not self.client:
            return self._fallback_recommend(user_message, products)

        # Rút gọn danh mục sản phẩm đưa vào context cho LLM
        catalog_summary = []
        for p in products:
            catalog_summary.append({
                "name": p.get("name"),
                "slug": p.get("slug"),
                "brand": p.get("brand"),
                "gender": p.get("gender"),
                "type": p.get("type"),
                "price": p.get("basePrice"),
                "tags": p.get("tags", [])
            })

        system_instruction = (
            "Bạn là 'FashionShop AI Stylist' - chuyên gia tư vấn thời trang sành điệu, nhiệt tình và am hiểu xu hướng của FashionShop. "
            "Nhiệm vụ của bạn là lắng nghe nhu cầu, sở thích, hoàn cảnh sử dụng của khách hàng và chọn ra 2-4 sản phẩm phù hợp nhất từ Catalog của shop. "
            "Sau đó, bạn đưa ra lời khuyên phối đồ (outfit suggestion) thật cuốn hút, tự nhiên bằng tiếng Việt.\n\n"
            "QUY TẮC BẮT BUỘC:\n"
            "1. Chỉ được chọn sản phẩm CÓ THẬT trong danh sách Catalog được cung cấp.\n"
            "2. Trả về ĐÚNG ĐỊNH DẠNG JSON duy nhất (không bọc text ngoài JSON), cấu trúc như sau:\n"
            "{\n"
            '  "reply": "Lời tư vấn phong cách chi tiết, thân thiện, gợi ý cách phối...",\n'
            '  "recommended_slugs": ["slug-1", "slug-2"],\n'
            '  "match_reasons": {\n'
            '     "slug-1": "Lý do ngắn gọn vì sao mẫu này hợp...",\n'
            '     "slug-2": "..."\n'
            '  }\n'
            "}"
        )

        user_prompt = (
            f"Catalog sản phẩm hiện có của shop:\n{json.dumps(catalog_summary, ensure_ascii=False)}\n\n"
            f"Khách hàng yêu cầu: \"{user_message}\"\n\n"
            "Hãy tư vấn và chọn các sản phẩm phù hợp nhất dưới định dạng JSON."
        )

        try:
            response = self.client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[system_instruction, user_prompt]
            )

            raw_text = response.text.strip()
            # Loại bỏ markdown code fence nếu có
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            parsed_json = json.loads(raw_text)

            recommended_slugs = parsed_json.get("recommended_slugs", [])
            match_reasons = parsed_json.get("match_reasons", {})
            reply = parsed_json.get("reply", "")

            # Map slugs về thông tin sản phẩm đầy đủ
            products_by_slug = {p.get("slug"): p for p in products}
            matched_items = []
            for slug in recommended_slugs:
                if slug in products_by_slug:
                    p = products_by_slug[slug]
                    matched_items.append({
                        "id": p.get("id"),
                        "name": p.get("name"),
                        "slug": p.get("slug"),
                        "brand": p.get("brand"),
                        "gender": p.get("gender"),
                        "type": p.get("type"),
                        "basePrice": p.get("basePrice"),
                        "image": p.get("images", [""])[0] if p.get("images") else "",
                        "matchReason": match_reasons.get(slug, "Phong cách thời thượng, phù hợp với yêu cầu của bạn")
                    })

            # Nếu LLM không chọn được slug nào hoặc parse lỗi, fallback
            if not matched_items:
                return self._fallback_recommend(user_message, products)

            return {
                "reply": reply,
                "products": matched_items
            }

        except Exception as e:
            logger.error(f"Error calling Gemini: {e}")
            return self._fallback_recommend(user_message, products)

recommender = FashionRecommender()

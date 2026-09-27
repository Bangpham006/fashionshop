# 🚀 FASHIONSHOP - HƯỚNG DẪN TRIỂN KHAI PRODUCTION (DEPLOYMENT GUIDE)

Tài liệu hướng dẫn chi tiết các phương án đưa hệ thống FashionShop (gồm 3 dịch vụ: Spring Boot Backend, React Frontend, Python AI Service) lên môi trường Production.

---

## 📦 KIẾN TRÚC HỆ THỐNG TRIỂN KHAI

Hệ thống bao gồm 3 microservices độc lập:
1. **Core Backend (Java 21 / Spring Boot 3.5):** Port `8080` (REST API, Auth JWT, Data MongoDB).
2. **AI Stylist Service (Python FastAPI):** Port `8000` (Gợi ý trang phục, RAG, Gemini AI).
3. **Frontend Client (React 19 SPA):** Port `3000` hoặc Port `80` qua Nginx.

---

## 🐳 CÁCH 1: TRIỂN KHAI BẰNG DOCKER COMPOSE (KHUYÊN DÙNG CHO VPS / CLOUD SERVER)

Đây là cách nhanh nhất và chuẩn hóa nhất để chạy toàn bộ hệ thống trên bất kỳ máy chủ Linux (Ubuntu/Debian) hoặc máy cá nhân có cài Docker.

### Bước 1: Chuẩn bị VPS & Cài đặt Docker
Trên máy chủ Ubuntu:
```bash
sudo apt update && sudo apt upgrade -y
# Cài đặt Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose-plugin -y
```

### Bước 2: Clone dự án và cấu hình biến môi trường
```bash
git clone https://github.com/Bangpham006/fashionshop.git
cd fashionshop

# Tạo file .env từ template
cp .env.example .env
nano .env # Điền GEMINI_API_KEY và các thông tin bí mật nếu cần
```

### Bước 3: Khởi chạy toàn bộ hệ thống
```bash
# Build và chạy ngầm tất cả container
docker compose up -d --build
```

### Bước 4: Kiểm tra trạng thái
```bash
docker compose ps
docker compose logs -f
```

Hệ thống sẽ hoạt động tại:
- **Frontend:** `http://<IP_VPS>:3000`
- **Backend API:** `http://<IP_VPS>:8080`
- **AI Service:** `http://<IP_VPS>:8000`

---

## ☁️ CÁCH 2: TRIỂN KHAI TRÊN CLOUD MIỄN PHÍ (SERVERLESS / PAAS)

Nếu bạn muốn deploy để demo hoặc báo cáo dự án mà không cần mua VPS:

### 1. Frontend ➔ Vercel hoặc Netlify
- Đẩy code lên GitHub.
- Đăng nhập [Vercel](https://vercel.com/) ➔ `Add New Project` ➔ Chọn Repo `fashionshop`.
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`
- Bấm **Deploy**.

### 2. Backend Spring Boot ➔ Render hoặc Railway
- Đăng ký [Render](https://render.com/) hoặc [Railway](https://railway.app/).
- Tạo **New Web Service** ➔ Kết nối repo `fashionshop`.
- Chọn môi trường **Docker** (Render sẽ tự động đọc file `Dockerfile` ở thư mục gốc).
- Thêm các Environment Variables:
  - `SPRING_DATA_MONGODB_URI`: URI kết nối MongoDB Atlas của bạn.
  - `CLOUDINARY_CLOUD_NAME`: Cloud Name của bạn từ Cloudinary Dashboard.
  - `CLOUDINARY_API_KEY`: API Key của bạn từ Cloudinary Dashboard.
  - `CLOUDINARY_API_SECRET`: API Secret của bạn từ Cloudinary Dashboard.

### 3. AI Service ➔ Render hoặc Railway
- Tạo **New Web Service** riêng cho AI.
- Root Directory: `ai-service`
- Môi trường: **Docker** (sử dụng `ai-service/Dockerfile`).
- Thêm Environment Variables:
  - `GEMINI_API_KEY`: API key của bạn từ Google AI Studio.
  - `MONGO_URI`: URI MongoDB Atlas.
  - `DB_NAME`: `fashionshop_db`

---

## 🔒 LƯU Ý BẢO MẬT & KẾT NỐI DATABASE TRÊN PRODUCTION

1. **MongoDB Atlas Network Access:**
   - Đăng nhập vào [MongoDB Atlas Console](https://cloud.mongodb.com/).
   - Vào mục **Network Access** ➔ Thêm IP máy chủ Deploy hoặc tạm thời chọn `0.0.0.0/0` (Allow Access from Anywhere) để các server Cloud có thể truy vấn DB.
2. **CORS Configuration:**
   - Trong production, cập nhật domain thật của Frontend vào `UserConfig.java`, `WebConfig.java` và `ai-service/main.py` thay vì chỉ để `localhost:3000`.
3. **API Endpoints ở Frontend:**
   - Khi deploy production, cập nhật địa chỉ backend trong `frontend/src/api/axiosConfig.js` và `frontend/src/components/Chatbot/Chatbot.jsx` từ `http://localhost:8080` / `http://localhost:8000` thành domain public thật của Backend & AI Service.

---
*Tài liệu chuẩn hóa phục vụ đóng gói và phát hành bản Final của FashionShop.*

# 🛍️ FASHIONSHOP - E-COMMERCE PLATFORM ARCHITECTURE & AGENT GUIDE

> **Mục đích tài liệu:** Bản mô tả kiến trúc, danh mục tính năng toàn diện và **bản đồ điều hướng nhanh (Cheat Sheet) dành cho AI Agent & Developer**. Khi Agent tiếp nhận dự án, chỉ cần đọc file này là nắm toàn bộ luồng, không cần tốn token quét lại toàn bộ mã nguồn và biết chính xác cần sửa ở file nào.

---

## ⚡ 1. QUICK AGENT CHEAT SHEET (SỬA Ở ĐÂU?)

Khi có yêu cầu chỉnh sửa hoặc phát triển thêm tính năng, tra cứu bảng sau để mở đúng file:

| Nghiệp vụ / Tính năng | Frontend File (UI & Gọi API) | Backend File (Controller & Logic) | Model / DB Collection |
| :--- | :--- | :--- | :--- |
| **Đăng ký (Register)** | [`pages/register.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/register.jsx) | [`controller/UserController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/UserController.java)<br>[`service/UserService.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/service/UserService.java) | [`model/User.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/User.java)<br>`users` (MongoDB) |
| **Đăng nhập & Auth Token** | [`pages/login.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/login.jsx) | [`controller/UserController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/UserController.java)<br>[`security/JwtTokenProvider.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/security/JwtTokenProvider.java) | Lưu `token`, `userId`, `role`, `username` vào `localStorage` |
| **Quên mật khẩu** | [`pages/forgot-password.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/forgot-password.jsx) | [`controller/UserController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/UserController.java)<br>[`service/UserService.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/service/UserService.java) | [`dto/ForgotPasswordRequest.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/dto/ForgotPasswordRequest.java) |
| **Phân quyền / Route Guard** | [`components/isLogin.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/isLogin.jsx)<br>[`components/isAdmin.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/isAdmin.jsx) | [`config/UserConfig.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/config/UserConfig.java)<br>[`security/JwtAuthenticationFilter.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/security/JwtAuthenticationFilter.java) | Vai trò: `ROLE_USER`, `ROLE_ADMIN` |
| **Trang chủ & Banner** | [`pages/home.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/home.jsx)<br>[`components/Hero/Hero.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/Hero/Hero.jsx)<br>[`components/Featured/Featured.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/Featured/Featured.jsx) | [`controller/ProductController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/ProductController.java) (`/api/products/featured`) | Slider dùng Swiper, lọc sản phẩm `isFeatured = true` |
| **Menu, Header & Search Bar** | [`components/Navbar/Navbar.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/Navbar/Navbar.jsx) | [`controller/CategoryController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/CategoryController.java) (`/api/categories`) | Lấy danh mục `level === 1` |
| **Tìm kiếm sản phẩm** | [`pages/Search Result/Search-result.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Search%20Result/Search-result.jsx) | [`controller/ProductController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/ProductController.java) (`/api/products/search`) | Phân trang: `Page<Product>`, tìm theo tên |
| **Danh mục & Bộ lọc (Filter/Sort)** | [`pages/Category/Category.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Category/Category.jsx) | [`controller/ProductController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/ProductController.java) (`/api/products/filter`) | Lọc theo `categoryId`, `gender`; Sort theo `createdAt`, `basePrice`, `name` |
| **Chi tiết sản phẩm (PDP)** | [`pages/Product Detail/ProductDetail.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Product%20Detail/ProductDetail.jsx) | [`controller/ProductController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/ProductController.java) (`/slug/{slug}`)<br>[`controller/ProductVariantController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/ProductVariantController.java) (`/product/{id}`) | [`model/Product.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/Product.java)<br>[`model/ProductVariant.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/ProductVariant.java) |
| **Giỏ hàng (Cart)** | [`pages/Cart/Cart.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Cart/Cart.jsx) | [`controller/CartController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/CartController.java)<br>[`service/CartService.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/service/CartService.java) | [`model/Cart.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/Cart.java)<br>`carts` (MongoDB) |
| **Thanh toán (Checkout & Payment)** | [`pages/Checkout/Checkout.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Checkout/Checkout.jsx)<br>[`components/Payment/`](file:///D:/fsshop/fashionshop/frontend/src/components/Payment/) | Hiện tại frontend gọi clear cart: [`CartController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/CartController.java) (`/clear/{userId}`) | Model sẵn sàng: [`model/Order.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/Order.java)<br>[`model/OrderItem.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/OrderItem.java) |
| **Cổng thanh toán PayPal** | [`components/Payment/PayPal Payment/Paypal-payment.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/Payment/PayPal%20Payment/Paypal-payment.jsx) | Client-side PayPal SDK (`@paypal/react-paypal-js`) | Chuyển đổi VND sang USD tỷ giá cố định (25.000) |
| **Cổng thanh toán Thẻ / COD** | [`components/Payment/Card Payment/Card-payment.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/Payment/Card%20Payment/Card-payment.jsx)<br>[`components/Payment/COD Payment/COD-payment.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/Payment/COD%20Payment/COD-payment.jsx) | Xử lý frontend mock form | - |
| **Trang thông báo thành công** | [`pages/Payment-success/Payment-success.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Payment-success/Payment-success.jsx) | Nhận dữ liệu order từ `location.state` (tự động quay về `/` nếu không đi từ checkout) | Có nút Print Receipt |
| **Admin: Quản lý sản phẩm & Biến thể** | [`pages/admin/Product Management/Product-management.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/admin/Product%20Management/Product-management.jsx) | [`controller/ProductController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/ProductController.java)<br>[`controller/ProductVariantController.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/controller/ProductVariantController.java) | Thêm, sửa, xóa Product + mảng Variants kèm SKU, Size, Color, Stock, Base64 image |
| **Admin: Thống kê doanh thu** | [`pages/admin/Revenue Overview/revenue-overview.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/admin/Revenue%20Overview/revenue-overview.jsx)<br>[`components/graph.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/graph.jsx) | Recharts AreaChart (dữ liệu mock mẫu) | Cần tích hợp OrderRepository aggregation khi nối API thật |
| **Upload ảnh Cloudinary** | [`service/CloudinaryService.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/service/CloudinaryService.java) | [`config/CloudinaryConfig.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/config/CloudinaryConfig.java) | Cấu hình trong `application.properties` |
| **Cấu hình DB & Server Backend** | - | [`src/main/resources/application.properties`](file:///D:/fsshop/fashionshop/src/main/resources/application.properties) | MongoDB URI, Cloudinary keys, Max Header Size |
| **Cấu hình API Endpoint Frontend** | [`src/api/axiosConfig.js`](file:///D:/fsshop/fashionshop/frontend/src/api/axiosConfig.js) | - | `baseURL: http://localhost:8080/api` |
| **AI Stylist Chatbot (Tư vấn thời trang)** | [`components/Chatbot/Chatbot.jsx`](file:///D:/fsshop/fashionshop/frontend/src/components/Chatbot/Chatbot.jsx)<br>[`components/Chatbot/Chatbot.css`](file:///D:/fsshop/fashionshop/frontend/src/components/Chatbot/Chatbot.css) | [`ai-service/main.py`](file:///D:/fsshop/ai-service/main.py)<br>[`ai-service/recommender.py`](file:///D:/fsshop/ai-service/recommender.py) | Python FastAPI (port 8000), Google Gemini AI, MongoDB Atlas |

---

## 🛠️ 2. TECH STACK & CÔNG NGHỆ SỬ DỤNG

### Backend (Spring Boot 3.5.x & Java 21)
- **Framework:** Spring Boot Web, Spring WebFlux, Spring Data MongoDB, Jakarta Validation, Lombok.
- **Database:** MongoDB Atlas (NoSQL Document Store).
- **Security & Auth:** Spring Security 6, JJWT (`0.12.6` / `0.11.5`), BCrypt Password Encoder.
- **Media Storage:** Cloudinary HTTP5 (`com.cloudinary:cloudinary-http5:2.0.0`).
- **Build Tool:** Maven (`mvnw`, `mvnw.cmd`, `pom.xml`).

### Frontend (React 19 SPA)
- **Framework:** React 19 (`react: ^19.2.5`, `react-dom: ^19.2.5`).
- **Routing:** React Router DOM v6 (`react-router-dom: ^6.30.3`).
- **HTTP Client:** Axios (`axios: ^1.15.0`).
- **Icons & UI:** Lucide React (`lucide-react: ^1.8.0`), React Icons (`react-icons: ^5.6.0`).
- **Charts:** Recharts (`recharts: ^3.8.1`).
- **Sliders:** Swiper (`swiper: ^12.1.3`).
- **Payment SDK:** `@paypal/react-paypal-js: ^9.2.0`.

---

## 📂 3. CẤU TRÚC THƯ MỤC CHI TIẾT (PROJECT STRUCTURE)

```text
d:\fsshop\
├── .github/                       # GitHub Actions / Upgrade scripts
├── .vscode/                       # VS Code run configurations
├── IWS_final_report.docx          # Báo cáo tổng kết dự án môn học
└── fashionshop/                   # THƯ MỤC DỰ ÁN CHÍNH (Git Root)
    ├── pom.xml                    # Cấu hình dependencies Backend
    ├── mvnw, mvnw.cmd             # Maven Wrapper
    │
    ├── src/main/java/com/iws/fashionshop/
    │   ├── FashionshopApplication.java    # Spring Boot Main Entry
    │   ├── TestControler.java             # Test endpoint (/api/test)
    │   ├── config/                        # Cấu hình hệ thống
    │   │   ├── CloudinaryConfig.java      # Cấu hình Bean Cloudinary
    │   │   ├── UserConfig.java            # Spring Security, CORS, PasswordEncoder
    │   │   └── WebConfig.java             # Spring MVC CORS Config
    │   ├── controller/                    # REST API Controllers
    │   │   ├── CartController.java        # API Giỏ hàng (/api/cart)
    │   │   ├── CategoryController.java    # API Danh mục (/api/categories)
    │   │   ├── ProductController.java     # API Sản phẩm (/api/products)
    │   │   ├── ProductVariantController.java # API Biến thể (/api/variants)
    │   │   └── UserController.java        # API Auth (/api/auth)
    │   ├── dto/
    │   │   └── ForgotPasswordRequest.java # DTO đổi/quên mật khẩu
    │   ├── model/                         # MongoDB Document Entities
    │   │   ├── Cart.java                  # Document Giỏ hàng + CartItem
    │   │   ├── Category.java              # Document Danh mục
    │   │   ├── Order.java                 # Document Đơn hàng
    │   │   ├── OrderItem.java             # Dữ liệu sản phẩm trong đơn hàng
    │   │   ├── Product.java               # Document Sản phẩm chính
    │   │   ├── ProductVariant.java        # Document Biến thể (Size, Color, SKU)
    │   │   └── User.java                  # Document Tài khoản người dùng
    │   ├── repository/                    # Spring Data MongoDB Repositories
    │   │   ├── CartRepository.java
    │   │   ├── CategoryRepository.java
    │   │   ├── ProductRepository.java
    │   │   ├── ProductVariantRepository.java
    │   │   └── UserRepository.java
    │   ├── security/                      # JWT Filter & Provider
    │   │   ├── JwtAuthenticationFilter.java
    │   │   └── JwtTokenProvider.java
    │   └── service/                       # Business Logic Layer
    │       ├── CartService.java
    │       ├── CategoryService.java & CategoryServiceImpl.java
    │       ├── CloudinaryService.java
    │       ├── ProductService.java & ProductServiceImpl.java
    │       ├── ProductVariantService.java & ProductVariantServiceImpl.java
    │       └── UserService.java
    │
    ├── src/main/resources/
    │   └── application.properties         # Cấu hình MongoDB, Cloudinary, Port
    │
    └── frontend/                          # REACT CLIENT APP
        ├── package.json                   # Dependencies & Scripts Frontend
        ├── public/
        │   └── index.html                 # HTML Template
        └── src/
            ├── App.js                     # Root Component & Route Definitions
            ├── index.js                   # React 19 Entrypoint
            ├── index.css                  # Global Styles (Font Roboto)
            ├── api/
            │   └── axiosConfig.js         # Axios instance (baseURL: http://localhost:8080/api)
            ├── components/
            │   ├── Featured/              # Slider sản phẩm Trending / Hot
            │   ├── Footer/                # Chân trang
            │   ├── Hero/                  # Hero Banner Swiper Slider
            │   ├── Navbar/                # Menu đa cấp, Search, User Menu, Logout
            │   ├── Payment/               # 3 cổng: COD, Card, PayPal
            │   ├── graph.jsx              # Recharts Doanh thu hàng tháng
            │   ├── isAdmin.jsx            # Guard chặn người dùng không có ROLE_ADMIN
            │   ├── isLogin.jsx            # Guard chặn người dùng chưa đăng nhập
            │   └── Loading-circles.jsx    # Spinner hiệu ứng tải
            ├── image/                     # Ảnh tĩnh banner (lifestyle, sport)
            └── pages/
                ├── home.jsx               # Trang chủ
                ├── login.jsx              # Trang đăng nhập
                ├── register.jsx           # Trang đăng ký
                ├── forgot-password.jsx    # Trang khôi phục mật khẩu
                ├── Cart/                  # Trang giỏ hàng
                ├── Category/              # Trang xem danh mục & bộ lọc
                ├── Checkout/              # Trang thanh toán & chọn cổng thanh toán
                ├── Payment-success/       # Trang báo thanh toán thành công
                ├── Product Detail/        # Trang chi tiết sản phẩm (PDP)
                ├── Search Result/         # Trang kết quả tìm kiếm
                └── admin/
                    ├── Product Management/ # Quản lý thêm/sửa/xóa sản phẩm & biến thể
                    └── Revenue Overview/   # Bảng tổng quan doanh thu & biểu đồ
```

---

## 🚀 4. HƯỚNG DẪN KHỞI CHẠY (SETUP & RUN)

### Yêu cầu môi trường:
- **Java**: JDK 21 trở lên.
- **Node.js**: v18.x hoặc v20.x trở lên.
- **MongoDB**: Đã cấu hình sẵn kết nối Atlas Cloud qua URI trong `application.properties`.

### 1. Khởi chạy Backend (Spring Boot):
Di chuyển vào thư mục `fashionshop`:
```powershell
cd d:\fsshop\fashionshop
# Chạy bằng Maven Wrapper:
.\mvnw.cmd spring-boot:run
```
> Backend sẽ lắng nghe tại: `http://localhost:8080`

### 2. Khởi chạy Frontend (React):
Mở một cửa sổ Terminal mới:
```powershell
cd d:\fsshop\fashionshop\frontend
# Cài đặt thư viện (nếu chưa cài):
npm install
# Khởi chạy dev server:
npm start
```
> Frontend sẽ mở tại: `http://localhost:3000`

---

## 🔌 5. CHI TIẾT HỆ THỐNG REST API

### 🔐 1. Xác thực & Người dùng (`/api/auth`)
| Phương thức | Đường dẫn | Chức năng | Body / Params | Phân quyền |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới | `{ username, password, email, isAdmin }` | Public |
| `POST` | `/api/auth/login` | Đăng nhập nhận JWT | `{ username, password }` | Public |
| `POST` | `/api/auth/forgot-password`| Đổi mật khẩu qua email | `{ username, email, newPassword }` | Public |

*Ghi chú phản hồi login:* Trả về JSON chứa `{ token, id, type: "Bearer", username, email, roles }`.

---

### 📦 2. Sản phẩm (`/api/products`)
| Phương thức | Đường dẫn | Chức năng | Query Params / Body | Phân quyền |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products/filter` | Lọc sản phẩm có phân trang | `categoryId`, `gender`, `page`, `size`, `sortBy`, `sortDir` | Public |
| `GET` | `/api/products/search` | Tìm kiếm theo từ khóa | `keyword`, `page`, `size`, `sortBy`, `sortDir` | Public |
| `GET` | `/api/products/featured` | Lấy danh sách sản phẩm nổi bật | - | Public |
| `GET` | `/api/products/slug/{slug}` | Xem chi tiết theo slug URL | `slug` (path) | Public |
| `POST` | `/api/products` | Tạo sản phẩm mới | JSON `Product` entity | **ROLE_ADMIN** |
| `PUT` | `/api/products/{id}` | Cập nhật thông tin sản phẩm | JSON `Product` entity | **ROLE_ADMIN** |
| `DELETE` | `/api/products/{id}` | Xóa sản phẩm | `id` (path) | **ROLE_ADMIN** |

---

### 🎨 3. Biến thể sản phẩm (`/api/variants`)
| Phương thức | Đường dẫn | Chức năng | Query Params / Body | Phân quyền |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/variants/product/{productId}` | Lấy tất cả biến thể của SP | `productId` (path) | Public |
| `GET` | `/api/variants/sku/{sku}` | Tra cứu biến thể qua mã SKU | `sku` (path) | Public |
| `GET` | `/api/variants/low-stock` | Cảnh báo hàng sắp hết kho | `threshold` (mặc định: 10) | Public |
| `POST` | `/api/variants` | Thêm biến thể mới | JSON `ProductVariant` | **ROLE_ADMIN** |
| `PUT` | `/api/variants/{id}` | Cập nhật biến thể | JSON `ProductVariant` | **ROLE_ADMIN** |
| `DELETE` | `/api/variants/{id}` | Xóa biến thể | `id` (path) | **ROLE_ADMIN** |
| `PUT` | `/api/variants/{id}/add-stock` | Nhập thêm số lượng tồn kho | `amount` (int) | Public |

---

### 🗂️ 4. Danh mục (`/api/categories`)
| Phương thức | Đường dẫn | Chức năng | Phân quyền |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Lấy toàn bộ danh mục | Public |
| `GET` | `/api/categories/slug/{slug}` | Lấy chi tiết danh mục theo slug | Public |
| `GET` | `/api/categories/parent/{parentId}` | Lấy danh mục con | Public |
| `POST` | `/api/categories` | Tạo danh mục | Public |
| `PUT` | `/api/categories/{id}` | Cập nhật danh mục | **ROLE_ADMIN** |
| `DELETE` | `/api/categories/{id}` | Xóa danh mục (không được xóa nếu còn subcategory) | **ROLE_ADMIN** |

---

### 🛒 5. Giỏ hàng (`/api/cart`)
| Phương thức | Đường dẫn | Chức năng | Query Params / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart/user/{userId}` | Lấy giỏ hàng của user | `userId` (path) |
| `POST` | `/api/cart/add` | Thêm sản phẩm (theo variant) vào giỏ | `userId`, `variantId`, `quantity` |
| `DELETE` | `/api/cart/remove` | Xóa 1 biến thể khỏi giỏ | `userId`, `variantId` |
| `DELETE` | `/api/cart/clear/{userId}` | Xóa toàn bộ giỏ hàng | `userId` (path) |

---

## 🧭 6. BẢN ĐỒ DỮ LIỆU & LUỒNG XỬ LÝ (DATA FLOW)

### 1. Luồng Xác thực (Authentication Flow)
```
[User Form: /auth/login]
        │
        ▼ (POST /api/auth/login)
[UserController] ──► [UserService.login()] ──► [BCrypt Check Password]
        │
        ▼ (Thành công)
[JwtTokenProvider.generateToken(username, roles)]
        │
        ▼ (Trả về Frontend)
[localStorage: token, userId, role, username]
        │
        ▼ (Mỗi Request có Auth Header)
[Axios Header: 'Authorization': 'Bearer ' + token] ──► [JwtAuthenticationFilter] ──► [SecurityContext]
```

### 2. Luồng Mua hàng (Shopping & Cart Flow)
```
[Trang chủ / Danh mục] ──► Chọn Sản phẩm (/product/:slug)
        │
        ▼ (Chọn Size, Color -> variantId)
[Bấm "Add to Bag"] ──► (POST /api/cart/add?userId=...&variantId=...&quantity=1)
        │
        ▼ (Server tự động tra cứu Product + Variant -> Cập nhật Cart document)
[Trang Giỏ hàng: /cart] ──► (Xem lại items, điều chỉnh số lượng hoặc xóa)
        │
        ▼ (Bấm "Checkout")
[Trang Thanh toán: /checkout]
        │──► Nhập thông tin giao hàng (Họ tên, SĐT, Địa chỉ, Email)
        │──► Chọn 1 trong 3 phương thức:
        │       1. COD (Giao hàng thu tiền)
        │       2. Credit Card (Form thẻ)
        │       3. PayPal (SDK Smart Buttons)
        │
        ▼ (Thanh toán hoàn tất)
[DELETE /api/cart/clear/{userId}] ──► Điều hướng sang [/payment-success] (In hóa đơn)
```

---

## ⚠️ 7. CÁC ĐIỂM CẦN LƯU Ý KHI TIẾP TỤC PHÁT TRIỂN (TECHNICAL DEBT & OPEN TASKS)

Khi Agent hoặc Developer nhận task mới, cần lưu ý các điểm sau để hoàn thiện dự án:

1. **Kết nối API Đơn hàng (Order Backend API):**
   - Hiện tại Backend đã có đầy đủ Document [`Order.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/Order.java) và [`OrderItem.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/model/OrderItem.java).
   - Tuy nhiên, chưa có `OrderController`, `OrderService`, `OrderRepository`.
   - Ở Frontend ([`Checkout.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Checkout/Checkout.jsx)), khi thanh toán thành công hiện chỉ đang gọi `DELETE /api/cart/clear/{userId}` và tạo mã giả `orderId: "ORD-" + Math.floor(...)`.
   - **Cần làm:** Viết `OrderRepository`, `OrderService.createOrder()`, `OrderController` (`POST /api/orders`) và kết nối `Checkout.jsx` để lưu đơn hàng thực tế vào MongoDB Atlas.

2. **Dữ liệu Doanh thu Admin (`revenue-overview.jsx`):**
   - Trang Thống kê doanh thu hiện đang hiển thị số liệu tĩnh (`250.000.000đ`, `1,250 Active Orders`) và biểu đồ Recharts với mảng mock `data` (Jan -> Jun).
   - **Cần làm:** Tạo API thống kê `/api/admin/revenue/analytics` tổng hợp dữ liệu từ collection `orders` và truyền vào `RevenueGraph`.

3. **Cấu hình Bảo mật & Biến môi trường:**
   - Trong [`application.properties`](file:///D:/fsshop/fashionshop/src/main/resources/application.properties) đang chứa trực tiếp MongoDB URI và Cloudinary API Secret. Khi deploy Production, nên chuyển sang biến môi trường (`${MONGODB_URI}`, `${CLOUDINARY_API_SECRET}`).
   - Client-Id PayPal trong [`Checkout.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/Checkout/Checkout.jsx#L105) hiện đang để `"test"`. Cần thay bằng PayPal Sandbox Client ID thực tế khi test giao dịch tiền thật.

4. **Upload hình ảnh sản phẩm:**
   - Trong Admin [`Product-management.jsx`](file:///D:/fsshop/fashionshop/frontend/src/pages/admin/Product%20Management/Product-management.jsx), ảnh đang được convert sang Base64 chuỗi dài để lưu.
   - Backend đã có [`CloudinaryService.java`](file:///D:/fsshop/fashionshop/src/main/java/com/iws/fashionshop/service/CloudinaryService.java). Cần thêm endpoint `POST /api/upload` nhận `MultipartFile` và gọi `CloudinaryService.uploadImage()` để trả về URL CDN tối ưu dung lượng DB.

---
*Tài liệu được sinh tự động và chuẩn hóa cho Antigravity AI Agent & Đội ngũ Phát triển FashionShop.*

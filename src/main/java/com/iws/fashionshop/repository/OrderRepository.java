package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // 1. Tìm đơn hàng theo mã (Dùng cho khách tra cứu đơn hàng nhanh)
    Optional<Order> findByOrderCode(String orderCode);

    // 2. Lấy lịch sử đơn hàng của 1 User + PHÂN TRANG
    // Thường sẽ sắp xếp theo thời gian mới nhất (CreatedAt Desc)
    Page<Order> findByUserId(String userId, Pageable pageable);

    // 3. Admin lọc đơn hàng theo trạng thái (Ví dụ: Tìm các đơn đang PENDING để xác nhận)
    Page<Order> findByOrderStatus(String orderStatus, Pageable pageable);

    // 4. Admin lọc đơn hàng theo trạng thái thanh toán (Ví dụ: Kiểm tra các đơn UNPAID)
    Page<Order> findByPaymentStatus(String paymentStatus, Pageable pageable);

    // 5. Kiểm tra mã đơn hàng đã tồn tại chưa (Tránh trùng lặp khi tạo mới)
    boolean existsByOrderCode(String orderCode);
}
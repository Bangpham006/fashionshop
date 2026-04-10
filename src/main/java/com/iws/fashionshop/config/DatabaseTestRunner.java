//package com.iws.fashionshop.config;
//
//import com.iws.fashionshop.model.Category;
//import com.iws.fashionshop.repository.CategoryRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DatabaseTestRunner implements CommandLineRunner {
//
//    @Autowired
//    private CategoryRepository categoryRepository;
//
//    @Override
//    public void run(String... args) throws Exception {
//        System.out.println("--- STARTING DATABASE CONNECTION TEST ---");
//        try {
//            // Kiểm tra xem repository có hoạt động không
//            long count = categoryRepository.count();
//            System.out.println("✅ KẾT NỐI MONGODB THÀNH CÔNG!");
//            System.out.println("✅ SỐ LƯỢNG CATEGORY TRONG DB: " + count);
//            // 1. Tạo thử 1 đối tượng mới
//            Category newCate = new Category();
//            newCate.setName("Giày Jordan New");
//            newCate.setSlug("giay-jordan-" + System.currentTimeMillis());
//            newCate.setLevel(1);
//
//            // 2. Lệnh này mới là lệnh "Ghi" vào Database này!
//            categoryRepository.save(newCate);
//
//            // 3. Kiểm tra lại
//            count = categoryRepository.count();
//            System.out.println("✅ ĐÃ LƯU DỮ LIỆU MỚI!");
//            System.out.println("✅ SỐ LƯỢNG HIỆN TẠI: " + count);
//        } catch (Exception e) {
//            System.err.println(" LỖI KẾT NỐI: " + e.getMessage());
//            e.printStackTrace();
//        }
//    }
//}
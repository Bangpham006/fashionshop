package com.iws.fashionshop.model;

import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // khong can geterseteter o day dau
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;
    private String password;
    private String email;
    private Set<String> roles;
    private boolean isAdmin = false;
    // xem tai khoan bi khoa hay khong
    private boolean enabled = true;

    // Constructor tùy chỉnh
    public User(String username, String password, String email, Set<String> roles) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.enabled = true; // Mặc định khi tạo mới là hoạt động
    }
}
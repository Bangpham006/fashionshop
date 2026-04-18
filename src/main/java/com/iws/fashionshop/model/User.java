package com.iws.fashionshop.model;

import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
@Getter
@Setter
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;
    private String password;
    private String email;
    private Set<String> roles;
    private boolean isAdmin = false;
    private boolean enabled = true;

    public User(String username, String password, String email, Set<String> roles) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.enabled = true;
    }
}

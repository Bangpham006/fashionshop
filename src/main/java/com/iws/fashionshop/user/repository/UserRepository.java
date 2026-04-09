package com.iws.fashionshop.user.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.iws.fashionshop.user.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Boolean existsByUsernameIgnoreCase(String username);

    Optional<User> findByUsernameIgnoreCase(String username);
}

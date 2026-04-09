package com.iws.fashionshop.product.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iws.fashionshop.product.model.Product;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final List<Product> products = new ArrayList<>();

    @GetMapping
    public List<Product> getAll() {
        return products;
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        products.add(product);
        return product;
    }
}

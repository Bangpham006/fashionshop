package com.iws.fashionshop.controller;

import com.iws.fashionshop.model.Product;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private List<Product> products = new ArrayList<>();

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
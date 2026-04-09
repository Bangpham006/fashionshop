package com.iws.fashionshop;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestControler {

    @GetMapping
    public String test() {
        return "OK";
    }
}

package com.iws.fashionshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class FashionshopApplication {

	public static void main(String[] args) {
		SpringApplication.run(FashionshopApplication.class, args);
		System.out.println("FashionshopApplication started successfully");
	}

}

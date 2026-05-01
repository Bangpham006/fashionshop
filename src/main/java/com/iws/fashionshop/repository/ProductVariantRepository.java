package com.iws.fashionshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.iws.fashionshop.model.ProductVariant;
import org.bson.types.ObjectId;

@Repository
public interface ProductVariantRepository extends MongoRepository<ProductVariant, String> {

    List<ProductVariant> findByProductId(ObjectId productId);

    Optional<ProductVariant> findBySku(String sku);

    List<ProductVariant> findByStockLessThan(Integer threshold);
}

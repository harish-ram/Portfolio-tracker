package org.ozsoft.portfoliomanager.repository;

import org.ozsoft.portfoliomanager.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<StockEntity, String> {
}

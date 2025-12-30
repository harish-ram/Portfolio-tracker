package org.ozsoft.portfoliomanager.repository;

import org.ozsoft.portfoliomanager.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, Integer> {
    List<TransactionEntity> findBySymbol(String symbol);
    List<TransactionEntity> findAllByOrderByDateAsc();
    List<TransactionEntity> findByUserIdOrderByDateAsc(Long userId);
    List<TransactionEntity> findByUserIdAndSymbol(Long userId, String symbol);
    List<TransactionEntity> findByUserId(Long userId);
    Optional<TransactionEntity> findByIdAndUserId(Integer id, Long userId);
}

package org.ozsoft.portfoliomanager.repository;

import org.ozsoft.portfoliomanager.entity.PortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioEntity, Long> {
    Optional<PortfolioEntity> findByUserId(Long userId);
}

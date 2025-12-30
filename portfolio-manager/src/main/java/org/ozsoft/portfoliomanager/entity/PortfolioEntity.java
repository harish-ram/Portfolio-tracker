package org.ozsoft.portfoliomanager.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name = "portfolios")
public class PortfolioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "current_cost", precision = 19, scale = 4)
    private BigDecimal currentCost = BigDecimal.ZERO;

    @Column(name = "current_value", precision = 19, scale = 4)
    private BigDecimal currentValue = BigDecimal.ZERO;

    @Column(name = "total_cost", precision = 19, scale = 4)
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(name = "annual_income", precision = 19, scale = 4)
    private BigDecimal annualIncome = BigDecimal.ZERO;

    @Column(name = "total_income", precision = 19, scale = 4)
    private BigDecimal totalIncome = BigDecimal.ZERO;

    @Column(name = "realized_result", precision = 19, scale = 4)
    private BigDecimal realizedResult = BigDecimal.ZERO;

    @Column(name = "total_return", precision = 19, scale = 4)
    private BigDecimal totalReturn = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public PortfolioEntity() {
    }

    public PortfolioEntity(Long userId, String name) {
        this.userId = userId;
        this.name = name;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCurrentCost() {
        return currentCost;
    }

    public void setCurrentCost(BigDecimal currentCost) {
        this.currentCost = currentCost;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public BigDecimal getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(BigDecimal annualIncome) {
        this.annualIncome = annualIncome;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getRealizedResult() {
        return realizedResult;
    }

    public void setRealizedResult(BigDecimal realizedResult) {
        this.realizedResult = realizedResult;
    }

    public BigDecimal getTotalReturn() {
        return totalReturn;
    }

    public void setTotalReturn(BigDecimal totalReturn) {
        this.totalReturn = totalReturn;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

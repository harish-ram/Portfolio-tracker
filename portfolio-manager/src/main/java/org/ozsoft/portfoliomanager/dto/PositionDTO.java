package org.ozsoft.portfoliomanager.dto;

import java.math.BigDecimal;

import org.ozsoft.portfoliomanager.domain.Position;

public class PositionDTO {

    private String symbol;
    private String stockName;
    private BigDecimal noOfShares;
    private BigDecimal currentCost;
    private BigDecimal totalCost;
    private BigDecimal costPerShare;
    private BigDecimal currentValue;
    private BigDecimal unrealizedResult;
    private BigDecimal unrealizedResultPercentage;
    private BigDecimal totalIncome;
    private BigDecimal annualIncome;
    private BigDecimal yieldOnCost;
    private BigDecimal totalReturn;

    public PositionDTO() {
        this.noOfShares = BigDecimal.ZERO;
        this.currentCost = BigDecimal.ZERO;
        this.totalCost = BigDecimal.ZERO;
        this.costPerShare = BigDecimal.ZERO;
        this.currentValue = BigDecimal.ZERO;
        this.unrealizedResult = BigDecimal.ZERO;
        this.unrealizedResultPercentage = BigDecimal.ZERO;
        this.totalIncome = BigDecimal.ZERO;
        this.annualIncome = BigDecimal.ZERO;
        this.yieldOnCost = BigDecimal.ZERO;
        this.totalReturn = BigDecimal.ZERO;
    }

    public PositionDTO(Position position) {
        if (position != null && position.getStock() != null) {
            this.symbol = position.getStock().getSymbol();
            this.stockName = position.getStock().getName();
            this.noOfShares = position.getNoOfShares() != null ? position.getNoOfShares() : BigDecimal.ZERO;
            this.currentCost = position.getCurrentCost() != null ? position.getCurrentCost() : BigDecimal.ZERO;
            this.totalCost = position.getTotalCost() != null ? position.getTotalCost() : BigDecimal.ZERO;
            this.costPerShare = position.getCostPerShare() != null ? position.getCostPerShare() : BigDecimal.ZERO;
            this.currentValue = position.getCurrentValue() != null ? position.getCurrentValue() : BigDecimal.ZERO;
            this.unrealizedResult = position.getCurrentResult() != null ? position.getCurrentResult() : BigDecimal.ZERO;
            this.unrealizedResultPercentage = position.getCurrentResultPercentage() != null ? position.getCurrentResultPercentage() : BigDecimal.ZERO;
            this.totalIncome = position.getTotalIncome() != null ? position.getTotalIncome() : BigDecimal.ZERO;
            this.annualIncome = position.getAnnualIncome() != null ? position.getAnnualIncome() : BigDecimal.ZERO;
            this.yieldOnCost = position.getYieldOnCost() != null ? position.getYieldOnCost() : BigDecimal.ZERO;
            this.totalReturn = position.getTotalReturn() != null ? position.getTotalReturn() : BigDecimal.ZERO;
        }
    }

    public static PositionDTO fromPosition(Position position) {
        return new PositionDTO(position);
    }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getStockName() { return stockName; }
    public void setStockName(String stockName) { this.stockName = stockName; }

    public BigDecimal getNoOfShares() { return noOfShares; }
    public void setNoOfShares(BigDecimal noOfShares) { this.noOfShares = noOfShares; }

    public BigDecimal getCurrentCost() { return currentCost; }
    public void setCurrentCost(BigDecimal currentCost) { this.currentCost = currentCost; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public BigDecimal getCostPerShare() { return costPerShare; }
    public void setCostPerShare(BigDecimal costPerShare) { this.costPerShare = costPerShare; }

    public BigDecimal getCurrentValue() { return currentValue; }
    public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }

    public BigDecimal getUnrealizedResult() { return unrealizedResult; }
    public void setUnrealizedResult(BigDecimal unrealizedResult) { this.unrealizedResult = unrealizedResult; }

    public BigDecimal getUnrealizedResultPercentage() { return unrealizedResultPercentage; }
    public void setUnrealizedResultPercentage(BigDecimal unrealizedResultPercentage) { this.unrealizedResultPercentage = unrealizedResultPercentage; }

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; }

    public BigDecimal getYieldOnCost() { return yieldOnCost; }
    public void setYieldOnCost(BigDecimal yieldOnCost) { this.yieldOnCost = yieldOnCost; }

    public BigDecimal getTotalReturn() { return totalReturn; }
    public void setTotalReturn(BigDecimal totalReturn) { this.totalReturn = totalReturn; }
}

package org.ozsoft.portfoliomanager.dto;

import java.math.BigDecimal;

import org.ozsoft.portfoliomanager.domain.Portfolio;

public class PortfolioDTO {

    private BigDecimal currentCost;
    private BigDecimal currentValue;
    private BigDecimal currentResult;
    private BigDecimal currentResultPercentage;
    private BigDecimal totalCost;
    private BigDecimal annualIncome;
    private BigDecimal totalIncome;
    private BigDecimal yieldOnCost;
    private BigDecimal realizedResult;
    private BigDecimal totalReturn;
    private BigDecimal totalReturnPercentage;

    public PortfolioDTO() {
        this.currentCost = BigDecimal.ZERO;
        this.currentValue = BigDecimal.ZERO;
        this.currentResult = BigDecimal.ZERO;
        this.currentResultPercentage = BigDecimal.ZERO;
        this.totalCost = BigDecimal.ZERO;
        this.annualIncome = BigDecimal.ZERO;
        this.totalIncome = BigDecimal.ZERO;
        this.yieldOnCost = BigDecimal.ZERO;
        this.realizedResult = BigDecimal.ZERO;
        this.totalReturn = BigDecimal.ZERO;
        this.totalReturnPercentage = BigDecimal.ZERO;
    }

    public PortfolioDTO(Portfolio portfolio) {
        if (portfolio != null) {
            this.currentCost = portfolio.getCurrentCost() != null ? portfolio.getCurrentCost() : BigDecimal.ZERO;
            this.currentValue = portfolio.getCurrentValue() != null ? portfolio.getCurrentValue() : BigDecimal.ZERO;
            this.currentResult = portfolio.getCurrentResult() != null ? portfolio.getCurrentResult() : BigDecimal.ZERO;
            this.currentResultPercentage = portfolio.getCurrentResultPercentage() != null ? portfolio.getCurrentResultPercentage() : BigDecimal.ZERO;
            this.totalCost = portfolio.getTotalCost() != null ? portfolio.getTotalCost() : BigDecimal.ZERO;
            this.annualIncome = portfolio.getAnnualIncome() != null ? portfolio.getAnnualIncome() : BigDecimal.ZERO;
            this.totalIncome = portfolio.getTotalIncome() != null ? portfolio.getTotalIncome() : BigDecimal.ZERO;
            this.yieldOnCost = portfolio.getYieldOnCost() != null ? portfolio.getYieldOnCost() : BigDecimal.ZERO;
            this.realizedResult = portfolio.getRealizedResult() != null ? portfolio.getRealizedResult() : BigDecimal.ZERO;
            this.totalReturn = portfolio.getTotalReturn() != null ? portfolio.getTotalReturn() : BigDecimal.ZERO;
            this.totalReturnPercentage = portfolio.getTotalReturnPercentage() != null ? portfolio.getTotalReturnPercentage() : BigDecimal.ZERO;
        } else {
            this.currentCost = BigDecimal.ZERO;
            this.currentValue = BigDecimal.ZERO;
            this.currentResult = BigDecimal.ZERO;
            this.currentResultPercentage = BigDecimal.ZERO;
            this.totalCost = BigDecimal.ZERO;
            this.annualIncome = BigDecimal.ZERO;
            this.totalIncome = BigDecimal.ZERO;
            this.yieldOnCost = BigDecimal.ZERO;
            this.realizedResult = BigDecimal.ZERO;
            this.totalReturn = BigDecimal.ZERO;
            this.totalReturnPercentage = BigDecimal.ZERO;
        }
    }

    public static PortfolioDTO fromPortfolio(Portfolio portfolio) {
        return new PortfolioDTO(portfolio);
    }

    public BigDecimal getCurrentCost() { return currentCost; }
    public void setCurrentCost(BigDecimal currentCost) { this.currentCost = currentCost; }

    public BigDecimal getCurrentValue() { return currentValue; }
    public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }

    public BigDecimal getCurrentResult() { return currentResult; }
    public void setCurrentResult(BigDecimal currentResult) { this.currentResult = currentResult; }

    public BigDecimal getCurrentResultPercentage() { return currentResultPercentage; }
    public void setCurrentResultPercentage(BigDecimal currentResultPercentage) { this.currentResultPercentage = currentResultPercentage; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public BigDecimal getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; }

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getYieldOnCost() { return yieldOnCost; }
    public void setYieldOnCost(BigDecimal yieldOnCost) { this.yieldOnCost = yieldOnCost; }

    public BigDecimal getRealizedResult() { return realizedResult; }
    public void setRealizedResult(BigDecimal realizedResult) { this.realizedResult = realizedResult; }

    public BigDecimal getTotalReturn() { return totalReturn; }
    public void setTotalReturn(BigDecimal totalReturn) { this.totalReturn = totalReturn; }

    public BigDecimal getTotalReturnPercentage() { return totalReturnPercentage; }
    public void setTotalReturnPercentage(BigDecimal totalReturnPercentage) { this.totalReturnPercentage = totalReturnPercentage; }
}

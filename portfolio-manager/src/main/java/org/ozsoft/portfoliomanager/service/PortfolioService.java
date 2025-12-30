package org.ozsoft.portfoliomanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ozsoft.portfoliomanager.entity.PortfolioEntity;
import org.ozsoft.portfoliomanager.repository.PortfolioRepository;

import java.math.BigDecimal;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    public PortfolioEntity getOrCreateUserPortfolio(Long userId) {
        return portfolioRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPortfolio(userId));
    }

    public PortfolioEntity getUserPortfolio(Long userId) {
        return portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found for user: " + userId));
    }

    private PortfolioEntity createDefaultPortfolio(Long userId) {
        PortfolioEntity portfolio = new PortfolioEntity(userId, "Default Portfolio");
        return portfolioRepository.save(portfolio);
    }

    public PortfolioEntity updatePortfolioMetrics(Long userId, BigDecimal currentCost, 
                                                   BigDecimal currentValue, BigDecimal totalCost,
                                                   BigDecimal annualIncome, BigDecimal totalIncome,
                                                   BigDecimal realizedResult, BigDecimal totalReturn) {
        PortfolioEntity portfolio = getOrCreateUserPortfolio(userId);
        portfolio.setCurrentCost(currentCost);
        portfolio.setCurrentValue(currentValue);
        portfolio.setTotalCost(totalCost);
        portfolio.setAnnualIncome(annualIncome);
        portfolio.setTotalIncome(totalIncome);
        portfolio.setRealizedResult(realizedResult);
        portfolio.setTotalReturn(totalReturn);
        return portfolioRepository.save(portfolio);
    }

    public PortfolioEntity updatePortfolioName(Long userId, String name) {
        PortfolioEntity portfolio = getUserPortfolio(userId);
        portfolio.setName(name);
        return portfolioRepository.save(portfolio);
    }

    public PortfolioEntity updatePortfolioDescription(Long userId, String description) {
        PortfolioEntity portfolio = getUserPortfolio(userId);
        portfolio.setDescription(description);
        return portfolioRepository.save(portfolio);
    }
}

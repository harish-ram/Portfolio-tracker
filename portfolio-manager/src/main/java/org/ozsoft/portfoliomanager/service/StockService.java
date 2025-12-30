package org.ozsoft.portfoliomanager.service;

import org.springframework.stereotype.Service;
import org.ozsoft.portfoliomanager.domain.Configuration;
import org.ozsoft.portfoliomanager.domain.CreditRating;
import org.ozsoft.portfoliomanager.domain.Stock;
import org.ozsoft.portfoliomanager.domain.StockLevel;
import org.ozsoft.portfoliomanager.dto.StockDTO;

@Service
public class StockService {

    private final Configuration config;

    public StockService() {
        this.config = Configuration.getInstance();
    }

    public void saveStock(Stock stock) {
        config.addStock(stock);
        Configuration.save();
    }

    public void updateStock(Stock stock, StockDTO stockDTO) {
        if (stockDTO.getName() != null) {
            stock.setName(stockDTO.getName());
        }
        if (stockDTO.getPrice() != null) {
            stock.setPrice(stockDTO.getPrice());
        }
        if (stockDTO.getChangePerc() != null) {
            stock.setChangePerc(stockDTO.getChangePerc());
        }
        if (stockDTO.getTargetPrice() != null) {
            stock.setTargetPrice(stockDTO.getTargetPrice());
        }
        if (stockDTO.getDivRate() != null) {
            stock.setDivRate(stockDTO.getDivRate());
        }
        if (stockDTO.getDivGrowth() != null) {
            stock.setDivGrowth(stockDTO.getDivGrowth());
        }
        if (stockDTO.getYearsDivGrowth() >= 0) {
            stock.setYearsDivGrowth(stockDTO.getYearsDivGrowth());
        }
        if (stockDTO.getCreditRating() != null) {
            stock.setCreditRating(CreditRating.valueOf(stockDTO.getCreditRating()));
        }
        if (stockDTO.getComment() != null) {
            stock.setComment(stockDTO.getComment());
        }
        if (stockDTO.getLevel() != null) {
            stock.setLevel(StockLevel.valueOf(stockDTO.getLevel()));
        }
        Configuration.save();
    }

    public void deleteStock(Stock stock) {
        config.deleteStock(stock);
        Configuration.save();
    }

    public void setStockLevel(Stock stock, StockLevel level) {
        stock.setLevel(level);
        Configuration.save();
    }
}

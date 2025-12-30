package org.ozsoft.portfoliomanager.dto;

import java.math.BigDecimal;

import org.ozsoft.portfoliomanager.domain.CreditRating;
import org.ozsoft.portfoliomanager.domain.Stock;
import org.ozsoft.portfoliomanager.domain.StockLevel;

public class StockDTO {

    private String symbol;
    private String name;
    private BigDecimal price;
    private BigDecimal changePerc;
    private BigDecimal targetPrice;
    private BigDecimal divRate;
    private BigDecimal divGrowth;
    private int yearsDivGrowth;
    private String creditRating;
    private String comment;
    private String level;

    public StockDTO() {
        this.price = BigDecimal.ZERO;
        this.changePerc = BigDecimal.ZERO;
        this.targetPrice = BigDecimal.ZERO;
        this.divRate = BigDecimal.ZERO;
        this.divGrowth = BigDecimal.ZERO;
        this.yearsDivGrowth = 0;
        this.creditRating = CreditRating.NA.name();
        this.level = StockLevel.WATCH.name();
    }

    public StockDTO(Stock stock) {
        this.symbol = stock.getSymbol();
        this.name = stock.getName();
        this.price = stock.getPrice() != null ? stock.getPrice() : BigDecimal.ZERO;
        this.changePerc = stock.getChangePerc() != null ? stock.getChangePerc() : BigDecimal.ZERO;
        this.targetPrice = stock.getTargetPrice() != null ? stock.getTargetPrice() : BigDecimal.ZERO;
        this.divRate = stock.getDivRate() != null ? stock.getDivRate() : BigDecimal.ZERO;
        this.divGrowth = stock.getDivGrowth() != null ? stock.getDivGrowth() : BigDecimal.ZERO;
        this.yearsDivGrowth = stock.getYearsDivGrowth();
        this.creditRating = stock.getCreditRating() != null ? stock.getCreditRating().name() : CreditRating.NA.name();
        this.comment = stock.getComment();
        this.level = stock.getLevel() != null ? stock.getLevel().name() : StockLevel.WATCH.name();
    }

    public static StockDTO fromStock(Stock stock) {
        return new StockDTO(stock);
    }

    public Stock toStock() {
        Stock stock = new Stock(this.symbol, this.name);
        stock.setPrice(this.price);
        stock.setChangePerc(this.changePerc);
        stock.setTargetPrice(this.targetPrice);
        stock.setDivRate(this.divRate);
        stock.setDivGrowth(this.divGrowth);
        stock.setYearsDivGrowth(this.yearsDivGrowth);
        stock.setCreditRating(CreditRating.valueOf(this.creditRating));
        stock.setComment(this.comment);
        stock.setLevel(StockLevel.valueOf(this.level));
        return stock;
    }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getChangePerc() { return changePerc; }
    public void setChangePerc(BigDecimal changePerc) { this.changePerc = changePerc; }

    public BigDecimal getTargetPrice() { return targetPrice; }
    public void setTargetPrice(BigDecimal targetPrice) { this.targetPrice = targetPrice; }

    public BigDecimal getDivRate() { return divRate; }
    public void setDivRate(BigDecimal divRate) { this.divRate = divRate; }

    public BigDecimal getDivGrowth() { return divGrowth; }
    public void setDivGrowth(BigDecimal divGrowth) { this.divGrowth = divGrowth; }

    public int getYearsDivGrowth() { return yearsDivGrowth; }
    public void setYearsDivGrowth(int yearsDivGrowth) { this.yearsDivGrowth = yearsDivGrowth; }

    public String getCreditRating() { return creditRating; }
    public void setCreditRating(String creditRating) { this.creditRating = creditRating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}

package org.ozsoft.portfoliomanager.entity;

import java.math.BigDecimal;
import javax.persistence.*;

@Entity
@Table(name = "stocks")
public class StockEntity {

    @Id
    @Column(name = "symbol", length = 20)
    private String symbol;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "price", precision = 19, scale = 4)
    private BigDecimal price;

    @Column(name = "change_percentage", precision = 19, scale = 4)
    private BigDecimal changePerc;

    @Column(name = "target_price", precision = 19, scale = 4)
    private BigDecimal targetPrice;

    @Column(name = "dividend_rate", precision = 19, scale = 4)
    private BigDecimal divRate;

    @Column(name = "dividend_growth", precision = 19, scale = 4)
    private BigDecimal divGrowth;

    @Column(name = "years_div_growth")
    private Integer yearsDivGrowth;

    @Column(name = "credit_rating", length = 20)
    private String creditRating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "level", length = 20)
    private String level;

    public StockEntity() {
    }

    public StockEntity(String symbol, String name) {
        this.symbol = symbol;
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getChangePerc() {
        return changePerc;
    }

    public void setChangePerc(BigDecimal changePerc) {
        this.changePerc = changePerc;
    }

    public BigDecimal getTargetPrice() {
        return targetPrice;
    }

    public void setTargetPrice(BigDecimal targetPrice) {
        this.targetPrice = targetPrice;
    }

    public BigDecimal getDivRate() {
        return divRate;
    }

    public void setDivRate(BigDecimal divRate) {
        this.divRate = divRate;
    }

    public BigDecimal getDivGrowth() {
        return divGrowth;
    }

    public void setDivGrowth(BigDecimal divGrowth) {
        this.divGrowth = divGrowth;
    }

    public Integer getYearsDivGrowth() {
        return yearsDivGrowth;
    }

    public void setYearsDivGrowth(Integer yearsDivGrowth) {
        this.yearsDivGrowth = yearsDivGrowth;
    }

    public String getCreditRating() {
        return creditRating;
    }

    public void setCreditRating(String creditRating) {
        this.creditRating = creditRating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}

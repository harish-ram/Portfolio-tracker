package org.ozsoft.portfoliomanager.dto;

import java.math.BigDecimal;

import org.ozsoft.portfoliomanager.domain.Transaction;
import org.ozsoft.portfoliomanager.domain.TransactionType;

public class TransactionDTO {

    private int id;
    private long date;
    private String symbol;
    private String type;
    private BigDecimal noOfShares;
    private BigDecimal price;
    private BigDecimal cost;

    public TransactionDTO() {
        this.type = TransactionType.BUY.name();
        this.noOfShares = BigDecimal.ZERO;
        this.price = BigDecimal.ZERO;
        this.cost = BigDecimal.ZERO;
    }

    public TransactionDTO(Transaction transaction) {
        this.id = transaction.getId();
        this.date = transaction.getDate();
        this.symbol = transaction.getSymbol();
        this.type = transaction.getType() != null ? transaction.getType().name() : TransactionType.BUY.name();
        this.noOfShares = transaction.getNoOfShares() != null ? transaction.getNoOfShares() : BigDecimal.ZERO;
        this.price = transaction.getPrice() != null ? transaction.getPrice() : BigDecimal.ZERO;
        this.cost = transaction.getCost() != null ? transaction.getCost() : BigDecimal.ZERO;
    }

    public static TransactionDTO fromTransaction(Transaction transaction) {
        return new TransactionDTO(transaction);
    }

    public Transaction toTransaction() {
        Transaction transaction = new Transaction();
        transaction.setId(this.id);
        transaction.setDate(this.date);
        transaction.setSymbol(this.symbol);
        transaction.setType(TransactionType.valueOf(this.type));
        transaction.setNoOfShares(this.noOfShares);
        transaction.setPrice(this.price);
        transaction.setCost(this.cost);
        return transaction;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public long getDate() { return date; }
    public void setDate(long date) { this.date = date; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getNoOfShares() { return noOfShares; }
    public void setNoOfShares(BigDecimal noOfShares) { this.noOfShares = noOfShares; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
}

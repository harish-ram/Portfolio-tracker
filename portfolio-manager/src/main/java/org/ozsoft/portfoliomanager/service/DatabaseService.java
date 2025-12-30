package org.ozsoft.portfoliomanager.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ozsoft.portfoliomanager.domain.Stock;
import org.ozsoft.portfoliomanager.domain.Transaction;
import org.ozsoft.portfoliomanager.domain.TransactionType;
import org.ozsoft.portfoliomanager.domain.CreditRating;
import org.ozsoft.portfoliomanager.domain.StockLevel;
import org.ozsoft.portfoliomanager.entity.StockEntity;
import org.ozsoft.portfoliomanager.entity.TransactionEntity;
import org.ozsoft.portfoliomanager.repository.StockRepository;
import org.ozsoft.portfoliomanager.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class DatabaseService {

    private static final Logger LOGGER = LogManager.getLogger(DatabaseService.class);

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public void saveStock(Stock stock) {
        try {
            StockEntity entity = new StockEntity(stock.getSymbol(), stock.getName());
            entity.setPrice(stock.getPrice());
            entity.setChangePerc(stock.getChangePerc());
            entity.setTargetPrice(stock.getTargetPrice());
            entity.setDivRate(stock.getDivRate());
            entity.setDivGrowth(stock.getDivGrowth());
            entity.setYearsDivGrowth(stock.getYearsDivGrowth());
            entity.setCreditRating(stock.getCreditRating() != null ? stock.getCreditRating().toString() : CreditRating.NA.toString());
            entity.setComment(stock.getComment());
            entity.setLevel(stock.getLevel() != null ? stock.getLevel().toString() : StockLevel.WATCH.toString());
            
            stockRepository.save(entity);
            LOGGER.debug("Stock saved to database: " + stock.getSymbol());
        } catch (Exception e) {
            LOGGER.error("Error saving stock to database", e);
            throw new RuntimeException("Failed to save stock to database", e);
        }
    }

    public void updateStock(Stock stock) {
        try {
            @SuppressWarnings("null")
            StockEntity entity = stockRepository.findById(stock.getSymbol()).orElse(null);
            if (null != entity) {
                entity.setName(stock.getName());
                entity.setPrice(stock.getPrice());
                entity.setChangePerc(stock.getChangePerc());
                entity.setTargetPrice(stock.getTargetPrice());
                entity.setDivRate(stock.getDivRate());
                entity.setDivGrowth(stock.getDivGrowth());
                entity.setYearsDivGrowth(stock.getYearsDivGrowth());
                entity.setCreditRating(stock.getCreditRating() != null ? stock.getCreditRating().toString() : CreditRating.NA.toString());
                entity.setComment(stock.getComment());
                entity.setLevel(stock.getLevel() != null ? stock.getLevel().toString() : StockLevel.WATCH.toString());
                
                stockRepository.save(entity);
                LOGGER.debug("Stock updated in database: " + stock.getSymbol());
            }
        } catch (Exception e) {
            LOGGER.error("Error updating stock in database", e);
            throw new RuntimeException("Failed to update stock in database", e);
        }
    }

    public void deleteStock(String symbol) {
        try {
            stockRepository.deleteById((symbol != null ? symbol : ""));
            LOGGER.debug("Stock deleted from database: " + symbol);
        } catch (Exception e) {
            LOGGER.error("Error deleting stock from database", e);
            throw new RuntimeException("Failed to delete stock from database", e);
        }
    }

    public List<Stock> loadAllStocks() {
        try {
            List<StockEntity> entities = stockRepository.findAll();
            List<Stock> stocks = new ArrayList<>();
            for (StockEntity entity : entities) {
                try {
                    stocks.add(entityToDomain(entity));
                } catch (Exception e) {
                    LOGGER.warn("Error converting stock entity to domain: " + entity.getSymbol(), e);
                }
            }
            LOGGER.info("Loaded " + stocks.size() + " stocks from database");
            return stocks;
        } catch (Exception e) {
            LOGGER.warn("Error loading stocks from database, will use JSON fallback", e);
            return new ArrayList<>();
        }
    }

    public void saveTransaction(Transaction transaction) {
        try {
            TransactionEntity entity = new TransactionEntity();
            entity.setDate(transaction.getDate());
            entity.setSymbol(transaction.getSymbol());
            entity.setType(transaction.getType().toString());
            entity.setNoOfShares(transaction.getNoOfShares());
            entity.setPrice(transaction.getPrice());
            entity.setCost(transaction.getCost());
            
            transactionRepository.save(entity);
            LOGGER.debug("Transaction saved to database");
        } catch (Exception e) {
            LOGGER.error("Error saving transaction to database", e);
            throw new RuntimeException("Failed to save transaction to database", e);
        }
    }

    public void deleteTransaction(Integer id) {
        try {
            if (id != null) {
                transactionRepository.deleteById(id);
            }
            LOGGER.debug("Transaction deleted from database: " + id);
        } catch (Exception e) {
            LOGGER.error("Error deleting transaction from database", e);
            throw new RuntimeException("Failed to delete transaction from database", e);
        }
    }

    public List<Transaction> loadAllTransactions() {
        try {
            List<TransactionEntity> entities = transactionRepository.findAllByOrderByDateAsc();
            if (entities == null) {
                return new ArrayList<>();
            }
            List<Transaction> transactions = new ArrayList<>();
            for (TransactionEntity entity : entities) {
                try {
                    transactions.add(entityToDomain(entity));
                } catch (Exception e) {
                    LOGGER.warn("Error converting transaction entity to domain: " + entity.getId(), e);
                }
            }
            LOGGER.info("Loaded " + transactions.size() + " transactions from database");
            return transactions;
        } catch (Exception e) {
            LOGGER.warn("Error loading transactions from database, will use JSON fallback", e);
            return new ArrayList<>();
        }
    }

    private Stock entityToDomain(StockEntity entity) {
        Stock stock = new Stock(entity.getSymbol(), entity.getName());
        stock.setPrice(entity.getPrice() != null ? entity.getPrice() : BigDecimal.ZERO);
        stock.setChangePerc(entity.getChangePerc() != null ? entity.getChangePerc() : BigDecimal.ZERO);
        stock.setTargetPrice(entity.getTargetPrice() != null ? entity.getTargetPrice() : BigDecimal.ZERO);
        stock.setDivRate(entity.getDivRate() != null ? entity.getDivRate() : BigDecimal.ZERO);
        stock.setDivGrowth(entity.getDivGrowth() != null ? entity.getDivGrowth() : BigDecimal.ZERO);
        if (entity.getYearsDivGrowth() != null) {
            stock.setYearsDivGrowth(entity.getYearsDivGrowth());
        }
        if (entity.getCreditRating() != null) {
            stock.setCreditRating(CreditRating.valueOf(entity.getCreditRating()));
        }
        stock.setComment(entity.getComment());
        if (entity.getLevel() != null) {
            stock.setLevel(StockLevel.valueOf(entity.getLevel()));
        }
        return stock;
    }

    private Transaction entityToDomain(TransactionEntity entity) {
        Transaction transaction = new Transaction();
        transaction.setId(entity.getId());
        transaction.setDate(entity.getDate());
        transaction.setSymbol(entity.getSymbol());
        transaction.setType(TransactionType.valueOf(entity.getType()));
        transaction.setNoOfShares(entity.getNoOfShares());
        transaction.setPrice(entity.getPrice());
        transaction.setCost(entity.getCost());
        return transaction;
    }
}

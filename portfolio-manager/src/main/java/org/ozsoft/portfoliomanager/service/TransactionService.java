package org.ozsoft.portfoliomanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ozsoft.portfoliomanager.domain.Configuration;
import org.ozsoft.portfoliomanager.domain.Transaction;
import org.ozsoft.portfoliomanager.domain.TransactionType;
import org.ozsoft.portfoliomanager.dto.TransactionDTO;
import org.ozsoft.portfoliomanager.entity.TransactionEntity;
import org.ozsoft.portfoliomanager.repository.TransactionRepository;
import org.ozsoft.portfoliomanager.repository.UserRepository;

import java.util.List;
import java.util.Objects;

@Service
public class TransactionService {

    private final Configuration config;
    
    @Autowired
    protected TransactionRepository transactionRepository;
    
    @Autowired
    protected UserRepository userRepository;

    public TransactionService() {
        this.config = Configuration.getInstance();
    }

    public Transaction getTransactionById(int id) {
        for (Transaction transaction : config.getTransactions()) {
            if (transaction.getId() == id) {
                return transaction;
            }
        }
        return null;
    }

    public Transaction createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        transaction.setDate(transactionDTO.getDate());
        transaction.setSymbol(transactionDTO.getSymbol());
        transaction.setType(TransactionType.valueOf(transactionDTO.getType()));
        transaction.setNoOfShares(transactionDTO.getNoOfShares());
        transaction.setPrice(transactionDTO.getPrice());
        transaction.setCost(transactionDTO.getCost());

        config.addTransaction(transaction);
        Configuration.save();

        return transaction;
    }

    public void deleteTransaction(int id) {
        Transaction transaction = getTransactionById(id);
        if (transaction != null) {
            config.deleteTransaction(transaction);
            Configuration.save();
        }
    }

    public List<TransactionEntity> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByDateAsc(userId);
    }

    public TransactionEntity createUserTransaction(Long userId, TransactionDTO transactionDTO) {
        TransactionEntity entity = new TransactionEntity();
        entity.setUserId(userId);
        entity.setDate(transactionDTO.getDate());
        entity.setSymbol(transactionDTO.getSymbol());
        entity.setType(transactionDTO.getType());
        entity.setNoOfShares(transactionDTO.getNoOfShares());
        entity.setPrice(transactionDTO.getPrice());
        entity.setCost(transactionDTO.getCost());

        return transactionRepository.save(entity);
    }

    public TransactionEntity getUserTransactionById(Long userId, Integer transactionId) {
        return transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found or unauthorized"));
    }

    public void deleteUserTransaction(Long userId, Integer transactionId) {
        TransactionEntity entity = getUserTransactionById(userId, transactionId);
        transactionRepository.delete(Objects.requireNonNull(entity));
    }

    public List<TransactionEntity> getUserTransactionsBySymbol(Long userId, String symbol) {
        return transactionRepository.findByUserIdAndSymbol(userId, symbol);
    }
}

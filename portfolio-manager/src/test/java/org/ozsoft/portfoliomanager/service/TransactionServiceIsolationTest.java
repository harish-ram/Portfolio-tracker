package org.ozsoft.portfoliomanager.service;

import org.junit.Before;
import org.junit.Test;
import org.ozsoft.portfoliomanager.domain.User;
import org.ozsoft.portfoliomanager.dto.TransactionDTO;
import org.ozsoft.portfoliomanager.entity.TransactionEntity;
import org.ozsoft.portfoliomanager.repository.TransactionRepository;
import org.ozsoft.portfoliomanager.repository.UserRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class TransactionServiceIsolationTest {

    private TransactionService transactionService;
    private TransactionRepository transactionRepository;
    private UserRepository userRepository;

    private User user1;
    private User user2;

    @Before
    public void setUp() {
        transactionRepository = mock(TransactionRepository.class);
        userRepository = mock(UserRepository.class);
        transactionService = new TransactionService();
        transactionService.transactionRepository = transactionRepository;
        transactionService.userRepository = userRepository;

        user1 = new User("user1_google_id", "user1@example.com", "User One", "pic1.jpg");
        user1.setId(1L);
        
        user2 = new User("user2_google_id", "user2@example.com", "User Two", "pic2.jpg");
        user2.setId(2L);
    }

    @Test
    public void testUser1TransactionsNotAccessibleToUser2() {
        TransactionEntity user1Txn = createTransaction(1, 1L, "AAPL", 5);
        TransactionEntity user2Txn = createTransaction(2, 2L, "MSFT", 10);

        when(transactionRepository.findByUserId(1L)).thenReturn(List.of(user1Txn));
        when(transactionRepository.findByUserId(2L)).thenReturn(List.of(user2Txn));

        List<TransactionEntity> user1Txns = transactionService.getUserTransactions(1L);
        List<TransactionEntity> user2Txns = transactionService.getUserTransactions(2L);

        assertEquals(1, user1Txns.size());
        assertEquals(1, user2Txns.size());
        assertEquals("AAPL", user1Txns.get(0).getSymbol());
        assertEquals("MSFT", user2Txns.get(0).getSymbol());
        assertNotEquals(user1Txns.get(0).getSymbol(), user2Txns.get(0).getSymbol());
    }

    @Test
    public void testUnauthorizedTransactionAccess() {
        TransactionEntity user2Txn = createTransaction(1, 2L, "MSFT", 10);

        when(transactionRepository.findByIdAndUserId(1, 2L)).thenReturn(Optional.of(user2Txn));
        when(transactionRepository.findByIdAndUserId(1, 1L)).thenReturn(Optional.empty());

        try {
            transactionService.getUserTransactionById(1L, 1);
            fail("Should throw IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage().contains("not found or unauthorized"));
        }
    }

    @Test
    public void testUserCanOnlyDeleteOwnTransactions() {
        TransactionEntity user1Txn = createTransaction(1, 1L, "AAPL", 5);

        when(transactionRepository.findByIdAndUserId(1, 1L)).thenReturn(Optional.of(user1Txn));
        when(transactionRepository.findByIdAndUserId(1, 2L)).thenReturn(Optional.empty());

        try {
            transactionService.deleteUserTransaction(2L, 1);
            fail("Should throw IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage().contains("not found or unauthorized"));
        }

        verify(transactionRepository, never()).delete(user1Txn);
    }

    @Test
    public void testTransactionsBySymbolAreUserScoped() {
        TransactionEntity user1Txn = createTransaction(1, 1L, "AAPL", 5);
        TransactionEntity user2Txn = createTransaction(2, 2L, "AAPL", 20);

        when(transactionRepository.findByUserIdAndSymbol(1L, "AAPL")).thenReturn(List.of(user1Txn));
        when(transactionRepository.findByUserIdAndSymbol(2L, "AAPL")).thenReturn(List.of(user2Txn));

        List<TransactionEntity> user1AAPLTxns = transactionService.getUserTransactionsBySymbol(1L, "AAPL");
        List<TransactionEntity> user2AAPLTxns = transactionService.getUserTransactionsBySymbol(2L, "AAPL");

        assertEquals(1, user1AAPLTxns.size());
        assertEquals(1, user2AAPLTxns.size());
        assertEquals(new BigDecimal("5"), user1AAPLTxns.get(0).getNoOfShares());
        assertEquals(new BigDecimal("20"), user2AAPLTxns.get(0).getNoOfShares());
    }

    @Test
    public void testCreateTransactionSetsUserId() {
        TransactionDTO dto = new TransactionDTO();
        dto.setDate(System.currentTimeMillis());
        dto.setSymbol("AAPL");
        dto.setType("BUY");
        dto.setNoOfShares(new BigDecimal("5"));
        dto.setPrice(new BigDecimal("150"));
        dto.setCost(new BigDecimal("5"));

        TransactionEntity savedEntity = new TransactionEntity();
        savedEntity.setId(1);
        savedEntity.setUserId(1L);
        savedEntity.setDate(dto.getDate());
        savedEntity.setSymbol(dto.getSymbol());
        savedEntity.setType(dto.getType());
        savedEntity.setNoOfShares(dto.getNoOfShares());
        savedEntity.setPrice(dto.getPrice());
        savedEntity.setCost(dto.getCost());

        when(transactionRepository.save(any(TransactionEntity.class))).thenReturn(savedEntity);

        TransactionEntity created = transactionService.createUserTransaction(1L, dto);

        assertEquals(1L, created.getUserId().longValue());
        assertEquals("AAPL", created.getSymbol());
        assertEquals(new BigDecimal("5"), created.getNoOfShares());
    }

    @Test
    public void testMultipleUsersIndependentTransactions() {
        TransactionEntity user1Txn1 = createTransaction(1, 1L, "AAPL", 5);
        TransactionEntity user1Txn2 = createTransaction(2, 1L, "MSFT", 10);
        TransactionEntity user2Txn1 = createTransaction(3, 2L, "AAPL", 15);
        TransactionEntity user2Txn2 = createTransaction(4, 2L, "GOOGL", 8);

        when(transactionRepository.findByUserId(1L)).thenReturn(List.of(user1Txn1, user1Txn2));
        when(transactionRepository.findByUserId(2L)).thenReturn(List.of(user2Txn1, user2Txn2));

        List<TransactionEntity> user1Txns = transactionService.getUserTransactions(1L);
        List<TransactionEntity> user2Txns = transactionService.getUserTransactions(2L);

        assertEquals(2, user1Txns.size());
        assertEquals(2, user2Txns.size());

        assertTrue(user1Txns.stream().allMatch(t -> t.getUserId().equals(1L)));
        assertTrue(user2Txns.stream().allMatch(t -> t.getUserId().equals(2L)));
    }

    private TransactionEntity createTransaction(int id, long userId, String symbol, int shares) {
        TransactionEntity entity = new TransactionEntity();
        entity.setId(id);
        entity.setUserId(userId);
        entity.setDate(System.currentTimeMillis());
        entity.setSymbol(symbol);
        entity.setType("BUY");
        entity.setNoOfShares(new BigDecimal(shares));
        entity.setPrice(new BigDecimal("100"));
        entity.setCost(BigDecimal.ZERO);
        return entity;
    }
}

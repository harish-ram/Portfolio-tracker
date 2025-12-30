package org.ozsoft.portfoliomanager;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.ozsoft.portfoliomanager.domain.User;
import org.ozsoft.portfoliomanager.entity.TransactionEntity;
import org.ozsoft.portfoliomanager.repository.TransactionRepository;
import org.ozsoft.portfoliomanager.repository.UserRepository;
import org.ozsoft.portfoliomanager.service.TransactionService;

import java.math.BigDecimal;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DataIsolationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionService transactionService;

    private User user1;
    private User user2;

    @Before
    public void setUp() {
        transactionRepository.deleteAll();
        userRepository.deleteAll();

        user1 = new User("user1_google_id", "user1@example.com", "User One", "https://example.com/pic1.jpg");
        user2 = new User("user2_google_id", "user2@example.com", "User Two", "https://example.com/pic2.jpg");

        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testUser1CannotSeeUser2Transactions() {
        TransactionEntity user2Txn = new TransactionEntity();
        user2Txn.setUserId(user2.getId());
        user2Txn.setDate(System.currentTimeMillis());
        user2Txn.setSymbol("MSFT");
        user2Txn.setType("BUY");
        user2Txn.setNoOfShares(new BigDecimal("10"));
        user2Txn.setPrice(new BigDecimal("300"));
        user2Txn.setCost(new BigDecimal("10"));
        transactionRepository.save(user2Txn);

        List<TransactionEntity> user2Transactions = transactionService.getUserTransactions(user2.getId());
        assert user2Transactions.size() == 1;
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testUser1TransactionsIsolatedFromUser2() {
        TransactionEntity user1Txn = new TransactionEntity();
        user1Txn.setUserId(user1.getId());
        user1Txn.setDate(System.currentTimeMillis());
        user1Txn.setSymbol("AAPL");
        user1Txn.setType("BUY");
        user1Txn.setNoOfShares(new BigDecimal("5"));
        user1Txn.setPrice(new BigDecimal("150"));
        user1Txn.setCost(new BigDecimal("5"));
        transactionRepository.save(user1Txn);

        TransactionEntity user2Txn = new TransactionEntity();
        user2Txn.setUserId(user2.getId());
        user2Txn.setDate(System.currentTimeMillis());
        user2Txn.setSymbol("MSFT");
        user2Txn.setType("BUY");
        user2Txn.setNoOfShares(new BigDecimal("10"));
        user2Txn.setPrice(new BigDecimal("300"));
        user2Txn.setCost(new BigDecimal("10"));
        transactionRepository.save(user2Txn);

        List<TransactionEntity> user1Transactions = transactionService.getUserTransactions(user1.getId());
        assert user1Transactions.size() == 1;
        assert user1Transactions.get(0).getUserId().equals(user1.getId());
        assert user1Transactions.get(0).getSymbol().equals("AAPL");
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testUnauthorizedAccessToUser2Transaction() {
        TransactionEntity user2Txn = new TransactionEntity();
        user2Txn.setUserId(user2.getId());
        user2Txn.setDate(System.currentTimeMillis());
        user2Txn.setSymbol("MSFT");
        user2Txn.setType("BUY");
        user2Txn.setNoOfShares(new BigDecimal("10"));
        user2Txn.setPrice(new BigDecimal("300"));
        user2Txn.setCost(new BigDecimal("10"));
        TransactionEntity savedTxn = transactionRepository.save(user2Txn);

        try {
            transactionService.getUserTransactionById(user1.getId(), savedTxn.getId());
            assert false : "Should throw exception for unauthorized access";
        } catch (IllegalArgumentException e) {
            assert e.getMessage().contains("not found or unauthorized");
        }
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testUser1CannotDeleteUser2Transaction() {
        TransactionEntity user2Txn = new TransactionEntity();
        user2Txn.setUserId(user2.getId());
        user2Txn.setDate(System.currentTimeMillis());
        user2Txn.setSymbol("MSFT");
        user2Txn.setType("BUY");
        user2Txn.setNoOfShares(new BigDecimal("10"));
        user2Txn.setPrice(new BigDecimal("300"));
        user2Txn.setCost(new BigDecimal("10"));
        TransactionEntity savedTxn = transactionRepository.save(user2Txn);

        try {
            transactionService.deleteUserTransaction(user1.getId(), savedTxn.getId());
            assert false : "Should throw exception for unauthorized deletion";
        } catch (IllegalArgumentException e) {
            assert e.getMessage().contains("not found or unauthorized");
        }

        TransactionEntity stillExists = transactionRepository.findById(savedTxn.getId()).orElse(null);
        assert stillExists != null : "Transaction should still exist";
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testTransactionsBySymbolAreUserScoped() {
        TransactionEntity user1Txn1 = new TransactionEntity();
        user1Txn1.setUserId(user1.getId());
        user1Txn1.setDate(System.currentTimeMillis());
        user1Txn1.setSymbol("AAPL");
        user1Txn1.setType("BUY");
        user1Txn1.setNoOfShares(new BigDecimal("5"));
        user1Txn1.setPrice(new BigDecimal("150"));
        user1Txn1.setCost(new BigDecimal("5"));
        transactionRepository.save(user1Txn1);

        TransactionEntity user2Txn1 = new TransactionEntity();
        user2Txn1.setUserId(user2.getId());
        user2Txn1.setDate(System.currentTimeMillis());
        user2Txn1.setSymbol("AAPL");
        user2Txn1.setType("BUY");
        user2Txn1.setNoOfShares(new BigDecimal("20"));
        user2Txn1.setPrice(new BigDecimal("160"));
        user2Txn1.setCost(new BigDecimal("20"));
        transactionRepository.save(user2Txn1);

        List<TransactionEntity> user1AAPLTxns = transactionService.getUserTransactionsBySymbol(user1.getId(), "AAPL");
        assert user1AAPLTxns.size() == 1;
        assert user1AAPLTxns.get(0).getNoOfShares().equals(new BigDecimal("5"));

        List<TransactionEntity> user2AAPLTxns = transactionService.getUserTransactionsBySymbol(user2.getId(), "AAPL");
        assert user2AAPLTxns.size() == 1;
        assert user2AAPLTxns.get(0).getNoOfShares().equals(new BigDecimal("20"));
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testMultipleUsersCanHaveSameSymbol() {
        for (int i = 0; i < 3; i++) {
            TransactionEntity user1Txn = new TransactionEntity();
            user1Txn.setUserId(user1.getId());
            user1Txn.setDate(System.currentTimeMillis() + i);
            user1Txn.setSymbol("AAPL");
            user1Txn.setType("BUY");
            user1Txn.setNoOfShares(new BigDecimal("5"));
            user1Txn.setPrice(new BigDecimal("150"));
            user1Txn.setCost(new BigDecimal("5"));
            transactionRepository.save(user1Txn);
        }

        for (int i = 0; i < 2; i++) {
            TransactionEntity user2Txn = new TransactionEntity();
            user2Txn.setUserId(user2.getId());
            user2Txn.setDate(System.currentTimeMillis() + i);
            user2Txn.setSymbol("AAPL");
            user2Txn.setType("BUY");
            user2Txn.setNoOfShares(new BigDecimal("20"));
            user2Txn.setPrice(new BigDecimal("160"));
            user2Txn.setCost(new BigDecimal("20"));
            transactionRepository.save(user2Txn);
        }

        List<TransactionEntity> user1AllTxns = transactionService.getUserTransactions(user1.getId());
        List<TransactionEntity> user2AllTxns = transactionService.getUserTransactions(user2.getId());

        assert user1AllTxns.size() == 3;
        assert user2AllTxns.size() == 2;
        assert user1AllTxns.stream().allMatch(t -> t.getUserId().equals(user1.getId()));
        assert user2AllTxns.stream().allMatch(t -> t.getUserId().equals(user2.getId()));
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testTransactionOrderingByDate() {
        long baseTime = System.currentTimeMillis();

        TransactionEntity txn1 = new TransactionEntity();
        txn1.setUserId(user1.getId());
        txn1.setDate(baseTime);
        txn1.setSymbol("AAPL");
        txn1.setType("BUY");
        txn1.setNoOfShares(new BigDecimal("5"));
        txn1.setPrice(new BigDecimal("150"));
        txn1.setCost(new BigDecimal("5"));
        transactionRepository.save(txn1);

        TransactionEntity txn2 = new TransactionEntity();
        txn2.setUserId(user1.getId());
        txn2.setDate(baseTime + 1000);
        txn2.setSymbol("MSFT");
        txn2.setType("BUY");
        txn2.setNoOfShares(new BigDecimal("10"));
        txn2.setPrice(new BigDecimal("300"));
        txn2.setCost(new BigDecimal("10"));
        transactionRepository.save(txn2);

        List<TransactionEntity> userTxns = transactionService.getUserTransactions(user1.getId());
        assert userTxns.size() == 2;
        assert userTxns.get(0).getDate() <= userTxns.get(1).getDate();
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "USER")
    public void testAuthenticationRequired() throws Exception {
        mockMvc.perform(get("/api/transactions").with(req -> {
                    req.getSession().invalidate();
                    return req;
                }))
                .andExpect(status().isUnauthorized());
    }
}

package org.ozsoft.portfoliomanager.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ozsoft.portfoliomanager.dto.StockPriceDTO;

@Service
public class StockPriceService {

    private static final Logger LOGGER = LogManager.getLogger(StockPriceService.class);
    
    @Autowired
    private StockAPIService stockAPIService;

    public StockPriceDTO searchStock(String symbol) {
        if (symbol == null || symbol.isEmpty()) {
            return null;
        }

        symbol = symbol.trim().toUpperCase();
        LOGGER.debug("Searching for stock: " + symbol);
        
        return stockAPIService.getStockPrice(symbol);
    }

    public List<StockPriceDTO> searchStocks(List<String> symbols) {
        List<StockPriceDTO> results = new ArrayList<>();
        for (String symbol : symbols) {
            StockPriceDTO priceDTO = searchStock(symbol);
            if (priceDTO != null) {
                results.add(priceDTO);
            }
        }
        return results;
    }

    public StockPriceDTO getIndianStock(String symbol) {
        if (symbol == null || symbol.isEmpty()) {
            return null;
        }

        symbol = symbol.trim().toUpperCase();
        LOGGER.debug("Fetching Indian stock: " + symbol);
        
        return stockAPIService.getStockPrice(symbol);
    }
}

package org.ozsoft.portfoliomanager.services.downloader;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ozsoft.portfoliomanager.domain.Quote;
import org.ozsoft.portfoliomanager.domain.Stock;

public class StockAPIQuoteDownloader extends QuoteDownloader {

    private static final Logger LOGGER = LogManager.getLogger(StockAPIQuoteDownloader.class);

    public StockAPIQuoteDownloader() {
        super(null);
    }

    @Override
    public boolean updateStock(Stock stock) {
        LOGGER.warn("Stock update via StockAPIQuoteDownloader is not fully implemented. Using StockAPIService instead.");
        return false;
    }

    @Override
    public List<Quote> getHistoricPrices(Stock stock) {
        LOGGER.warn("Historic prices retrieval via StockAPIQuoteDownloader is not implemented.");
        return new ArrayList<>();
    }

    @Override
    public List<Quote> getDividendPayouts(Stock stock) {
        LOGGER.warn("Dividend payouts retrieval via StockAPIQuoteDownloader is not implemented.");
        return new ArrayList<>();
    }
}

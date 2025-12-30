package org.ozsoft.portfoliomanager.service;

import java.math.BigDecimal;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ozsoft.portfoliomanager.dto.StockPriceDTO;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

@Service
public class StockAPIService {

    private static final Logger LOGGER = LogManager.getLogger(StockAPIService.class);
    private static final String PRIMARY_API_URL = "http://localhost:3000/nse/get_quote_info?companyName=";
    private static final int CACHE_DURATION_MINUTES = 15;
    
    @Autowired
    private MarketstackService marketstackService;
    
    private static class CacheEntry {
        StockPriceDTO data;
        long timestamp;
        
        CacheEntry(StockPriceDTO data) {
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() - timestamp > TimeUnit.MINUTES.toMillis(CACHE_DURATION_MINUTES);
        }
    }
    
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public StockPriceDTO getStockPrice(String symbol) {
        if (symbol == null || symbol.isEmpty()) {
            return null;
        }

        try {
            symbol = symbol.trim().toUpperCase();
            
            CacheEntry cached = cache.get(symbol);
            if (cached != null && !cached.isExpired()) {
                LOGGER.debug("Returning cached stock price for: " + symbol);
                return cached.data;
            }
            
            LOGGER.debug("Fetching fresh stock price for: " + symbol);
            StockPriceDTO result = fetchFromPrimaryAPI(symbol);
            
            if (result == null) {
                LOGGER.debug("Primary API returned null, trying marketstack API for: " + symbol);
                result = marketstackService.getStockPrice(symbol);
            }
            
            if (result == null) {
                result = createDefaultStockPrice(symbol);
            }
            
            if (result != null) {
                cache.put(symbol, new CacheEntry(result));
            }
            
            return result;
        } catch (Exception e) {
            LOGGER.error("Error fetching stock from API: " + symbol, e);
            return createDefaultStockPrice(symbol);
        }
    }
    
    private StockPriceDTO fetchFromPrimaryAPI(String symbol) {
        try {
            String apiUrl = PRIMARY_API_URL + symbol;
            LOGGER.debug("Calling primary Stock API for symbol: " + symbol);
            String response = makeHttpRequest(apiUrl);
            
            if (response == null || response.isEmpty()) {
                LOGGER.warn("Empty response from primary Stock API for symbol: " + symbol);
                return null;
            }

            return parseStockResponse(response, symbol);
        } catch (Exception e) {
            LOGGER.warn("Primary API failed for " + symbol + ", attempting marketstack fallback", e);
            return marketstackService.getStockPrice(symbol);
        }
    }

    @SuppressWarnings("deprecation")
    private String makeHttpRequest(String urlString) throws Exception {
        java.net.URL url = new java.net.URL(urlString);
        java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);
        conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

        int responseCode = conn.getResponseCode();
        if (responseCode == 200) {
            try (java.io.BufferedReader in = new java.io.BufferedReader(
                new java.io.InputStreamReader(conn.getInputStream())
            )) {
                StringBuilder response = new StringBuilder();
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                return response.toString();
            }
        } else {
            LOGGER.warn("Stock API returned status code: " + responseCode);
            return null;
        }
    }

    @SuppressWarnings({"java:S1168", "java:S1160"})
    private StockPriceDTO parseStockResponse(String jsonResponse, String symbol) {
        try {
            JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
            
            if (json.has("error") || !json.has("companyName")) {
                LOGGER.warn("Invalid or error response from Stock API");
                return null;
            }

            StockPriceDTO dto = new StockPriceDTO();
            dto.setSymbol(symbol);
            
            if (json.has("companyName")) {
                dto.setName(json.get("companyName").getAsString());
            }
            
            if (json.has("lastPrice")) {
                dto.setPrice(new BigDecimal(json.get("lastPrice").getAsString()));
            }
            
            if (json.has("askPrice")) {
                dto.setAsk(new BigDecimal(json.get("askPrice").getAsString()));
            } else if (json.has("lastPrice")) {
                dto.setAsk(new BigDecimal(json.get("lastPrice").getAsString()));
            }
            
            if (json.has("bidPrice")) {
                dto.setBid(new BigDecimal(json.get("bidPrice").getAsString()));
            } else if (json.has("lastPrice")) {
                dto.setBid(new BigDecimal(json.get("lastPrice").getAsString()));
            }
            
            if (json.has("openPrice")) {
                dto.setOpen(new BigDecimal(json.get("openPrice").getAsString()));
            }
            
            if (json.has("dayHigh")) {
                dto.setDayHigh(new BigDecimal(json.get("dayHigh").getAsString()));
            }
            
            if (json.has("dayLow")) {
                dto.setDayLow(new BigDecimal(json.get("dayLow").getAsString()));
            }
            
            if (json.has("ytHighPrice")) {
                dto.setYearHigh(new BigDecimal(json.get("ytHighPrice").getAsString()));
            }
            
            if (json.has("ytLowPrice")) {
                dto.setYearLow(new BigDecimal(json.get("ytLowPrice").getAsString()));
            }
            
            if (json.has("totalTradedVolume")) {
                try {
                    dto.setVolume(Long.parseLong(json.get("totalTradedVolume").getAsString().replace(",", "")));
                } catch (NumberFormatException e) {
                    LOGGER.debug("Could not parse volume");
                }
            }
            
            if (json.has("previousClose")) {
                dto.setPreviousClose(new BigDecimal(json.get("previousClose").getAsString()));
            }

            LOGGER.info("Successfully parsed stock data for: " + symbol);
            return dto;
        } catch (NumberFormatException | JsonSyntaxException e) {
            LOGGER.error("Error parsing Stock API response", e);
            return null;
        }
    }
    
    private StockPriceDTO createDefaultStockPrice(String symbol) {
        StockPriceDTO dto = new StockPriceDTO();
        dto.setSymbol(symbol);
        dto.setName(symbol);
        dto.setPrice(BigDecimal.ZERO);
        dto.setBid(BigDecimal.ZERO);
        dto.setAsk(BigDecimal.ZERO);
        dto.setOpen(BigDecimal.ZERO);
        dto.setDayHigh(BigDecimal.ZERO);
        dto.setDayLow(BigDecimal.ZERO);
        dto.setYearHigh(BigDecimal.ZERO);
        dto.setYearLow(BigDecimal.ZERO);
        dto.setPreviousClose(BigDecimal.ZERO);
        dto.setVolume(0L);
        return dto;
    }
    
    public void clearCache() {
        cache.clear();
        LOGGER.info("Stock price cache cleared");
    }
}

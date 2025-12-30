package org.ozsoft.portfoliomanager.service;

import java.math.BigDecimal;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.ozsoft.portfoliomanager.dto.StockPriceDTO;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

@Service
public class MarketstackService {

    private static final Logger LOGGER = LogManager.getLogger(MarketstackService.class);
    private static final int CACHE_DURATION_MINUTES = 15;
    
    @Value("${marketstack.api.key}")
    private String apiKey;
    
    @Value("${marketstack.api.url}")
    private String apiUrl;
    
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
                LOGGER.debug("Returning cached marketstack data for: " + symbol);
                return cached.data;
            }
            
            LOGGER.debug("Fetching fresh marketstack data for: " + symbol);
            StockPriceDTO result = fetchFromMarketstack(symbol);
            
            if (result != null) {
                cache.put(symbol, new CacheEntry(result));
            }
            
            return result;
        } catch (Exception e) {
            LOGGER.error("Error fetching stock from marketstack API: " + symbol, e);
            return null;
        }
    }
    
    private StockPriceDTO fetchFromMarketstack(String symbol) {
        try {
            String url = apiUrl + "/eod/latest?access_key=" + apiKey + "&symbols=" + symbol;
            LOGGER.debug("Calling marketstack API for symbol: " + symbol);
            
            String response = makeHttpRequest(url);
            
            if (response == null || response.isEmpty()) {
                LOGGER.warn("Empty response from marketstack API for symbol: " + symbol);
                return null;
            }

            return parseMarketstackResponse(response, symbol);
        } catch (Exception e) {
            LOGGER.error("Marketstack API failed for " + symbol, e);
            return null;
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
            LOGGER.warn("Marketstack API returned status code: " + responseCode);
            return null;
        }
    }

    private StockPriceDTO parseMarketstackResponse(String jsonResponse, String symbol) {
        try {
            JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
            
            if (json.has("error")) {
                LOGGER.warn("Error in marketstack response: " + json.get("error"));
                return null;
            }

            JsonArray dataArray = json.getAsJsonArray("data");
            if (dataArray == null || dataArray.size() == 0) {
                LOGGER.warn("No data in marketstack response for symbol: " + symbol);
                return null;
            }

            JsonObject stockData = dataArray.get(0).getAsJsonObject();
            
            StockPriceDTO dto = new StockPriceDTO();
            dto.setSymbol(symbol);
            String companyName = fetchCompanyName(symbol);
            dto.setName(companyName != null ? companyName : symbol);
            
            if (stockData.has("open")) {
                dto.setOpen(new BigDecimal(stockData.get("open").getAsString()));
            }
            
            if (stockData.has("close")) {
                dto.setPrice(new BigDecimal(stockData.get("close").getAsString()));
            }
            
            if (stockData.has("high")) {
                dto.setDayHigh(new BigDecimal(stockData.get("high").getAsString()));
            }
            
            if (stockData.has("low")) {
                dto.setDayLow(new BigDecimal(stockData.get("low").getAsString()));
            }
            
            if (stockData.has("volume")) {
                try {
                    dto.setVolume(stockData.get("volume").getAsLong());
                } catch (NumberFormatException e) {
                    LOGGER.debug("Could not parse volume");
                }
            }
            
            dto.setAsk(dto.getPrice());
            dto.setBid(dto.getPrice());
            dto.setYearHigh(dto.getDayHigh());
            dto.setYearLow(dto.getDayLow());
            dto.setPreviousClose(dto.getPrice());

            LOGGER.info("Successfully parsed marketstack data for: " + symbol);
            return dto;
        } catch (NumberFormatException | JsonSyntaxException e) {
            LOGGER.error("Error parsing marketstack response", e);
            return null;
        }
    }
    
    private String fetchCompanyName(String symbol) {
        try {
            String url = apiUrl + "/tickers/" + symbol + "?access_key=" + apiKey;
            LOGGER.debug("Fetching company name for symbol: " + symbol);
            
            String response = makeHttpRequest(url);
            
            if (response == null || response.isEmpty()) {
                LOGGER.debug("Empty response when fetching company name for: " + symbol);
                return null;
            }

            JsonObject json = JsonParser.parseString(response).getAsJsonObject();
            
            if (json.has("data")) {
                JsonObject data = json.getAsJsonObject("data");
                if (data.has("name")) {
                    String name = data.get("name").getAsString();
                    LOGGER.debug("Company name found: " + name);
                    return name;
                }
            }
            
            return null;
        } catch (Exception e) {
            LOGGER.debug("Error fetching company name for symbol: " + symbol, e);
            return null;
        }
    }
    
    public void clearCache() {
        cache.clear();
        LOGGER.info("Marketstack cache cleared");
    }
}

package org.ozsoft.portfoliomanager.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ozsoft.portfoliomanager.domain.Configuration;
import org.ozsoft.portfoliomanager.service.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class ApplicationInitializer {

    private static final Logger LOGGER = LogManager.getLogger(ApplicationInitializer.class);

    @Autowired
    private DatabaseService databaseService;

    @PostConstruct
    public void init() {
        try {
            Configuration.setDatabaseService(databaseService);
            LOGGER.info("DatabaseService injected into Configuration");
        } catch (Exception e) {
            LOGGER.error("Failed to initialize application", e);
        }
    }
}

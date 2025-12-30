package org.ozsoft.portfoliomanager.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.ozsoft.portfoliomanager.domain.User;
import org.ozsoft.portfoliomanager.repository.UserRepository;

public class SecurityUtils {

    public static String getCurrentUserGoogleId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                return oauth2User.getAttribute("sub");
            }
        }
        
        throw new SecurityException("No authenticated user found");
    }

    public static Long getCurrentUserId(UserRepository userRepository) {
        String googleId = getCurrentUserGoogleId();
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new SecurityException("User not found for googleId: " + googleId));
        return user.getId();
    }

    public static boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               !(authentication.getPrincipal() instanceof String && 
                 authentication.getPrincipal().equals("anonymousUser"));
    }

    public static class SecurityException extends RuntimeException {
        public SecurityException(String message) {
            super(message);
        }
        
        public SecurityException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}

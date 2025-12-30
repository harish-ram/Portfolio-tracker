package org.ozsoft.portfoliomanager.service;

import org.ozsoft.portfoliomanager.domain.User;
import org.ozsoft.portfoliomanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User saveOrUpdateUser(String googleId, String email, String name, String picture) {
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(name);
            user.setEmail(email);
            user.setPicture(picture);
            return userRepository.save(user);
        } else {
            User newUser = new User(googleId, email, name, picture);
            return userRepository.save(newUser);
        }
    }

    public Optional<User> getUserByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(Objects.requireNonNull(id));
    }

    public User getUserOrThrow(String googleId) {
        return userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found with googleId: " + googleId));
    }
}

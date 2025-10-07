package com.project.evrental.service;

import com.project.evrental.domain.common.UserRole;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.domain.entity.User;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.mapper.UserMapper;
import com.project.evrental.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserMapper::fromEntity).toList();
    }

    @Cacheable(value = "users", key = "#email")
    public UserResponse getUserByEmail(String email) {
        var loadedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserMapper.fromEntity(loadedUser);
    }

    public boolean checkUserExistByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getByCognitoSub(String cognitoSub) {
        var loadedUser = userRepository.findByCognitoSub(cognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + cognitoSub));
        return loadedUser;
    }

    @CacheEvict(value = "users", allEntries = true)
    public UserResponse createUser(User user) {
        return UserMapper.fromEntity(userRepository.save(user));
    }

    public UserResponse getUserById(UUID id) {
        var loadedUser = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + id)
        );
        return UserMapper.fromEntity(loadedUser);
    }

    @Transactional
    @CacheEvict(value = "users", key = "#id")
    public UserResponse verifyLicenceUserAccount(UUID id) {
        var loadedUser = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + id)
        );

        loadedUser.setIsLicenseVerified(true);
        loadedUser.setVerifiedAt(LocalDateTime.now());
        loadedUser = userRepository.save(loadedUser);
        return UserMapper.fromEntity(loadedUser);
    }

    @Cacheable(value = "users", key = "#role")
    public List<UserResponse> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream().map(UserMapper::fromEntity).toList();
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(UUID id) {
        var loadedUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(loadedUser);
    }

}

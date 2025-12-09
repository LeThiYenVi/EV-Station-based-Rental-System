package com.project.evrental.service;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.common.UserRole;
import com.project.evrental.domain.dto.request.UpdateUserRequest;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.domain.entity.User;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.mapper.UserMapper;
import com.project.evrental.repository.BookingRepository;
import com.project.evrental.repository.StationRepository;
import com.project.evrental.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;
    StationRepository stationRepository;
    S3Service s3Service;
    BookingRepository bookingRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserMapper::fromEntity).toList();
    }

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

    public UserResponse createUser(User user) {
        return UserMapper.fromEntity(userRepository.save(user));
    }

    public UserResponse getUserById(UUID id) {
        var loadedUser = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + id)
        );
        return UserMapper.fromEntity(loadedUser);
    }

    public UserResponse getUserByIdWithStats(UUID id) {
        log.info("Fetching user with booking statistics: {}", id);
        var loadedUser = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + id)
        );

        Long totalBookings = bookingRepository.countByRenterId(id);
        Long completedBookings = bookingRepository.countByRenterIdAndStatus(id, BookingStatus.COMPLETED);
        Long activeBookings = bookingRepository.countByRenterIdAndStatus(id, BookingStatus.ONGOING);
        Long cancelledBookings = bookingRepository.countByRenterIdAndStatus(id, BookingStatus.CANCELLED);

        return UserMapper.fromEntityWithStats(loadedUser, totalBookings, completedBookings, activeBookings, cancelledBookings);
    }

    @Transactional
    public UserResponse verifyLicenceUserAccount(UUID id) {
        var loadedUser = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + id)
        );

        loadedUser.setIsLicenseVerified(true);
        loadedUser.setVerifiedAt(LocalDateTime.now());
        loadedUser = userRepository.save(loadedUser);
        return UserMapper.fromEntity(loadedUser);
    }

    @Transactional
    public UserResponse rejectLicenseVerification(UUID id) {
        log.info("Rejecting license verification for user: {}", id);
        var loadedUser = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + id)
        );

        loadedUser.setIsLicenseVerified(false);
        loadedUser.setVerifiedAt(null);
        loadedUser = userRepository.save(loadedUser);
        log.info("License verification rejected for user: {}", id);
        return UserMapper.fromEntity(loadedUser);
    }

    public List<UserResponse> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream().map(UserMapper::fromEntity).toList();
    }

    public List<UserResponse> getStaffByStation(UUID stationId) {
        return userRepository.findByStationIdAndRole(stationId, UserRole.STAFF)
                .stream().map(UserMapper::fromEntity).toList();
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(UUID id) {
        var loadedUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (loadedUser.getAvatarUrl() != null) {
            s3Service.deleteFile(loadedUser.getAvatarUrl());
        }
        if (loadedUser.getLicenseCardFrontImageUrl() != null) {
            s3Service.deleteFile(loadedUser.getLicenseCardFrontImageUrl());
        }
        if (loadedUser.getLicenseCardBackImageUrl() != null) {
            s3Service.deleteFile(loadedUser.getLicenseCardBackImageUrl());
        }

        userRepository.delete(loadedUser);
    }

    public Page<UserResponse> getAllUsersPaged(Pageable pageable) {
        log.info("Fetching users - Page: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findAll(pageable).map(UserMapper::fromEntity);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        log.info("Updating user: {}", id);
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getLicenseNumber() != null) {
            user.setLicenseNumber(request.getLicenseNumber());
        }
        if (request.getIdentityNumber() != null) {
            user.setIdentityNumber(request.getIdentityNumber());
        }
        if (request.getStationId() != null) {
            stationRepository.findById(request.getStationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + request.getStationId()));
            user.setStationId(request.getStationId());
        }

        return UserMapper.fromEntity(userRepository.save(user));
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse updateUserRole(UUID id, UserRole role) {
        log.info("Updating user role: {} to {}", id, role);
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setRole(role);
        return UserMapper.fromEntity(userRepository.save(user));
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse uploadAvatar(UUID id, MultipartFile file) {
        log.info("Uploading avatar for user: {}", id);
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String oldImageUrl = user.getAvatarUrl();
        String newImageUrl = s3Service.uploadFile(file, "assets/avatars");

        user.setAvatarUrl(newImageUrl);
        User savedUser = userRepository.save(user);
        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            try {
                s3Service.deleteFile(oldImageUrl);
            } catch (Exception e) {
                log.warn("Failed to delete old S3 file: {}. Error: {}", oldImageUrl, e.getMessage());
            }
        }
        return UserMapper.fromEntity(userRepository.save(user));
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse uploadLicenseCardFront(UUID id, MultipartFile file) {
        log.info("Uploading license card front for user: {}", id);
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));


        String oldImageUrl = user.getLicenseCardFrontImageUrl();
        String newImageUrl = s3Service.uploadFile(file, "assets/license-cards");

        user.setLicenseCardFrontImageUrl(newImageUrl);
        User savedUser = userRepository.save(user);
        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            try {
                s3Service.deleteFile(oldImageUrl);
            } catch (Exception e) {
                log.warn("Failed to delete old S3 file: {}. Error: {}", oldImageUrl, e.getMessage());
            }
        }

        return UserMapper.fromEntity(savedUser);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public UserResponse uploadLicenseCardBack(UUID id, MultipartFile file) {
        log.info("Uploading license card back for user: {}", id);
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String oldImageUrl = user.getLicenseCardBackImageUrl();
        String newImageUrl = s3Service.uploadFile(file, "assets/license-cards");

        user.setLicenseCardBackImageUrl(newImageUrl);
        User savedUser = userRepository.save(user);
        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            try {
                s3Service.deleteFile(oldImageUrl);
            } catch (Exception e) {
                log.warn("Failed to delete old S3 file: {}. Error: {}", oldImageUrl, e.getMessage());
            }
        }

        return UserMapper.fromEntity(savedUser);
    }

    public List<UserResponse> searchUsers(String keyword) {
        log.info("Searching users with keyword: {}", keyword);
        return userRepository.findAll().stream()
                .filter(u -> keyword == null ||
                        (u.getFullName() != null && u.getFullName().toLowerCase().contains(keyword.toLowerCase())) ||
                        (u.getEmail() != null && u.getEmail().toLowerCase().contains(keyword.toLowerCase())) ||
                        (u.getPhone() != null && u.getPhone().contains(keyword)) ||
                        (u.getLicenseNumber() != null && u.getLicenseNumber().toLowerCase().contains(keyword.toLowerCase())))
                .map(UserMapper::fromEntity)
                .toList();
    }

    public List<UserResponse> filterUsers(String name, String email, String phone, String role, Boolean verification) {
        log.info("Filtering users - name: {}, email: {}, phone: {}, role: {}, verification: {}", 
                 name, email, phone, role, verification);
        return userRepository.findAll().stream()
                .filter(u -> name == null || (u.getFullName() != null && u.getFullName().toLowerCase().contains(name.toLowerCase())))
                .filter(u -> email == null || (u.getEmail() != null && u.getEmail().toLowerCase().contains(email.toLowerCase())))
                .filter(u -> phone == null || (u.getPhone() != null && u.getPhone().contains(phone)))
                .filter(u -> role == null || (u.getRole() != null && u.getRole().name().equalsIgnoreCase(role)))
                .filter(u -> verification == null || u.getIsLicenseVerified().equals(verification))
                .map(UserMapper::fromEntity)
                .toList();
    }

    public long countUsersByRole(UserRole role) {
        log.info("Counting users by role: {}", role);
        return userRepository.countByRole(role);
    }

    public long countVerifiedUsers() {
        log.info("Counting verified users");
        return userRepository.countByIsLicenseVerified(true);
    }

    public long countUnverifiedUsers() {
        log.info("Counting unverified users");
        return userRepository.countByIsLicenseVerified(false);
    }

    public List<UserResponse> getUsersCreatedAfter(LocalDateTime date) {
        log.info("Fetching users created after: {}", date);
        return userRepository.findByCreatedAtAfter(date).stream()
                .map(UserMapper::fromEntity)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void attachStaffToStation(UUID staffId, UUID stationId) {
        log.info("Attaching staff {} to station {}", staffId, stationId);
        var staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + staffId));

        if (staff.getRole() != UserRole.STAFF) {
            throw new IllegalArgumentException("User is not a staff member");
        }

        stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + stationId));

        staff.setStationId(stationId);
        userRepository.save(staff);
    }

}

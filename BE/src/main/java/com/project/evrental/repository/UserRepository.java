package com.project.evrental.repository;

import com.project.evrental.domain.common.UserRole;
import com.project.evrental.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    Optional<User> findByCognitoSub(String cognitoSub);

    List<User> findByStationIdAndRole(UUID stationId, UserRole role);

    boolean existsByEmail(String email);

    // Count users by role
    long countByRole(UserRole role);

    // Count verified users
    long countByIsLicenseVerified(Boolean isVerified);

    // Find users created after a specific date
    List<User> findByCreatedAtAfter(LocalDateTime date);
}

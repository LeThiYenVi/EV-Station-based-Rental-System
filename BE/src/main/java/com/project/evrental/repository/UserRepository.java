package com.project.evrental.repository;

import com.project.evrental.domain.common.UserRole;
import com.project.evrental.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    Optional<User> findByCognitoSub(String cognitoSub);

    boolean existsByEmail(String email);
}

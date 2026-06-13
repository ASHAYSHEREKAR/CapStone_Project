package com.sts.auth.repository;

import com.sts.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User Repository
 * 
 * Provides database access methods for User entities.
 * Spring Data JPA auto-generates the implementation.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by email address (used for login)
     * @param email the user's email
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an email already exists (used during registration)
     * @param email the email to check
     * @return true if the email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find all users with a specific role (FR11: admin views users/engineers)
     * @param role the role to filter by
     * @return list of users with that role
     */
    List<User> findByRole(User.Role role);
}

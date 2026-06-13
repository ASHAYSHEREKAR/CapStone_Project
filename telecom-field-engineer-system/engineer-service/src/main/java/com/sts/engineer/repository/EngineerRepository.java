package com.sts.engineer.repository;

import com.sts.engineer.entity.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * Engineer Repository
 */
@Repository
public interface EngineerRepository extends JpaRepository<Engineer, Long> {

    Optional<Engineer> findByEmail(String email);

    boolean existsByEmail(String email);

    /** Find all available engineers (not on holiday, available flag true) */
    List<Engineer> findByIsAvailableTrue();
}

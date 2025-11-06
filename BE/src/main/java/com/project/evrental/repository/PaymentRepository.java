package com.project.evrental.repository;

import com.project.evrental.domain.common.PaymentStatus;
import com.project.evrental.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByBookingId(UUID bookingId);

    Optional<Payment> findByBooking_IdAndStatus(UUID bookingId, PaymentStatus status);
}

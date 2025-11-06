package com.project.evrental.repository;

import com.project.evrental.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByBookingId(UUID bookingId);

    @Query("SELECT p FROM Payment p WHERE p.booking.id = :bookingId AND p.status = 'PAID'")
    List<Payment> findPaidPaymentsByBooking(@Param("bookingId") UUID bookingId);

    Optional<Payment> findByTransactionId(String transactionId);
}

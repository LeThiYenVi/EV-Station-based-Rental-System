package com.project.evrental.service.staff;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.entity.Booking;
import com.project.evrental.domain.entity.User;
import com.project.evrental.repository.BookingRepository;
import com.project.evrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    /**
     * Staff confirms a booking for a user
     */
    public Booking confirmBooking(UUID bookingId, UUID staffId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING status");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCheckedOutBy(staff);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    /**
     * Staff verifies user's license
     */
    public User verifyUserLicense(UUID userId, UUID staffId, boolean approved) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (approved) {
            user.setIsLicenseVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
        } else {
            user.setIsLicenseVerified(false);
            user.setVerifiedAt(null);
        }

        return userRepository.save(user);
    }
}

package com.project.evrental.service;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.common.PaymentMethod;
import com.project.evrental.domain.common.PaymentStatus;
import com.project.evrental.domain.common.VehicleStatus;
import com.project.evrental.domain.dto.request.CreateBookingRequest;
import com.project.evrental.domain.dto.request.UpdateBookingRequest;
import com.project.evrental.domain.dto.response.BookingDetailResponse;
import com.project.evrental.domain.dto.response.BookingResponse;
import com.project.evrental.domain.dto.response.BookingWithPaymentResponse;
import com.project.evrental.domain.dto.response.MoMoPaymentResponse;
import com.project.evrental.domain.entity.Booking;
import com.project.evrental.domain.entity.Payment;
import com.project.evrental.domain.entity.Station;
import com.project.evrental.domain.entity.User;
import com.project.evrental.domain.entity.Vehicle;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.mapper.BookingMapper;
import com.project.evrental.repository.BookingRepository;
import com.project.evrental.repository.PaymentRepository;
import com.project.evrental.repository.StationRepository;
import com.project.evrental.repository.UserRepository;
import com.project.evrental.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {

    BookingRepository bookingRepository;
    VehicleRepository vehicleRepository;
    StationRepository stationRepository;
    UserRepository userRepository;
    PaymentRepository paymentRepository;
    BookingMapper bookingMapper;
    MoMoService moMoService;

    @Transactional
    public BookingWithPaymentResponse createBooking(CreateBookingRequest request) {
        log.info("Creating booking for vehicle: {}", request.getVehicleId());

        String email = getEmailFromAuthentication();
        User renter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (renter.getLicenseCardFrontImageUrl() == null || renter.getLicenseCardBackImageUrl() == null) {
            throw new IllegalStateException("You must upload both front and back of your driver's license before booking");
        }

        if (renter.getLicenseNumber() == null || renter.getLicenseNumber().trim().isEmpty()) {
            throw new IllegalStateException("License number is required before booking");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));

        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + request.getStationId()));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new IllegalStateException("Vehicle is not available for booking");
        }

        if (!vehicle.getStation().getId().equals(station.getId())) {
            throw new IllegalArgumentException("Vehicle does not belong to the specified station");
        }

        if (request.getStartTime().isAfter(request.getExpectedEndTime())) {
            throw new IllegalArgumentException("Start time must be before expected end time");
        }

        long hours = Duration.between(request.getStartTime(), request.getExpectedEndTime()).toHours();
        BigDecimal basePrice;
        if (hours <= 24) {
            basePrice = vehicle.getHourlyRate().multiply(BigDecimal.valueOf(hours));
        } else {
            long days = hours / 24;
            long remainingHours = hours % 24;
            basePrice = vehicle.getDailyRate().multiply(BigDecimal.valueOf(days))
                    .add(vehicle.getHourlyRate().multiply(BigDecimal.valueOf(remainingHours)));
        }

        BigDecimal depositAmount = vehicle.getDepositAmount();
        BigDecimal totalAmount = basePrice.add(depositAmount);

        String bookingCode = generateBookingCode();

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .renter(renter)
                .vehicle(vehicle)
                .station(station)
                .startTime(request.getStartTime())
                .expectedEndTime(request.getExpectedEndTime())
                .status(BookingStatus.PENDING)
                .checkedOutBy(renter)
                .basePrice(basePrice)
                .depositPaid(BigDecimal.ZERO)
                .totalAmount(totalAmount)
                .pickupNote(request.getPickupNote())
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with code: {}", bookingCode);

        Payment payment = Payment.builder()
                .booking(savedBooking)
                .amount(depositAmount)
                .paymentMethod(PaymentMethod.MOMO)
                .status(PaymentStatus.PENDING)
                .build();
        Payment savedPayment = paymentRepository.save(payment);

        MoMoPaymentResponse moMoResponse = moMoService.createPayment(
                savedBooking.getId(),
                depositAmount,
                "Thanh toan tien coc booking " + bookingCode,
                true
        );

        if ("0".equals(moMoResponse.getResultCode())) {
            savedPayment.setTransactionId(moMoResponse.getOrderId());
            paymentRepository.save(savedPayment);
            log.info("MoMo payment created successfully - orderId: {}", moMoResponse.getOrderId());
        } else {
            savedPayment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(savedPayment);
            log.error("MoMo payment creation failed - resultCode: {}, message: {}", 
                    moMoResponse.getResultCode(), moMoResponse.getMessage());
        }

        return BookingWithPaymentResponse.builder()
                .id(savedBooking.getId())
                .bookingCode(savedBooking.getBookingCode())
                .renterId(renter.getId())
                .renterName(renter.getFullName())
                .renterEmail(renter.getEmail())
                .vehicleId(vehicle.getId())
                .vehicleName(vehicle.getName())
                .licensePlate(vehicle.getLicensePlate())
                .stationId(station.getId())
                .stationName(station.getName())
                .startTime(savedBooking.getStartTime())
                .expectedEndTime(savedBooking.getExpectedEndTime())
                .status(savedBooking.getStatus().toString())
                .basePrice(savedBooking.getBasePrice())
                .depositPaid(savedBooking.getDepositPaid())
                .totalAmount(savedBooking.getTotalAmount())
                .pickupNote(savedBooking.getPickupNote())
                .paymentStatus(savedBooking.getPaymentStatus().toString())
                .momoPayment(moMoResponse)
                .createdAt(savedBooking.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public BookingDetailResponse getBookingDetailById(UUID bookingId) {
        log.info("Fetching booking detail with ID: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        return bookingMapper.toDetailResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingDetailResponse getBookingDetailByCode(String bookingCode) {
        log.info("Fetching booking detail with code: {}", bookingCode);
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with code: " + bookingCode));
        return bookingMapper.toDetailResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        log.info("Fetching all bookings with pagination");
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(bookingMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        log.info("Fetching bookings for current user");
        String email = getEmailFromAuthentication();
        User renter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        List<Booking> bookings = bookingRepository.findByRenterId(renter.getId());
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        log.info("Fetching bookings with status: {}", status);
        List<Booking> bookings = bookingRepository.findByStatus(status);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByVehicleId(UUID vehicleId) {
        log.info("Fetching bookings for vehicle: {}", vehicleId);
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId);
        }
        List<Booking> bookings = bookingRepository.findByVehicleId(vehicleId);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStationId(UUID stationId) {
        log.info("Fetching bookings for station: {}", stationId);
        if (!stationRepository.existsById(stationId)) {
            throw new ResourceNotFoundException("Station not found with ID: " + stationId);
        }
        List<Booking> bookings = bookingRepository.findByStationId(stationId);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse updateBooking(UUID bookingId, UpdateBookingRequest request) {
        log.info("Updating booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (request.getStartTime() != null) {
            booking.setStartTime(request.getStartTime());
        }
        if (request.getExpectedEndTime() != null) {
            booking.setExpectedEndTime(request.getExpectedEndTime());
        }
        if (request.getActualEndTime() != null) {
            booking.setActualEndTime(request.getActualEndTime());
        }
        if (request.getStatus() != null) {
            booking.setStatus(request.getStatus());
        }
        if (request.getExtraFee() != null) {
            booking.setExtraFee(request.getExtraFee());
            BigDecimal newTotal = booking.getBasePrice().add(booking.getDepositPaid()).add(request.getExtraFee());
            booking.setTotalAmount(newTotal);
        }
        if (request.getPickupNote() != null) {
            booking.setPickupNote(request.getPickupNote());
        }
        if (request.getReturnNote() != null) {
            booking.setReturnNote(request.getReturnNote());
        }

        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking updated successfully: {}", bookingId);

        return bookingMapper.toResponse(updatedBooking);
    }

    @Transactional
    public BookingResponse confirmBooking(UUID bookingId) {
        log.info("Confirming booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be confirmed");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking confirmedBooking = bookingRepository.save(booking);
        log.info("Booking confirmed successfully: {}", bookingId);

        return bookingMapper.toResponse(confirmedBooking);
    }

    @Transactional
    public BookingResponse startBooking(UUID bookingId) {
        log.info("Starting booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Only confirmed bookings can be started");
        }

        booking.setStatus(BookingStatus.ONGOING);
        booking.getVehicle().setStatus(VehicleStatus.RENTED);
        vehicleRepository.save(booking.getVehicle());

        Booking startedBooking = bookingRepository.save(booking);
        log.info("Booking started successfully: {}", bookingId);

        return bookingMapper.toResponse(startedBooking);
    }

    @Transactional
    public BookingWithPaymentResponse completeBooking(UUID bookingId) {
        log.info("Completing booking: {}", bookingId);

        String email = getEmailFromAuthentication();
        User staff = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.ONGOING) {
            throw new IllegalStateException("Only ongoing bookings can be completed");
        }

        LocalDateTime actualEndTime = LocalDateTime.now();
        BigDecimal lateFee = BigDecimal.ZERO;

        if (actualEndTime.isAfter(booking.getExpectedEndTime())) {
            long lateHours = Duration.between(booking.getExpectedEndTime(), actualEndTime).toHours();
            if (lateHours > 0) {
                Vehicle vehicle = booking.getVehicle();
                lateFee = vehicle.getHourlyRate().multiply(BigDecimal.valueOf(lateHours)).multiply(BigDecimal.valueOf(1.5));
                log.warn("Late return detected - booking: {}, late hours: {}, late fee: {}", 
                        booking.getBookingCode(), lateHours, lateFee);
            }
        }

        BigDecimal remainingAmount = booking.getBasePrice();
        if (booking.getExtraFee() != null && booking.getExtraFee().compareTo(BigDecimal.ZERO) > 0) {
            remainingAmount = remainingAmount.add(booking.getExtraFee());
        }
        if (lateFee.compareTo(BigDecimal.ZERO) > 0) {
            remainingAmount = remainingAmount.add(lateFee);
            BigDecimal currentExtraFee = booking.getExtraFee() != null ? booking.getExtraFee() : BigDecimal.ZERO;
            booking.setExtraFee(currentExtraFee.add(lateFee));
            BigDecimal newTotal = booking.getBasePrice().add(booking.getDepositPaid()).add(booking.getExtraFee());
            booking.setTotalAmount(newTotal);
            log.info("Late fee added to booking - booking: {}, late fee: {}, new total: {}", 
                    booking.getBookingCode(), lateFee, newTotal);
        }

        Payment remainingPayment = Payment.builder()
                .booking(booking)
                .amount(remainingAmount)
                .paymentMethod(PaymentMethod.MOMO)
                .status(PaymentStatus.PENDING)
                .processedBy(staff.getId())
                .build();
        Payment savedRemainingPayment = paymentRepository.save(remainingPayment);

        MoMoPaymentResponse moMoResponse = moMoService.createPayment(
                booking.getId(),
                remainingAmount,
                "Thanh toan con lai booking " + booking.getBookingCode(),
                false
        );

        if ("0".equals(moMoResponse.getResultCode())) {
            savedRemainingPayment.setTransactionId(moMoResponse.getOrderId());
            paymentRepository.save(savedRemainingPayment);
            log.info("MoMo payment for remaining amount created successfully - orderId: {}", moMoResponse.getOrderId());
        } else {
            savedRemainingPayment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(savedRemainingPayment);
            log.error("MoMo payment creation failed - resultCode: {}, message: {}", 
                    moMoResponse.getResultCode(), moMoResponse.getMessage());
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setActualEndTime(actualEndTime);
        booking.setCheckedInBy(staff);

        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setRentCount(vehicle.getRentCount() + 1);
        vehicleRepository.save(vehicle);

        Booking completedBooking = bookingRepository.save(booking);
        log.info("Booking completed successfully: {}, remaining payment created: {}", bookingId, remainingAmount);

        return BookingWithPaymentResponse.builder()
                .id(completedBooking.getId())
                .bookingCode(completedBooking.getBookingCode())
                .renterId(completedBooking.getRenter().getId())
                .renterName(completedBooking.getRenter().getFullName())
                .renterEmail(completedBooking.getRenter().getEmail())
                .vehicleId(vehicle.getId())
                .vehicleName(vehicle.getName())
                .licensePlate(vehicle.getLicensePlate())
                .stationId(completedBooking.getStation().getId())
                .stationName(completedBooking.getStation().getName())
                .startTime(completedBooking.getStartTime())
                .expectedEndTime(completedBooking.getExpectedEndTime())
                .status(completedBooking.getStatus().toString())
                .basePrice(completedBooking.getBasePrice())
                .depositPaid(completedBooking.getDepositPaid())
                .totalAmount(completedBooking.getTotalAmount())
                .pickupNote(completedBooking.getPickupNote())
                .paymentStatus(completedBooking.getPaymentStatus().toString())
                .momoPayment(moMoResponse)
                .createdAt(completedBooking.getCreatedAt())
                .build();
    }

    @Transactional
    public BookingResponse cancelBooking(UUID bookingId) {
        log.info("Cancelling booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Completed bookings cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        if (booking.getVehicle().getStatus() == VehicleStatus.RENTED) {
            booking.getVehicle().setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(booking.getVehicle());
        }

        Booking cancelledBooking = bookingRepository.save(booking);
        log.info("Booking cancelled successfully: {}", bookingId);

        return bookingMapper.toResponse(cancelledBooking);
    }

    @Transactional
    public void deleteBooking(UUID bookingId) {
        log.info("Deleting booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getVehicle().getStatus() == VehicleStatus.RENTED) {
            booking.getVehicle().setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(booking.getVehicle());
        }

        bookingRepository.delete(booking);
        log.info("Booking deleted successfully: {}", bookingId);
    }

    private String generateBookingCode() {
        return "BK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private String getEmailFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            String sub = jwt.getClaimAsString("sub");
            if (sub != null) {
                log.debug("Using sub claim as cognito_sub: {}", sub);
                User user = userRepository.findByCognitoSub(sub).orElse(null);
                if (user != null) {
                    return user.getEmail();
                }
            }
        }
        return authentication != null ? authentication.getName() : null;
    }

    public MoMoPaymentResponse payRemainder(UUID bookingId) {
        log.info("Processing remainder payment for booking: {}", bookingId);
        String email = getEmailFromAuthentication();
        if (email == null || email.isBlank()) {
            throw new IllegalStateException("Unauthenticated user");
        }

        User renter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        // Ensure the booking belongs to the current renter
        if (!booking.getRenter().getId().equals(renter.getId())) {
            throw new IllegalStateException("You are not authorized to pay for this booking");
        }

        // Only allow payment when booking is COMPLETED
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalStateException("Remainder payment is only available for completed bookings");
        }
        BigDecimal totalCharge = booking.getBasePrice();
        LocalDateTime actualEndTime = LocalDateTime.now();
        BigDecimal lateFee = BigDecimal.ZERO;

        if (actualEndTime.isAfter(booking.getExpectedEndTime())) {
            long lateHours = Duration.between(booking.getExpectedEndTime(), actualEndTime).toHours();
            if (lateHours > 0) {
                Vehicle vehicle = booking.getVehicle();
                lateFee = vehicle.getHourlyRate().multiply(BigDecimal.valueOf(lateHours)).multiply(BigDecimal.valueOf(1.5));
                log.warn("Late return detected - booking: {}, late hours: {}, late fee: {}",
                        booking.getBookingCode(), lateHours, lateFee);
            }
            totalCharge=totalCharge.add(lateFee);
        }

        BigDecimal depositPaid = booking.getDepositPaid() != null ? booking.getDepositPaid() : BigDecimal.ZERO;
        BigDecimal netSettlementAmount = totalCharge.subtract(depositPaid);

            log.info("Khách hàng CÒN NỢ: {}", netSettlementAmount);

            // Create a Payment record for the remainder, consistent with completeBooking
            Payment remainingPayment = Payment.builder()
                    .booking(booking)
                    .amount(netSettlementAmount)
                    .paymentMethod(PaymentMethod.MOMO)
                    .status(PaymentStatus.PENDING)
                    .processedBy(renter.getId())
                    .build();
            Payment savedPayment = paymentRepository.save(remainingPayment);

            MoMoPaymentResponse moMoResponse = moMoService.createPayment(
                    booking.getId(),
                    netSettlementAmount,
                    "Thanh toán phần còn lại booking " + booking.getBookingCode(),
                    false
            );

            if ("0".equals(moMoResponse.getResultCode())) {
                savedPayment.setTransactionId(moMoResponse.getOrderId());
                paymentRepository.save(savedPayment);
                log.info("MoMo remainder payment created successfully - orderId: {}", moMoResponse.getOrderId());
            } else {
                savedPayment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(savedPayment);
                log.error("MoMo remainder payment creation failed - resultCode: {}, message: {}",
                        moMoResponse.getResultCode(), moMoResponse.getMessage());
            }
            return moMoResponse;
    }
}

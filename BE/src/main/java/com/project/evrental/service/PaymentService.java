    package com.project.evrental.service;

import com.project.evrental.domain.common.PaymentStatus;
import com.project.evrental.domain.dto.request.MoMoCallbackRequest;
import com.project.evrental.domain.dto.response.PaymentResponse;
import com.project.evrental.domain.entity.Booking;
import com.project.evrental.domain.entity.Payment;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.repository.BookingRepository;
import com.project.evrental.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {

    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    MoMoService moMoService;

    @Transactional
    public void processMoMoCallback(MoMoCallbackRequest callback) {
        System.out.println("Received MoMo callback: ");
        log.info("Processing MoMo callback - orderId: {}, resultCode: {}, extraData: {}", 
                callback.getOrderId(), callback.getResultCode(), callback.getExtraData());

        if (!moMoService.verifySignature(callback)) {
            log.error("Invalid MoMo callback signature - orderId: {}", callback.getOrderId());
            throw new RuntimeException("Invalid signature");
        }
        
        boolean isDeposit = "true".equalsIgnoreCase(callback.getExtraData());
        Payment payment = paymentRepository.findByTransactionId(callback.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with transaction ID: " + callback.getOrderId()));

        if ("0".equals(callback.getResultCode())) {
            Booking booking = payment.getBooking();
            if(isDeposit) {
                payment.setStatus(PaymentStatus.PARTIALLY_PAID);
                payment.setPaidAt(LocalDateTime.now());
                booking.setDepositPaid(payment.getAmount());
                booking.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);

                log.info("Deposit payment successful - booking: {}, amount: {}", 
                        booking.getBookingCode(), payment.getAmount());
            } else {
                payment.setStatus(PaymentStatus.PAID);
                payment.setPaidAt(LocalDateTime.now());
                booking.setPaymentStatus(PaymentStatus.PAID);
                
                log.info("Remaining payment successful - booking: {}, amount: {}", 
                        booking.getBookingCode(), payment.getAmount());
            }

            bookingRepository.save(booking);
            log.info("Payment successful - orderId: {}, transId: {}, isDeposit: {}", 
                    callback.getOrderId(), callback.getTransId(), isDeposit);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            log.warn("Payment failed - orderId: {}, resultCode: {}, message: {}", 
                    callback.getOrderId(), callback.getResultCode(), callback.getMessage());
        }

        paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(UUID paymentId) {
        log.info("Fetching payment with ID: {}", paymentId);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        return toPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByBookingId(UUID bookingId) {
        log.info("Fetching payments for booking: {}", bookingId);
        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        return payments.stream()
                .map(this::toPaymentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByTransactionId(String transactionId) {
        log.info("Fetching payment with transaction ID: {}", transactionId);
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with transaction ID: " + transactionId));
        return toPaymentResponse(payment);
    }

    private PaymentResponse toPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking() != null ? payment.getBooking().getId() : null)
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod() != null ? payment.getPaymentMethod().toString() : null)
                .status(payment.getStatus() != null ? payment.getStatus().toString() : null)
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}

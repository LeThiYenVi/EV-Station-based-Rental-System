package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.FeedbackDetailResponse;
import com.project.evrental.domain.dto.response.FeedbackResponse;
import com.project.evrental.domain.entity.Feedback;
import com.project.evrental.domain.entity.User;

public class FeedbackMapper {

    public static FeedbackResponse toResponse(Feedback feedback) {
        if (feedback == null) {
            return null;
        }

        User respondedByUser = null;
        if (feedback.getRespondedBy() != null) {
            // This will be fetched in service layer if needed
        }

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .bookingId(feedback.getBooking() != null ? feedback.getBooking().getId() : null)
                .bookingCode(feedback.getBooking() != null ? feedback.getBooking().getBookingCode() : null)
                .renterId(feedback.getRenter() != null ? feedback.getRenter().getId() : null)
                .renterName(feedback.getRenter() != null ? feedback.getRenter().getFullName() : null)
                .renterEmail(feedback.getRenter() != null ? feedback.getRenter().getEmail() : null)
                .vehicleId(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                          feedback.getBooking().getVehicle().getId() : null)
                .vehicleName(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                            feedback.getBooking().getVehicle().getName() : null)
                .vehicleLicensePlate(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                                    feedback.getBooking().getVehicle().getLicensePlate() : null)
                .stationId(feedback.getBooking() != null && feedback.getBooking().getStation() != null ? 
                          feedback.getBooking().getStation().getId() : null)
                .stationName(feedback.getBooking() != null && feedback.getBooking().getStation() != null ? 
                            feedback.getBooking().getStation().getName() : null)
                .vehicleRating(feedback.getVehicleRating())
                .stationRating(feedback.getStationRating())
                .comment(feedback.getComment())
                .isEdit(feedback.getIsEdit())
                .response(feedback.getResponse())
                .respondedBy(feedback.getRespondedBy())
                .respondedAt(feedback.getRespondedAt())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }

    public static FeedbackDetailResponse toDetailResponse(Feedback feedback, User respondedByUser) {
        if (feedback == null) {
            return null;
        }

        return FeedbackDetailResponse.builder()
                .id(feedback.getId())
                // Booking information
                .bookingId(feedback.getBooking() != null ? feedback.getBooking().getId() : null)
                .bookingCode(feedback.getBooking() != null ? feedback.getBooking().getBookingCode() : null)
                .bookingStartTime(feedback.getBooking() != null ? feedback.getBooking().getStartTime() : null)
                .bookingEndTime(feedback.getBooking() != null ? feedback.getBooking().getActualEndTime() : null)
                .bookingTotalAmount(feedback.getBooking() != null ? feedback.getBooking().getTotalAmount() : null)
                // Renter information
                .renterId(feedback.getRenter() != null ? feedback.getRenter().getId() : null)
                .renterName(feedback.getRenter() != null ? feedback.getRenter().getFullName() : null)
                .renterEmail(feedback.getRenter() != null ? feedback.getRenter().getEmail() : null)
                .renterPhone(feedback.getRenter() != null ? feedback.getRenter().getPhone() : null)
                // Vehicle information
                .vehicleId(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                          feedback.getBooking().getVehicle().getId() : null)
                .vehicleName(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                            feedback.getBooking().getVehicle().getName() : null)
                .vehicleLicensePlate(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                                    feedback.getBooking().getVehicle().getLicensePlate() : null)
                .vehicleBrand(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                             feedback.getBooking().getVehicle().getBrand() : null)
                .vehiclePhotos(feedback.getBooking() != null && feedback.getBooking().getVehicle() != null ? 
                              feedback.getBooking().getVehicle().getPhotos() : null)
                // Station information
                .stationId(feedback.getBooking() != null && feedback.getBooking().getStation() != null ? 
                          feedback.getBooking().getStation().getId() : null)
                .stationName(feedback.getBooking() != null && feedback.getBooking().getStation() != null ? 
                            feedback.getBooking().getStation().getName() : null)
                .stationAddress(feedback.getBooking() != null && feedback.getBooking().getStation() != null ? 
                               feedback.getBooking().getStation().getAddress() : null)
                // Feedback content
                .vehicleRating(feedback.getVehicleRating())
                .stationRating(feedback.getStationRating())
                .comment(feedback.getComment())
                .isEdit(feedback.getIsEdit())
                // Response information
                .response(feedback.getResponse())
                .respondedBy(feedback.getRespondedBy())
                .respondedByName(respondedByUser != null ? respondedByUser.getFullName() : null)
                .respondedByEmail(respondedByUser != null ? respondedByUser.getEmail() : null)
                .respondedAt(feedback.getRespondedAt())
                // Metadata
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}

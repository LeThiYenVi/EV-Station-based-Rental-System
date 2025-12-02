package com.project.evrental.service.admin;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.common.FuelType;
import com.project.evrental.domain.common.UserRole;
import com.project.evrental.domain.common.VehicleStatus;
import com.project.evrental.domain.dto.response.*;
import com.project.evrental.domain.dto.response.admin.*;
import com.project.evrental.domain.entity.Booking;
import com.project.evrental.domain.entity.User;
import com.project.evrental.domain.entity.Vehicle;
import com.project.evrental.mapper.UserMapper;
import com.project.evrental.mapper.VehicleMapper;
import com.project.evrental.repository.BookingRepository;
import com.project.evrental.repository.PaymentRepository;
import com.project.evrental.repository.UserRepository;
import com.project.evrental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserMapper userMapper;
    private final VehicleMapper vehicleMapper;

    // ==================== Dashboard Summary ====================
    public AdminDashboardSummaryResponse getDashboardSummary() {
        return AdminDashboardSummaryResponse.builder()
                .userReport(getUserReport())
                .vehicleReport(getVehicleReport())
                .bookingReport(getBookingReport())
                .revenueReport(getRevenueReport())
                .build();
    }

    private UserReportAdminDashboardSummary getUserReport() {
        long countAll = userRepository.count();
        long countAdmin = userRepository.countByRole(UserRole.ADMIN);
        long countStaff = userRepository.countByRole(UserRole.STAFF);
        long countCustomer = userRepository.countByRole(UserRole.RENTER);

        LocalDateTime monthAgo = LocalDateTime.now().minusMonths(1);
        long countThisMonth = userRepository.findByCreatedAtAfter(monthAgo).size();

        double radiation = (countAll - countThisMonth) > 0
                ? ((double) countThisMonth / (countAll - countThisMonth)) * 100
                : 0;

        return UserReportAdminDashboardSummary.builder()
                .countAllUser(countAll)
                .countAdmin(countAdmin)
                .countStaff(countStaff)
                .countCustomer(countCustomer)
                .radiationWithMonthAgo(radiation)
                .build();
    }

    private VehicleReportAdminDashboardSummary getVehicleReport() {
        long countAll = vehicleRepository.count();
        long countAvailable = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long countRented = vehicleRepository.countByStatus(VehicleStatus.RENTED);

        LocalDateTime monthAgo = LocalDateTime.now().minusMonths(1);
        long countThisMonth = vehicleRepository.findByCreatedAtAfter(monthAgo).size();

        double fleetGrowth = (countAll - countThisMonth) > 0
                ? ((double) countThisMonth / (countAll - countThisMonth)) * 100
                : 0;

        return VehicleReportAdminDashboardSummary.builder()
                .countAllVehicles(countAll)
                .countVehicleAvailable(countAvailable)
                .countRentedAvailable(countRented)
                .fleetGrowth(fleetGrowth)
                .build();
    }

    private BookingReportAdminDashboardSummary getBookingReport() {
        long countAll = bookingRepository.count();
        long countToday = bookingRepository.countBookingsToday();

        LocalDateTime now = LocalDateTime.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();
        long countThisMonth = bookingRepository.countBookingsByYearAndMonth(currentYear, currentMonth);

        int lastMonthValue = currentMonth == 1 ? 12 : currentMonth - 1;
        int lastMonthYear = currentMonth == 1 ? currentYear - 1 : currentYear;
        long countLastMonth = bookingRepository.countBookingsByYearAndMonth(lastMonthYear, lastMonthValue);

        double radiation = countLastMonth > 0
                ? ((double) (countThisMonth - countLastMonth) / countLastMonth) * 100
                : 0;

        return BookingReportAdminDashboardSummary.builder()
                .countAllBookings(countAll)
                .countBookingsToday(countToday)
                .countThisMonth(countThisMonth)
                .radiationWithMonthAgo(radiation)
                .build();
    }

    private RevenueReportAdminDashboardSummary getRevenueReport() {
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);

        BigDecimal totalRevenue = completedBookings.stream()
                .map(Booking::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate today = LocalDate.now();
        BigDecimal totalToday = completedBookings.stream()
                .filter(b -> b.getActualEndTime() != null && b.getActualEndTime().toLocalDate().equals(today))
                .map(Booking::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        YearMonth thisMonth = YearMonth.now();
        BigDecimal totalThisMonth = completedBookings.stream()
                .filter(b -> b.getActualEndTime() != null && YearMonth.from(b.getActualEndTime()).equals(thisMonth))
                .map(Booking::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        YearMonth lastMonth = thisMonth.minusMonths(1);
        BigDecimal totalLastMonth = completedBookings.stream()
                .filter(b -> b.getActualEndTime() != null && YearMonth.from(b.getActualEndTime()).equals(lastMonth))
                .map(Booking::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double radiation = totalLastMonth.compareTo(BigDecimal.ZERO) > 0
                ? totalThisMonth.subtract(totalLastMonth)
                .divide(totalLastMonth, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue()
                : 0;

        return RevenueReportAdminDashboardSummary.builder()
                .totalRevenue(totalRevenue)
                .totalToday(totalToday)
                .totalThisMonth(totalThisMonth)
                .radiationWithMonthAgo(radiation)
                .build();
    }

    // ==================== Revenue Chart ====================
    public List<RevenueAndBookingInChartResponse> getRevenueAndBookingChart() {
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);
        List<YearMonth> last12Months = new ArrayList<>();
        
        for (int i = 11; i >= 0; i--) {
            last12Months.add(YearMonth.now().minusMonths(i));
        }

        return last12Months.stream()
                .map(month -> {
                    BigDecimal revenue = completedBookings.stream()
                            .filter(b -> b.getActualEndTime() != null && YearMonth.from(b.getActualEndTime()).equals(month))
                            .map(Booking::getTotalAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    long count = completedBookings.stream()
                            .filter(b -> b.getActualEndTime() != null && YearMonth.from(b.getActualEndTime()).equals(month))
                            .count();

                    return RevenueAndBookingInChartResponse.builder()
                            .month(month.toString())
                            .revenue(revenue)
                            .countBookingByMonth(count)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ==================== Vehicle Status ====================
    public VehicleStatusDistributionResponse getVehicleStatusDistribution() {
        long countAvailable = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long countMaintenance = vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE);
        long countRented = vehicleRepository.countByStatus(VehicleStatus.RENTED);
        long countUnavailable = vehicleRepository.countByStatus(VehicleStatus.UNAVAILABLE);
        long countCharging = vehicleRepository.countByStatus(VehicleStatus.CHARGING);

        return VehicleStatusDistributionResponse.builder()
                .countAvailable(countAvailable)
                .countMaintenance(countMaintenance)
                .countRented(countRented)
                .countUnavailable(countUnavailable)
                .countCharging(countCharging)
                .build();
    }

    // ==================== Booking by Type ====================
    public List<BookingByTypeResponse> getBookingByType() {
        List<Booking> allBookings = bookingRepository.findAll();

        Map<FuelType, List<Booking>> bookingsByType = allBookings.stream()
                .filter(b -> b.getVehicle() != null && b.getVehicle().getFuelType() != null)
                .collect(Collectors.groupingBy(b -> b.getVehicle().getFuelType()));

        return bookingsByType.entrySet().stream()
                .map(entry -> {
                    BigDecimal total = entry.getValue().stream()
                            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                            .map(Booking::getTotalAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return BookingByTypeResponse.builder()
                            .type(entry.getKey().name())
                            .countBookings(entry.getValue().size())
                            .totalByBookingType(total)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ==================== New Bookings ====================
    public List<NewBookingResponse> getNewBookings() {
        return bookingRepository.findAll().stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
                .limit(5)
                .map(booking -> NewBookingResponse.builder()
                        .bookingId(booking.getId())
                        .fullName(booking.getRenter() != null ? booking.getRenter().getFullName() : "Unknown")
                        .vehicleName(booking.getVehicle() != null ? booking.getVehicle().getName() : "Unknown")
                        .timeAgo(calculateTimeAgo(booking.getCreatedAt()))
                        .build())
                .collect(Collectors.toList());
    }

    private String calculateTimeAgo(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        long hours = ChronoUnit.HOURS.between(dateTime, now);
        long days = ChronoUnit.DAYS.between(dateTime, now);

        if (minutes < 60) return minutes + " phút trước";
        else if (hours < 24) return hours + " giờ trước";
        else return days + " ngày trước";
    }

    // ==================== Booking Performance ====================
    public BookingPerformanceResponse getBookingPerformance() {
        long totalBookings = bookingRepository.count();
        long totalCompleted = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long totalOnGoing = bookingRepository.countByStatus(BookingStatus.ONGOING);
        long totalActive = bookingRepository.countByStatusIn(
                Arrays.asList(BookingStatus.CONFIRMED, BookingStatus.ONGOING)
        );

        double successRate = totalBookings > 0 ? ((double) totalCompleted / totalBookings) * 100 : 0;

        return BookingPerformanceResponse.builder()
                .totalCompleted(totalCompleted)
                .totalOnGoing(totalOnGoing)
                .totalActive(totalActive)
                .successRate(successRate)
                .build();
    }

    // ==================== Maintenance Overview ====================
    public MaintenanceOverviewResponse getMaintenanceOverview() {
        return MaintenanceOverviewResponse.builder()
                .totalInMaintenance(vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE))
                .totalUnavailable(vehicleRepository.countByStatus(VehicleStatus.UNAVAILABLE))
                .totalCharging(vehicleRepository.countByStatus(VehicleStatus.CHARGING))
                .build();
    }

    // ==================== User Management ====================
    public MetricUserManagementResponse getMetricUserManagement() {
        long totalUsers = userRepository.count();
        long totalVerified = userRepository.countByIsLicenseVerified(true);
        
        return MetricUserManagementResponse.builder()
                .totalUser(totalUsers)
                .totalVerifiedUser(totalVerified)
                .totalBlockedUser(0)
                .build();
    }

    public List<UserResponse> filterUsers(String name, String email, String phone, String role, Boolean verification) {
        return userRepository.findAll().stream()
                .filter(u -> name == null || (u.getFullName() != null && u.getFullName().toLowerCase().contains(name.toLowerCase())))
                .filter(u -> email == null || (u.getEmail() != null && u.getEmail().toLowerCase().contains(email.toLowerCase())))
                .filter(u -> phone == null || (u.getPhone() != null && u.getPhone().contains(phone)))
                .filter(u -> role == null || (u.getRole() != null && u.getRole().name().equalsIgnoreCase(role)))
                .filter(u -> verification == null || u.getIsLicenseVerified().equals(verification))
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersTable() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ==================== Vehicle Management ====================
    public MetricVehicleManagementResponse getMetricVehicleManagement() {
        long totalVehicles = vehicleRepository.count();
        long totalAvailable = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long totalMaintenance = vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE);
        
        // Count vehicles in ongoing bookings
        long totalOnGoing = bookingRepository.findByStatus(BookingStatus.ONGOING).stream()
                .map(Booking::getVehicle)
                .filter(Objects::nonNull)
                .map(Vehicle::getId)
                .distinct()
                .count();

        return MetricVehicleManagementResponse.builder()
                .totalVehicles(totalVehicles)
                .totalAvailable(totalAvailable)
                .totalOnGoing(totalOnGoing)
                .totalMaintenance(totalMaintenance)
                .build();
    }

    public List<VehicleResponse> searchVehicles(String keyword) {
        return vehicleRepository.findAll().stream()
                .filter(v -> keyword == null ||
                        (v.getName() != null && v.getName().toLowerCase().contains(keyword.toLowerCase())) ||
                        (v.getLicensePlate() != null && v.getLicensePlate().toLowerCase().contains(keyword.toLowerCase())) ||
                        (v.getBrand() != null && v.getBrand().toLowerCase().contains(keyword.toLowerCase())))
                .map(x -> VehicleMapper.toResponse(x))
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> filterVehicles(String name, String status, String type, Integer capacity) {
        return vehicleRepository.findAll().stream()
                .filter(v -> name == null || (v.getName() != null && v.getName().toLowerCase().contains(name.toLowerCase())))
                .filter(v -> status == null || (v.getStatus() != null && v.getStatus().name().equalsIgnoreCase(status)))
                .filter(v -> type == null || (v.getFuelType() != null && v.getFuelType().name().equalsIgnoreCase(type)))
                .filter(v -> capacity == null || (v.getCapacity() != null && v.getCapacity().equals(capacity)))
                .map(x -> VehicleMapper.toResponse(x))
                .collect(Collectors.toList());
    }

    // ==================== Booking Management ====================
    public MetricBookingDashboardResponse getMetricBookingDashboard() {
        long totalBookings = bookingRepository.count();
        long totalConfirm = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long totalOnGoing = bookingRepository.countByStatus(BookingStatus.ONGOING);
        
        BigDecimal totalRevenue = bookingRepository.findByStatus(BookingStatus.COMPLETED).stream()
                .map(Booking::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return MetricBookingDashboardResponse.builder()
                .totalBooking(totalBookings)
                .totalRevenueFromCompletedBooking(totalRevenue)
                .totalConfirmBooking(totalConfirm)
                .totalOnGoingBooking(totalOnGoing)
                .build();
    }

    public List<BookingResponse> getBookingsTable() {
        return bookingRepository.findAll().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .renterId(booking.getRenter() != null ? booking.getRenter().getId() : null)
                .renterName(booking.getRenter() != null ? booking.getRenter().getFullName() : null)
                .renterEmail(booking.getRenter() != null ? booking.getRenter().getEmail() : null)
                .vehicleId(booking.getVehicle() != null ? booking.getVehicle().getId() : null)
                .vehicleName(booking.getVehicle() != null ? booking.getVehicle().getName() : null)
                .licensePlate(booking.getVehicle() != null ? booking.getVehicle().getLicensePlate() : null)
                .stationId(booking.getStation() != null ? booking.getStation().getId() : null)
                .stationName(booking.getStation() != null ? booking.getStation().getName() : null)
                .startTime(booking.getStartTime())
                .expectedEndTime(booking.getExpectedEndTime())
                .actualEndTime(booking.getActualEndTime())
                .status(booking.getStatus() != null ? booking.getStatus().name() : null)
                .checkedOutById(booking.getCheckedOutBy() != null ? booking.getCheckedOutBy().getId() : null)
                .checkedOutByName(booking.getCheckedOutBy() != null ? booking.getCheckedOutBy().getFullName() : null)
                .checkedInById(booking.getCheckedInBy() != null ? booking.getCheckedInBy().getId() : null)
                .checkedInByName(booking.getCheckedInBy() != null ? booking.getCheckedInBy().getFullName() : null)
                .basePrice(booking.getBasePrice())
                .depositPaid(booking.getDepositPaid())
                .extraFee(booking.getExtraFee())
                .totalAmount(booking.getTotalAmount())
                .paymentStatus(booking.getPaymentStatus() != null ? booking.getPaymentStatus().name() : null)
                .pickupNote(booking.getPickupNote())
                .returnNote(booking.getReturnNote())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    // ==================== Revenue Analysis ====================
    public YearlyRevenueComparisonResponse getYearlyRevenueComparison() {
        int currentYear = LocalDate.now().getYear();
        int lastYear = currentYear - 1;
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);

        List<MonthlyRevenueDetail> thisYearMonthly = getMonthlyRevenue(completedBookings, currentYear);
        List<MonthlyRevenueDetail> lastYearMonthly = getMonthlyRevenue(completedBookings, lastYear);

        BigDecimal totalThisYear = thisYearMonthly.stream()
                .map(MonthlyRevenueDetail::getRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalLastYear = lastYearMonthly.stream()
                .map(MonthlyRevenueDetail::getRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double growth = totalLastYear.compareTo(BigDecimal.ZERO) > 0
                ? totalThisYear.subtract(totalLastYear)
                .divide(totalLastYear, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue()
                : 0;

        return YearlyRevenueComparisonResponse.builder()
                .totalRevenueThisYear(totalThisYear)
                .monthlyRevenueThisYear(thisYearMonthly)
                .totalRevenueLastYear(totalLastYear)
                .monthlyRevenueLastYear(lastYearMonthly)
                .growthPercentage(growth)
                .build();
    }

    private List<MonthlyRevenueDetail> getMonthlyRevenue(List<Booking> completedBookings, int year) {
        List<MonthlyRevenueDetail> result = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            int finalMonth = month;
            BigDecimal monthRevenue = completedBookings.stream()
                    .filter(b -> b.getActualEndTime() != null &&
                            b.getActualEndTime().getYear() == year &&
                            b.getActualEndTime().getMonthValue() == finalMonth)
                    .map(Booking::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            result.add(MonthlyRevenueDetail.builder()
                    .month(month)
                    .revenue(monthRevenue)
                    .build());
        }
        return result;
    }

    public List<RevenueByYearResponse> getRevenueByYear(Integer numberOfYears) {
        int currentYear = LocalDate.now().getYear();
        int years = numberOfYears != null ? numberOfYears : 5;
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);

        List<RevenueByYearResponse> result = new ArrayList<>();
        for (int i = 0; i < years; i++) {
            int year = currentYear - i;
            BigDecimal yearRevenue = completedBookings.stream()
                    .filter(b -> b.getActualEndTime() != null && b.getActualEndTime().getYear() == year)
                    .map(Booking::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            result.add(RevenueByYearResponse.builder()
                    .year(year)
                    .totalRevenue(yearRevenue)
                    .build());
        }
        return result;
    }

    public DetailRevenueResponse getDetailRevenue() {
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);

        BigDecimal revenueFromRental = completedBookings.stream()
                .map(Booking::getBasePrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal revenueFromExtraFee = completedBookings.stream()
                .map(Booking::getExtraFee)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DetailRevenueResponse.builder()
                .revenueFromRental(revenueFromRental)
                .revenueFromExtraFee(revenueFromExtraFee)
                .build();
    }

    // ==================== Top Performers ====================
    public List<TopVehicleResponse> getTopVehicles(Integer limit) {
        int resultLimit = limit != null ? limit : 8;
        return vehicleRepository.findAll().stream()
                .sorted(Comparator.comparing(Vehicle::getRentCount, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(resultLimit)
                .map(vehicle -> TopVehicleResponse.builder()
                        .vehicle(vehicleMapper.toResponse(vehicle))
                        .rentCount(vehicle.getRentCount() != null ? vehicle.getRentCount() : 0)
                        .build())
                .collect(Collectors.toList());
    }

    public List<TopCustomerResponse> getTopCustomers(Integer limit) {
        int resultLimit = limit != null ? limit : 8;
        List<User> renters = userRepository.findByRole(UserRole.RENTER);

        return renters.stream()
                .<TopCustomerResponse>map(user -> {
                    List<Booking> userBookings = bookingRepository.findByRenterId(user.getId()).stream()
                            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                            .collect(Collectors.toList());

                    BigDecimal totalSpent = userBookings.stream()
                            .map(Booking::getTotalAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return TopCustomerResponse.builder()
                            .user(userMapper.toUserResponse(user))
                            .totalSpent(totalSpent)
                            .bookingCount(userBookings.size())
                            .build();
                })
                .filter(tc -> tc.getTotalSpent().compareTo(BigDecimal.ZERO) > 0)
                .sorted(Comparator.comparing(TopCustomerResponse::getTotalSpent).reversed())
                .limit(resultLimit)
                .collect(Collectors.toList());
    }

    // ==================== Staff Assignment ====================
    public void attachStaffToStation(UUID staffId, UUID stationId) {
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (staff.getRole() != UserRole.STAFF) {
            throw new RuntimeException("User is not a staff member");
        }

        staff.setStationId(stationId);
        userRepository.save(staff);
    }
}

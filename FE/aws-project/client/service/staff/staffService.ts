// ==========================================
// Staff Service
// Handles staff management operations
// ==========================================

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import type { UserResponse } from '../types/auth.types';

class StaffService {
  // ============== STAFF OPERATIONS ==============

  /**
   * Get all staff members at a specific station
   * @param stationId - Station UUID
   * @returns List of staff members
   */
  async getStaffByStation(stationId: string): Promise<UserResponse[]> {
    const params = new URLSearchParams({
      stationId,
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.STAFF.GET_BY_STATION}?${params.toString()}`
    );
    return response.data.data;
  }

  // ============== HELPER METHODS ==============

  /**
   * Get role text in Vietnamese
   */
  getRoleText(role: string): string {
    const roles: Record<string, string> = {
      ADMIN: 'Quản trị viên',
      MANAGER: 'Quản lý',
      STAFF: 'Nhân viên',
      RENTER: 'Khách hàng',
    };
    return roles[role] || role;
  }

  /**
   * Get role badge color
   */
  getRoleBadgeColor(role: string): string {
    const colors: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      STAFF: 'bg-green-100 text-green-800',
      RENTER: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Filter staff by role
   */
  filterByRole(staff: UserResponse[], role: string): UserResponse[] {
    return staff.filter(s => s.role === role);
  }

  /**
   * Filter active staff only
   */
  filterActiveStaff(staff: UserResponse[]): UserResponse[] {
    return staff.filter(s => s.isActive !== false);
  }

  /**
   * Get staff count by role
   */
  getStaffCountByRole(staff: UserResponse[]): Record<string, number> {
    return staff.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Format staff member name with email
   */
  formatStaffName(staff: UserResponse): string {
    return `${staff.fullName} (${staff.email})`;
  }

  /**
   * Check if staff member is active
   */
  isStaffActive(staff: UserResponse): boolean {
    return staff.isActive !== false;
  }

  /**
   * Sort staff by name
   */
  sortByName(staff: UserResponse[], ascending: boolean = true): UserResponse[] {
    return [...staff].sort((a, b) => {
      const comparison = a.fullName.localeCompare(b.fullName, 'vi');
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Search staff by name or email
   */
  searchStaff(staff: UserResponse[], query: string): UserResponse[] {
    const lowerQuery = query.toLowerCase();
    return staff.filter(
      s =>
        s.fullName.toLowerCase().includes(lowerQuery) ||
        s.email.toLowerCase().includes(lowerQuery) ||
        (s.phoneNumber && s.phoneNumber.includes(query))
    );
  }
}

// Export singleton instance
const staffService = new StaffService();
export default staffService;

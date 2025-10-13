/**
 * Export Utilities
 * Functions để export dữ liệu ra Excel và CSV
 */

import { User } from "@shared/types";

/**
 * Export users to CSV format
 */
export function exportToCSV(users: User[], filename: string = "users") {
  // Define CSV headers
  const headers = [
    "ID",
    "Full Name",
    "Email",
    "Phone",
    "Role",
    "Status",
    "Verified",
    "License Number",
    "Identity Number",
    "Station ID",
    "Created At",
  ];

  // Convert users to CSV rows
  const rows = users.map((user) => [
    user.id,
    user.full_name,
    user.email,
    user.phone,
    user.role,
    user.status,
    user.is_verified ? "Yes" : "No",
    user.license_number || "",
    user.identity_number || "",
    user.stationid || "",
    new Date(user.created_at).toLocaleDateString("vi-VN"),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${Date.now()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export users to Excel format (using HTML table method)
 * For a more robust solution, consider using libraries like xlsx or exceljs
 */
export function exportToExcel(users: User[], filename: string = "users") {
  // Create HTML table
  const table = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Status</th>
          <th>Verified</th>
          <th>License Number</th>
          <th>Identity Number</th>
          <th>Station ID</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (user) => `
          <tr>
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>${user.is_verified ? "Yes" : "No"}</td>
            <td>${user.license_number || ""}</td>
            <td>${user.identity_number || ""}</td>
            <td>${user.stationid || ""}</td>
            <td>${new Date(user.created_at).toLocaleDateString("vi-VN")}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  // Create blob with Excel MIME type
  const blob = new Blob([table], {
    type: "application/vnd.ms-excel",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${Date.now()}.xls`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print users list
 */
export function printUsers(users: User[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print");
    return;
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Users List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            color: #333;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #4CAF50;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .meta {
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>Users List</h1>
        <p>Total Users: ${users.length}</p>
        <p>Generated: ${new Date().toLocaleString("vi-VN")}</p>
        
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (user) => `
              <tr>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>${user.is_verified ? "✓" : "✗"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="meta">
          <p>BF Car Rental - User Management System</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
}

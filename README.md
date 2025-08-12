# Shift Scheduling Web App

A full-stack web application built with Node.js, Express, React, and Tailwind CSS for managing shift assignments in an organization. Users log in with personnel codes, select their shifts based on their assigned line, and the system syncs data with Google Sheets.

---

## Features

- **Personnel Code Authentication:** Secure login using personnel codes without passwords.
- **Dynamic Shift Selection:** Shift options depend on user line:
  - **Line "Isaar"**: Morning, Evening, Night shifts
  - **Line "Voroodi"**: Morning, Evening shifts only
- **Shift Constraints:**
  - Minimum total available hours per user
  - Limited removals per shift to ensure coverage
- **Google Sheets Integration:** Real-time sync with Google Sheets via API.
- **User Roles:**
  - Regular Users: Manage their own shift availability
  - Supervisors: View shift submission status of all users
- **Responsive UI:** Built with React and Tailwind CSS for mobile and desktop.
- **Security:** JWT stored in HttpOnly cookies, server-side authentication middleware.
- **Post-delivery Support:** One month support for bug fixes and maintenance.

---

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, JSON Web Tokens (JWT)
- **Frontend:** React, React Router, Tailwind CSS, Axios
- **Google Sheets API:** For shift data storage and retrieval

---

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance
- Google Cloud project with Google Sheets API enabled
- `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
CSV_SHIFTS_URL=your_public_google_sheet_csv_url

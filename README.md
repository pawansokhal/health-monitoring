## Project Setup & Installation Instructions

### Prerequisites

Make sure the following software is installed before you run the project:

- **Node.js** (v14 or higher)
- **MongoDB** (either locally or use MongoDB Atlas)
- **npm** (comes with Node.js)

### Steps to Run the Project Locally

 **Clone the repository:**

   If you haven't already cloned the repository, run the following command:

   ```bash
   git clone https://github.com/pawansokhal/health-monitoring.git
   cd health-monitoring


**Install dependencies:**
```bash
npm install

**Set up environment variables:**
Create a .env file from example.env


**Run the seed script:**
After installing dependencies and setting up the environment, you can seed the database by running:
```bash
node seed.js


**Run the build with docker:**
docker-compose up --build




**API Endpoints:**
Auth
POST /api/auth/login — Login with username and password

Patients (Admin/Doctor only)
GET /api/patients?page=1 — Paginated fetch

POST /api/patients — Add new patient

PUT /api/patients/:id — Update patient

DELETE /api/patients/:id — Delete patient

Devices (Admin only)
POST /api/devices — Add a new device

POST /api/devices/assign — Assign device to patient

Vitals Data
POST /api/readings — Public endpoint for devices to send readings
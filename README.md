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
   ```


**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**
Create a .env file from example.env


**Run the seed script:**
After installing dependencies and setting up the environment, you can seed the database by running below commnds: It will insert admin and doctor role. 
```bash
node seed.js
```

**Run the build with docker:**
```bash
docker-compose up --build
```

**Run test:**
```bash
npm test
```


### API Enpoints


**Auth:**

**Registration API is not wrriten role of admin and doctor has provided by seed command**

POST /api/auth/login — Login with username and password


**Patients (Admin/Doctor only):**

GET /api/patients?page=1 — Paginated fetch

POST /api/patients — Add new patient

PUT /api/patients/:id — Update patient

DELETE /api/patients/:id — Delete patient


**Devices (Admin only):**

POST /api/devices — Add a new device

POST /api/devices/assign — Assign device to patient

**Vitals Data:**

POST /api/readings — Public endpoint for devices to send readings


### Tech Stack & Justification

**Node.js** was chosen as the backend runtime because of its non-blocking, event-driven architecture, which is ideal for handling high-frequency input/output operations—perfect for a healthcare setting where multiple devices continuously stream data.

**Express.js** is used as the web framework due to its simplicity, flexibility, and vast ecosystem. It allows rapid development of RESTful APIs while maintaining good structure and middleware support.

**MongoDB** was selected as the primary database because it handles high insert rates very efficiently. Since patient devices send frequent updates (potentially 10,000+ events per second), MongoDB's ability to scale horizontally and accept large volumes of write operations made it the most appropriate choice. Additionally, its flexible schema supports variable data formats, which is often required in medical systems.

**Mongoose** serves as an ODM (Object Data Modeling) tool that helps structure the MongoDB collections and enforce validation rules without the rigidity of a traditional SQL schema.

For authentication, **JWT** (JSON Web Tokens) was implemented to provide stateless and secure access control. This works well for modern APIs and supports role-based access without needing to maintain server-side sessions.

**Docker** and **Docker Compose** are used for containerization and orchestration of the API and MongoDB services. This setup ensures consistent environments across development and production, and simplifies running the application with minimal setup.

For testing, **Jest** was used due to its wide adoption in the Node.js community and excellent support for unit testing. Supertest complements Jest by providing utilities to perform and assert HTTP requests against the Express application, enabling integration tests for the API.



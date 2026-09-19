# 🏠 HostelCare — Hostel Complaint Management System

HostelCare is a full-stack MERN web application designed to simplify hostel complaint management.

Students can submit and track hostel complaints, while administrators can manage complaints, update their status, monitor statistics, and analyze complaint categories.

## ✨ Features

### Student

- User registration and login
- JWT authentication
- Submit hostel complaints
- Upload complaint images
- View personal complaints
- Track complaint status
- Delete pending complaints
- Receive status update notifications
- Unread notification badge
- Dark and light mode
- Protected routes
- Responsive interface

### Admin

- Secure admin dashboard
- View all student complaints
- Search complaints
- Filter by status
- Filter by category
- Update complaint status
- View complaint images
- Dashboard statistics
- Resolution rate
- Category analytics
- Role-based route protection

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Multer

### Database

- MongoDB Atlas
- Mongoose

## 📁 Project Structure

```text
Hostel_Complaint_Management/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── config/
│   │   └── pages/
│   └── package.json
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd Hostel_Complaint_Management
```

### Backend

```bash
cd server
npm install
```

Create `.env`:

```env
MONGO_URI=mongodb://aditi160500_db_user:hostel123@ac-qsidudt-shard-00-00.soe1rqt.mongodb.net:27017,ac-qsidudt-shard-00-01.soe1rqt.mongodb.net:27017,ac-qsidudt-shard-00-02.soe1rqt.mongodb.net:27017/?ssl=true&replicaSet=atlas-sq5omv-shard-0&authSource=admin&appName=HostelCare
JWT_SECRET=JWT_SECRET=hostelcare_super_secret_key_2026

PORT=5000
```

Start backend:

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- Student/admin role authorization
- Protected API routes
- File type and size validation
- Environment variables for sensitive configuration

## 📌 Complaint Status

```text
Pending → In Progress → Resolved
```

Students receive notifications when administrators update complaint status.

## 🚀 Future Improvements

- Email notifications
- Password reset
- Admin user management
- Complaint priority levels
- Cloud image storage
- Real-time notifications
- Advanced analytics

## 👩‍💻 Author

Aditi Raj
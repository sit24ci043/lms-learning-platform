🎓 Learning Management System (LMS)

A full-stack Learning Management System built for engineering students to watch recorded skill development sessions and track their learning progress efficiently.

---

🚀 Project Overview

This LMS platform provides a seamless learning experience where students can:

- Explore courses
- Watch video lectures (via YouTube integration)
- Track their progress
- Take notes while learning

It also includes an Admin Panel for managing courses, sessions, and monitoring analytics.

---

🛠 Tech Stack

Frontend:

- React.js
- Tailwind CSS

Backend:

- Lovable Cloud (Serverless backend)

Database:

- Managed Cloud Database (Lovable)

Authentication:

- Built-in Authentication (Email/Password)

Video Integration:

- YouTube Embedded Player

---

✨ Features

👨‍🎓 Student Features

- 🔐 Authentication (Signup/Login)
- 🏠 Landing Page with featured courses
- 📊 Dashboard with enrolled courses & progress overview
- 🔍 Course Listing with search & filters
- 📚 Course Details with session list
- ▶️ Video Player with YouTube integration
- 📝 Notes panel (write & save notes per video)
- ✅ Mark lessons as completed
- 📈 Progress Tracker (percentage-based)
- ⏯ Resume last watched video
- 🌙 Dark Mode (optional)

---

👨‍🏫 Admin Features

- 📊 Admin Dashboard (users, courses, analytics)
- ➕ Create & manage courses
- 🎥 Add sessions using YouTube video links
- ✏️ Edit/Delete sessions
- 🔄 Reorder course sessions
- 📈 Track student engagement & progress

---

🧩 Database Structure

Users

- id
- name
- email
- role (student/admin)
- enrolledCourses

Courses

- id
- title
- description
- category
- difficulty
- instructor
- sessions

Sessions

- id
- title
- youtubeUrl
- duration

Progress

- userId
- courseId
- completedSessions
- lastWatchedVideo
- progressPercentage

Notes

- userId
- videoId
- content

---

🎨 UI/UX Highlights

- Clean and modern design inspired by EdTech platforms
- Fully responsive (mobile + desktop)
- Reusable components (Navbar, Cards, Buttons, Modals)
- Smooth navigation & user flow
- Loading states & toast notifications

---

🔄 User Flow

Signup/Login → Dashboard → Course Listing → Course Detail → Video Player → Progress Tracking

---

⚙️ Installation & Setup

1. Clone the repository

git clone https://github.com/your-username/lms-project.git
cd lms-project

2. Install dependencies

npm install

3. Start the development server

npm start

4. Configure environment variables (if required by Lovable Cloud)

---

📦 Folder Structure

/src
  /components
  /pages
  /hooks
  /services
  /assets

---

🧪 Testing

- Basic usability testing conducted
- Improved UI based on feedback
- Focused on enhancing Video Player experience

---

📌 Future Enhancements

- 🤖 AI-based course recommendations
- 📱 Mobile app version
- 🗣 Discussion forums
- 🧠 Quiz & assessment module

---

👩‍💻 Author

Developed as part of a UI/UX + Fullstack Internship Project.

---

📄 License

This project is for educational purposes.

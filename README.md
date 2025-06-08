# Workflo - Task Management Dashboard (Level 2 Implementation)

A comprehensive task management dashboard built with React, Redux, and Firebase, featuring real-time collaboration and advanced task management capabilities.

## 🚀 Features Implemented

### Level 1 (Core Requirements)
- ✅ **Dashboard UI**: Pixel-perfect implementation matching the Figma design
- ✅ **Task Management**: Add, edit, delete, and move tasks between columns
- ✅ **Drag & Drop**: Smooth drag-and-drop functionality between task columns
- ✅ **Filtering**: Advanced filtering by priority, assignee, due date, and search
- ✅ **State Management**: Redux with localStorage persistence
- ✅ **Responsive Design**: Mobile-first responsive layout

### Level 2 (Advanced Features)
- ✅ **Firebase Authentication**: Complete user authentication system with sign-up/login
- ✅ **Due Date & Reminders**: Task due dates with intelligent reminder notifications
- ✅ **Subtasks**: Nested task management with progress tracking
- ✅ **Socket.io Integration**: Real-time collaboration with live updates
- ✅ **Customizable Task Fields**: Dynamic custom fields for enhanced workflow
- ✅ **Activity Log**: Comprehensive activity tracking for all task changes

## 🛠 Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Real-time**: Socket.io
- **UI Components**: Lucide React icons, React DatePicker
- **Drag & Drop**: React Beautiful DnD
- **Date Handling**: date-fns

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harisankar705/Workflo
   cd Workflo
Install dependencies


npm install
Start the Socket.io server


npm run server
Start the development server


npm run dev
Access the application

Frontend: http://localhost:5173

Socket.io Server: http://localhost:3001

🔧 Configuration
Firebase Setup
The application uses Firebase for authentication. For production use:

Create a Firebase project

Enable Authentication with Email/Password

Update src/config/firebase.ts with your Firebase config

Socket.io Server
The real-time collaboration server runs on port 3001. Make sure this port is available.

🎯 Key Features Breakdown
Authentication System
Email/password authentication via Firebase

Persistent login sessions

User profile management

Secure logout functionality

Due Date Management
Visual due date indicators on task cards

Color-coded urgency (overdue: red, due soon: orange)

Automatic reminder notifications

Due date filtering options

Subtask System
Add unlimited subtasks to any task

Visual progress tracking with completion percentage

Individual subtask completion toggle

Progress bar visualization

Real-time Collaboration
Live task updates across all connected users

Real-time drag-and-drop synchronization

Instant task creation/deletion updates

User presence indicators

Custom Fields
Predefined field templates (Complexity, Estimated Hours, Category)

Dynamic field addition to tasks

Multiple field types: text, select, number, date

Field value persistence and synchronization

Activity Logging
Comprehensive change tracking

User attribution for all actions

Timestamped activity entries

Detailed action descriptions

📱 Responsive Design
The dashboard is fully responsive with breakpoints:

Mobile: < 768px

Tablet: 768px - 1024px

Desktop: > 1024px

🔒 Security Features
Firebase Authentication integration

Secure user session management

Protected routes and components

Input validation and sanitization

🚀 Performance Optimizations
Redux state persistence with localStorage

Optimized re-renders with React.memo

Efficient drag-and-drop operations

Lazy loading for modal components

📊 State Management
The application uses Redux Toolkit with three main slices:

taskSlice: Task management and operations

authSlice: User authentication state

notificationSlice: Notification system

🎨 Design System
Consistent 8px spacing grid

Color-coded priority system

Smooth transitions and hover effects

Professional typography hierarchy

Accessible color contrasts

🧪 Testing Recommendations
Authentication Flow: Test sign-up, login, and logout

Task Operations: Create, edit, delete, and move tasks

Real-time Features: Test with multiple browser windows

Responsive Design: Test across different screen sizes

Data Persistence: Verify localStorage functionality

🚀 Deployment
The application is deployed to:

Frontend: Netlify, 



📈 Future Enhancements
File upload and attachment system

Advanced notification preferences

Team management and permissions

Integration with external calendars

Advanced analytics and reporting

🤝 Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request

🔗 Links
📂 GitHub Repository

🚀 Live Demo

📄 License
This project is licensed under the MIT License.



---

Let me know if you want this in a downloadable `.md` file or want help writing a `README` badge section (GitHub stats, Netlify deploy status, etc).

Project Documentation
Overview
This project is a full-stack application using React.js on the frontend and Ruby on Rails on the backend. PostgreSQL is used for database management, and Vercel and Render are used for deployment on frontend and backend, respectively.

The application consists of two main modules:

Stock Management Module: Accessible to users with any role.
Advanced Analytics Module: Available to users with elevated permissions (admin or super_admin).
Access control is role-based:

Viewer: Assigned to users by default, with access to the Stock Management module.
Admin: Grants access to the Advanced Analytics module.
Super Admin: Provides unrestricted access to the entire application.
Running the Frontend
To start the frontend server, open a command prompt and run:

bash
Copy code
npm run start
Modules Overview
Module 1: Stock Management
This module is accessible to all users with the "viewer" role or higher.

Features:

User Authentication: Users can sign in, sign up, request password resets, and reset passwords through an SMTP service.
Company & Stock Management: Users can create companies and manage stocks associated with those companies. Full CRUD operations are available.
Module 2: Advanced Analytics
This module requires an admin or super_admin role for access.

Features:

User Authentication: Same as Module 1, supporting sign-in, sign-up, forgot-password, and reset-password actions with SMTP integration.
Listings:
Stocks: Lists all stocks, with options to view detailed charts and download chart images.
Sectors: Shows stocks associated with each sector. Users can download sector-specific data as CSV files.
Indices: Allows creation of indices for both domestic and international markets. Users can add and manage various charts based on their requirements.
Key Technologies
Frontend: React.js
Backend: Ruby on Rails (API)
Database: PostgreSQL
Authentication: Devise with OmniAuth for social logins
Deployment: Vercel (Frontend), Render (Backend)
Error Handling
Error handling has been implemented across both frontend and backend to provide a smooth user experience and informative feedback in case of any issues.

Contact
Hitesh Sukhpal
Full Stack Developer, IndusIT
Email: hiteshsukhpal03@gmail.com
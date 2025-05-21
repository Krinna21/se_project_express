## WTWR (What to Wear?) Back-End

The back-end of the WTWR (What to Wear?) application serves as the core infrastructure for managing user authentication, clothing items, and their likes. This API-based server allows users to securely sign up, log in, and manage their profiles, as well as add and interact with clothing items.

This back-end is built to interact with a MongoDB database and provides routes for creating, retrieving, updating, and deleting clothing items. Users can also "like" items, and the server is protected by JWT (JSON Web Token) authentication.

Project Functionality

Core Features:

User Authentication: Secure user registration, login, and JWT token-based authentication.

Clothing Item Management: CRUD (Create, Read, Update, Delete) operations for clothing items, which include image URLs and weather preferences.

Likes System: Users can like or unlike clothing items.

Profile Management: Each user has a unique profile with the ability to update their information.

Technologies Used:

Node.js: JavaScript runtime for building the server.

Express.js: Web framework for Node.js used to handle HTTP requests.

MongoDB: NoSQL database for storing user and item data.

Mongoose: ODM (Object Data Modeling) library to interact with MongoDB.

JWT (JSON Web Tokens): Secure authentication method for protecting routes.

bcryptjs: Library for hashing user passwords.

validator: Library for validating user input such as email and URL.

## Frontend Repository

You can find the backend code here:  
👉 [se_project_express](https://github.com/Krinna21/se_project_react.git)

## Domain Name

www.whatowear.jumpingcrab.com

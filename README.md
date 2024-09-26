# NexTalk

A real-time chat application built with React, Redux, Node.js, Express, and Socket.IO.

## Demo
[Watch the demo video](https://github.com/lewisthagichu/NexTalk/blob/main/client/public/homeVideo.mp4)
<div>    
<img src="https://raw.githubusercontent.com/lewisthagichu/NexTalk/refs/heads/main/client/public/mob1.webp" alt="Screenshot 1" width="200"/>
<img src="https://raw.githubusercontent.com/lewisthagichu/NexTalk/refs/heads/main/client/public/mob2.webp" alt="Screenshot 2" width="200"/>
<img src="https://raw.githubusercontent.com/lewisthagichu/NexTalk/refs/heads/main/client/public/mob3.webp" alt="Screenshot 3" width="200"/>
</div>

## Features

- Real-time messaging
- User authentication
- File uploads (images and documents)
- Notifications for new messages
- Online/offline user status
- Persistent notifications using localStorage

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Real-time Communication**: Socket.IO

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/NexTalk.git
    cd NexTalk
    ```

2. Install dependencies for the server:
    ```sh
    cd api
    npm install
    ```

3. Install dependencies for the client:
    ```sh
    cd ../client
    npm install
    ```

### Environment Variables

Create a `.env` file in the `api` directory and add the following:

```env
PORT=***
MONGO_URI=your_mongo_url
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### Running the Application

1. Start the backend server:
    ```sh
    cd server
    npm start
    ```

2. Start the frontend client:
    ```sh
    cd ../client
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

### Api

- `server.js`: Entry point for the backend server.
- `config/connectDB.js`: MongoDB connection configuration.
- `controllers`: Contains the controller functions for user and message management.
- `models`: Mongoose schemas and models.
- `routes`: Express routes for user and message APIs.
- `middleware`: Custom middleware functions.
- `utils`: Utility functions.

### Client

- `src`: Main source directory.
  - `components`: Reusable React components.
  - `context`: Context API for global state management (e.g., notifications).
  - `features`: Redux slices for managing state (e.g., auth, messages).
  - `hooks`: Custom hook functions.
  - `pages`: Main pages for the application (e.g., Chat, Login, Register).
  - `App.js`: Main application component.
  - `index.js`: Entry point for the React application.
  - `utils`: Utility functions.

## Usage

### User Authentication

- Register a new user.
- Login with existing credentials.

### Chat Functionality

- Select a user from the contact list to start chatting.
- Send text messages or upload files (images/documents).
- Receive real-time notifications for new messages.
- View online/offline status of users.

### Notifications

- New message notifications are stored in localStorage for persistence across sessions.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Socket.IO](https://socket.io/)
- [Redux](https://redux.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://reactjs.org/)

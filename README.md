# CodeSync

ChatSync is a real-time collaborative code editor built with React, TypeScript, WebSockets, and Monaco Editor. This app allows multiple users to work together on code in real time within a shared room.

## Features

- **Real-time Collaboration**: Multiple users can edit code in real-time within the same room.
- **Room Management**: Users can create or join rooms using a unique room ID.
- **Code Editor**: The app uses Monaco Editor to provide a robust and feature-rich code editing experience.
- **Responsive UI**: Built with a focus on ease of use and responsiveness.

## Tech Stack

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static types.
- **Vite**: Next-generation frontend tooling.
- **Monaco Editor**: The code editor that powers VS Code, providing rich editing features.
- **WebSockets**: For enabling real-time communication between users.

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jignesh119/CodeSync.git
   cd CodeSync
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run build
   node server.js
   ```

4. Open your browser and go to `http://localhost:4000` to view the app.

## Usage

### Home Page (`/`)

- Enter a room ID and your name to create or join a room.

### Editor Page (`/editor/[roomId]`)

- The main code editor where all users in the room can collaborate.
- Users can:
  - Copy the room ID to share with others.
  - Leave the room.
  - See and make changes to the code in real-time.

## Project Structure

```bash
src/
├── components/       # Reusable components like Editor, Client, etc.
├── pages/            # Pages for Home and Editor
├── App.tsx           # Main app component
├── main.tsx          # Entry point for Vite
├── index.html        # HTML template
├── io.ts             # socket client configuration
└── vite.config.ts    # Vite configuration
server.js         # websocket server code
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

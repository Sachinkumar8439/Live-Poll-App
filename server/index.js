// server/index.js
const { createServer } = require('http');
const { Server } = require('socket.io');

// Create a simple HTTP server
const httpServer = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is running...');
});

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Allow any origin (modify as needed for production)
    },
});

const PORT = 3001;

// In-memory data structure to store poll information
const polls = {};

// Socket.IO events
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Create a new poll room
    socket.on('createRoom', ({ roomCode, question, options }) => {
        if (polls[roomCode]) {
            socket.emit('error', 'Room already exists');
            return;
        }
        polls[roomCode] = { question, options, votes: Array(options.length).fill(0), active: true };
        socket.join(roomCode);
        io.to(roomCode).emit('roomCreated', { roomCode, question, options });
    });

    // Join an existing poll room
    socket.on('joinRoom', (roomCode) => {
        if (!polls[roomCode] || !polls[roomCode].active) {
            socket.emit('error', 'Room does not exist or poll has ended');
            return;
        }
        socket.join(roomCode);
        io.to(roomCode).emit('userJoined', roomCode);
    });

    // Handle voting
    socket.on('vote', ({ roomCode, optionIndex }) => {
        if (!polls[roomCode] || !polls[roomCode].active) {
            socket.emit('error', 'Poll not active');
            return;
        }
        if (optionIndex < 0 || optionIndex >= polls[roomCode].votes.length) {
            socket.emit('error', 'Invalid option');
            return;
        }
        polls[roomCode].votes[optionIndex] += 1;
        io.to(roomCode).emit('voteUpdate', polls[roomCode].votes);
    });

    // End the poll
    socket.on('endPoll', (roomCode) => {
        if (!polls[roomCode]) {
            socket.emit('error', 'Room does not exist');
            return;
        }
        polls[roomCode].active = false;
        io.to(roomCode).emit('pollEnded', polls[roomCode].votes);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

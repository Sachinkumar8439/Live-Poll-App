// client/src/pages/PollRoom.js
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const PollRoom = () => {
    const { pollCode } = useParams(); // Get dynamic parameter from the route
    const location = useLocation() // Get the state passed during navigation
    const { inputs, description } = location.state || {};
    const [poll, setPoll] = useState(true);
    const [votes, setVotes] = useState([]);
    console.log(inputs,description)
    useEffect(() => {
        socket.emit('joinRoom', pollCode);

        socket.on('roomCreated', (data) => setPoll(data));
        socket.on('voteUpdate', (newVotes) => setVotes(newVotes));
        socket.on('pollEnded', (finalVotes) => {
            setVotes(finalVotes);
            alert('Poll has ended');
        });

        return () => socket.disconnect();
    }, [pollCode]);

    const handleVote = (index) => {
        socket.emit('vote', { pollCode, optionIndex: index });
    };

    if (!poll) return <p>Loading poll...</p>;

    return (
        <div className="poll-room">
            <h1>{description}</h1>
            {inputs.map((option, index) => (
                <button key={index} onClick={() => handleVote(index)}>
                    {option} ({votes[index] || 0})
                </button>
            ))}
        </div>
    );
};

export default PollRoom;

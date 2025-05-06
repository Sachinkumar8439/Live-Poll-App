// client/src/pages/LandingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [inputs, setInputs] = useState(['']); // Initialize state with one empty input
    const [description, setdescription] = useState('');
    const [pollcode, setpollcode] = useState('');
    const navigate = useNavigate();

    // const handleCreateRoom = () => {
    //     if (!name) return alert('Please enter your name');
    //     navigate(`/poll/${roomCode}`);
    // };

    // const handleJoinRoom = () => {
    //     if (!name || !roomCode) return alert('Please enter your name and room code');
    //     navigate(`/poll/${roomCode}`);
    // };
    const handlesave = (e)=>{
        e.preventDefault();
        console.log(inputs,description,pollcode)
        navigate(`/poll/${pollcode}`,{ state: { inputs, pollcode, description } })
    }

    const handleChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const addInput = () => {
        setInputs([...inputs, '']); // Add a new empty input field
    };
    return (
        <div className="landing-page">
            <h1>Welcome to Live Poll Battle</h1>
            <div className='create poll'>
                <h1>CREATE POLL</h1>
                <div className='box'>
                    <input type='text' placeholder='description of poll' onChange={(e)=>setdescription(e.target.value)} value={description}></input>
                    <input type='text' placeholder='poll code' onChange={(e)=>setpollcode(e.target.value)} value={pollcode}></input>
                    <div>
            {inputs.map((value, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={addInput}>+</button>
        </div>
        <button onClick={handlesave}>save poll</button>
                </div>
            </div>
            {/* <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div>
                <button onClick={handleCreateRoom}>Create Poll</button>
                <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />
                <button onClick={handleJoinRoom}>Join Poll</button>
            </div> */}
        </div>
    );
};

export default LandingPage;

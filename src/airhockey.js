import React, { useState, useEffect, useRef } from "react";


const AirHockey = () => {
    const [scores, setScores] = useState({ player1: 0, player2: 0 });
    const canvasRef = useRef(null);
    
    // Use refs for mutable game state
    const gameState = useRef({
      puck: { x: 100, y: 200 },
      velocity: { dx: 20, dy: 20 },
      player1: 10, // Paddle 1 y-position
      player2: 10, // Paddle 2 y-position
    });
  
    // Paddle movement for player 1 (keyboard)
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") gameState.current.player1 = Math.max(gameState.current.player1 - 20, 0);
      if (e.key === "ArrowDown") gameState.current.player1 = Math.min(gameState.current.player1 + 20, 300);
    };
  
    // Paddle movement for player 2 (mouse)
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      gameState.current.player2 = Math.min(Math.max(mouseY - 50, 0), 300);
    };
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
  
      const update = () => {
        const state = gameState.current;
  
        // Update puck position
        state.puck.x += state.velocity.dx;
        state.puck.y += state.velocity.dy;
  
        // Bounce off top and bottom walls
        if (state.puck.y <= 0 || state.puck.y >= 300) {
          state.velocity.dy = -state.velocity.dy;
        }
  
        // Bounce off paddles
        if (
          (state.puck.x <= 30 && state.puck.y >= state.player1 && state.puck.y <= state.player1 + 100) ||
          (state.puck.x >= 570 && state.puck.y >= state.player2 && state.puck.y <= state.player2 + 100)
        ) {
          state.velocity.dx = -state.velocity.dx;
        }
  
        // Detect goals
        if (state.puck.x <= 0) {
          setScores((prev) => ({ ...prev, player2: prev.player2 + 1 }));
          resetPuck();
        }
        if (state.puck.x >= 600) {
          setScores((prev) => ({ ...prev, player1: prev.player1 + 1 }));
          resetPuck();
        }
  
        // Draw frame
        draw();
      };
  
      const resetPuck = () => {
        gameState.current.puck = { x: 300, y: 200 };
        gameState.current.velocity = { dx: Math.random() > 0.5 ? 2 : -2, dy: 2 };
      };
  
      const draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Set canvas background to black
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height); 
        const state = gameState.current;
  
        // Draw puck
        context.beginPath();
        context.arc(state.puck.x, state.puck.y, 10, 0, Math.PI * 2);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
  
        // Draw paddles
        context.fillStyle = "blue";
        context.fillRect(10, state.player1, 20, 100); // Player 1 paddle
        context.fillRect(570, state.player2, 20, 100); // Player 2 paddle
      };
  
      const gameLoop = setInterval(update, 16); // ~60 FPS
  
      return () => clearInterval(gameLoop);
    }, []); // Empty dependency array ensures this effect runs only once
  
    return (
      <div onKeyDown={handleKeyDown} tabIndex="0" style={{ outline: "none" }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ border: "1px solid black" }}
          onMouseMove={handleMouseMove}
        />
        <p>Player 1 Score: {scores.player1}</p>
        <p>Player 2 Score: {scores.player2}</p>
      </div>
    );
  };
  export default AirHockey;
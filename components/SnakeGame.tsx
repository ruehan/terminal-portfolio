import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/sound';

interface SnakeGameProps {
  onClose: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake_highscore') || '0');
  });

  // Game constants
  const CELL_SIZE = 20;
  const GRID_WIDTH = 40;
  const GRID_HEIGHT = 30;
  const SPEED = 100;

  // Game state refs (to avoid closure staleness in interval)
  const snakeRef = useRef<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 15 });
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const spawnFood = () => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
      // Check if food spawns on snake
      // eslint-disable-next-line no-loop-func
      const onSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    spawnFood();
    setScore(0);
    setGameOver(false);
    startGame();
  };

  const startGame = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(update, SPEED);
  };

  const update = () => {
    if (gameOver) return;

    // Update direction
    directionRef.current = nextDirectionRef.current;

    const head = { ...snakeRef.current[0] };
    head.x += directionRef.current.x;
    head.y += directionRef.current.y;

    // Wall collision
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      handleGameOver();
      return;
    }

    // Self collision
    if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      handleGameOver();
      return;
    }

    const newSnake = [head, ...snakeRef.current];

    // Eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      soundManager.playBeep(); // Using beep as eat sound for now
      setScore(prev => {
        const newScore = prev + 10;
        if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore.toString());
        }
        return newScore;
      });
      spawnFood();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  };

  const handleGameOver = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setGameOver(true);
    soundManager.playBeep();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = '#0F0';
    snakeRef.current.forEach(segment => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw Food
    ctx.fillStyle = '#F00';
    ctx.fillRect(foodRef.current.x * CELL_SIZE, foodRef.current.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter') resetGame();
        if (e.key === 'Escape') onClose();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    startGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative p-4 border border-green-500 rounded-lg bg-black shadow-[0_0_50px_rgba(0,255,0,0.2)]">
        <div className="flex justify-between mb-2 font-mono text-green-500">
          <span>SCORE: {score}</span>
          <span>HIGH SCORE: {highScore}</span>
        </div>
        
        <canvas 
          ref={canvasRef} 
          width={GRID_WIDTH * CELL_SIZE} 
          height={GRID_HEIGHT * CELL_SIZE}
          className="border border-green-900 bg-black"
        />

        <div className="mt-2 text-center font-mono text-xs text-green-700">
          [ARROWS] MOVE • [ESC] EXIT
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-3xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</h2>
            <p className="text-green-500 mb-4">FINAL SCORE: {score}</p>
            <div className="space-y-2 text-center">
              <p className="text-sm text-zinc-400">PRESS [ENTER] TO RESTART</p>
              <p className="text-sm text-zinc-400">PRESS [ESC] TO EXIT</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

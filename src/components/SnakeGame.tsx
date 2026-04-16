import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      if (isPaused || gameOver) return;

      setDirection((prevDir) => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            return prevDir.y === 1 ? prevDir : { x: 0, y: -1 };
          case 'ArrowDown':
          case 's':
          case 'S':
            return prevDir.y === -1 ? prevDir : { x: 0, y: 1 };
          case 'ArrowLeft':
          case 'a':
          case 'A':
            return prevDir.x === 1 ? prevDir : { x: -1, y: 0 };
          case 'ArrowRight':
          case 'd':
          case 'D':
            return prevDir.x === -1 ? prevDir : { x: 1, y: 0 };
          default:
            return prevDir;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver]);

  // Game loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= CANVAS_SIZE / GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= CANVAS_SIZE / GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, isPaused, gameOver, food, onScoreChange]);

  const generateFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    setFood(newFood);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid (optional, subtle)
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff'; // Neon pink
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    ctx.shadowBlur = 0; // Reset shadow

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#39ff14'; // Head is white, body is neon green
      if (index !== 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#39ff14';
      } else {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffffff';
      }
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative p-2 bg-dark-surface rounded-xl glow-green">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-dark-surface rounded-lg border border-neon-green/30"
        />
        
        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl z-10">
            <div className="text-center">
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-bold text-neon-pink text-glow-pink mb-4">GAME OVER</h2>
                  <p className="text-white/80 mb-6">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-transparent border-2 border-neon-green text-neon-green rounded hover:bg-neon-green hover:text-black transition-colors font-bold tracking-widest uppercase"
                  >
                    Play Again
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-neon-blue text-glow-blue mb-4">PAUSED</h2>
                  <p className="text-white/80 mb-6">Press SPACE to resume</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-white/50 text-sm tracking-widest uppercase">
        Use WASD or Arrow Keys to move. Space to pause.
      </div>
    </div>
  );
}

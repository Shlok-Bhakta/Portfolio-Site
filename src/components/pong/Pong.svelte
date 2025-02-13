<script>
  import { onMount } from 'svelte';

  let canvas;
  let ctx;
  let animationId;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let isAttracting = false;
  let draggingPaddle = null;
  let containerDiv;
  let leftScore = 0;
  let rightScore = 0;

  // Fixed game dimensions
  const CANVAS_HEIGHT = 400;
  const PADDLE_HEIGHT = 80;
  const PADDLE_WIDTH = 10;
  const BALL_RADIUS = 8;
  const BALL_SPEED = 4;
  const attractionStrength = 0.2;
  const POINTS_PER_HIT = 10;

  // Catppuccin mocha colors
  const mochaColors = [
    '#f38ba8', // red
    '#fab387', // peach
    '#f9e2af', // yellow
    '#a6e3a1', // green
    '#94e2d5', // teal
    '#89dceb', // sky
    '#74c7ec', // sapphire
    '#89b4fa', // blue
    '#b4befe', // lavender
    '#cba6f7'  // mauve
  ];
  let currentColorIndex = 0;
  let ballColorIndex = 5; // Start with sky color

  let ball = {
    x: 0,
    y: 0,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
    color: mochaColors[ballColorIndex]
  };

  let leftPaddle = {
    y: (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2,
    color: mochaColors[0] // Start with red
  };

  let rightPaddle = {
    y: (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2,
    color: mochaColors[0] // Start with red
  };

  function getNextColor() {
    currentColorIndex = (currentColorIndex + 1) % mochaColors.length;
    return mochaColors[currentColorIndex];
  }

  function getNextBallColor() {
    ballColorIndex = (ballColorIndex + 1) % mochaColors.length;
    return mochaColors[ballColorIndex];
  }

  function updateGameDimensions() {
    if (!canvas || !containerDiv) return;
    
    // Only update width, keep height fixed
    canvas.width = containerDiv.clientWidth - 32; // Account for padding
    canvas.height = CANVAS_HEIGHT;

    // Reset ball position to center
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }

  function draw() {
    if (!ctx) return;

    // Clear canvas with translucent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30, 30, 46, 0.6)'; // Translucent Catppuccin base
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Draw paddles
    ctx.fillStyle = leftPaddle.color;
    ctx.fillRect(0, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.fillStyle = rightPaddle.color;
    ctx.fillRect(canvas.width - PADDLE_WIDTH, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw scores
    ctx.font = '24px "Pixel"';
    ctx.fillStyle = 'rgba(205, 214, 244, 0.8)';
    ctx.textAlign = 'left';
    ctx.fillText(leftScore.toString(), 30, 40);
    ctx.textAlign = 'right';
    ctx.fillText(rightScore.toString(), canvas.width - 30, 40);
  }

  function update() {
    // Ball movement and attraction logic
    if (!isDragging) {
      if (isAttracting) {
        // Ball attraction to mouse
        const dx = mouseX - ball.x;
        const dy = mouseY - ball.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 1) {
          ball.dx += (dx / distance) * attractionStrength;
          ball.dy += (dy / distance) * attractionStrength;
        }
        // Add some drag to prevent excessive speed
        ball.dx *= 0.98;
        ball.dy *= 0.98;
      }

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Bounce off top and bottom
      if (ball.y + BALL_RADIUS > canvas.height || ball.y - BALL_RADIUS < 0) {
        ball.dy = -ball.dy;
        ball.color = getNextBallColor();
      }

      // Bounce off paddles
      if (ball.x - BALL_RADIUS < PADDLE_WIDTH && ball.y > leftPaddle.y && ball.y < leftPaddle.y + PADDLE_HEIGHT) {
        ball.dx = -ball.dx;
        leftPaddle.color = getNextColor();
        rightPaddle.color = getNextColor();
        leftScore += POINTS_PER_HIT;
      } else if (ball.x + BALL_RADIUS > canvas.width - PADDLE_WIDTH && ball.y > rightPaddle.y && ball.y < rightPaddle.y + PADDLE_HEIGHT) {
        ball.dx = -ball.dx;
        leftPaddle.color = getNextColor();
        rightPaddle.color = getNextColor();
        rightScore += POINTS_PER_HIT;
      }

      // Reset ball if it goes out
      if (ball.x < 0 || ball.x > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
      }
    }

    // Paddle movement - AI for the paddle that's not being controlled
    if (draggingPaddle === 'left') {
      // Right paddle AI
      rightPaddle.y += (ball.y - (rightPaddle.y + PADDLE_HEIGHT/2)) * 0.1;
    } else if (draggingPaddle === 'right') {
      // Left paddle AI
      leftPaddle.y += (ball.y - (leftPaddle.y + PADDLE_HEIGHT/2)) * 0.1;
    } else {
      // Both paddles AI when none are being controlled
      leftPaddle.y += (ball.y - (leftPaddle.y + PADDLE_HEIGHT/2)) * 0.1;
      rightPaddle.y += (ball.y - (rightPaddle.y + PADDLE_HEIGHT/2)) * 0.1;
    }
    
    // Keep paddles in bounds (always enforce, whether AI or manual)
    leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - PADDLE_HEIGHT), 0);
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - PADDLE_HEIGHT), 0);
  }

  function gameLoop() {
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
  }

  function handlePointerDown(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Scale coordinates based on canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // Check for paddle clicks
    if (canvasX < PADDLE_WIDTH && canvasY > leftPaddle.y && canvasY < leftPaddle.y + PADDLE_HEIGHT) {
      draggingPaddle = 'left';
      dragOffsetY = leftPaddle.y - canvasY;
    } else if (canvasX > canvas.width - PADDLE_WIDTH && canvasY > rightPaddle.y && canvasY < rightPaddle.y + PADDLE_HEIGHT) {
      draggingPaddle = 'right';
      dragOffsetY = rightPaddle.y - canvasY;
    } else {
      // If not clicking paddles, attract the ball
      isAttracting = true;
      mouseX = canvasX;
      mouseY = canvasY;
    }
  }

  function handlePointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    if (draggingPaddle) {
      const newY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, canvasY + dragOffsetY));
      if (draggingPaddle === 'left') {
        leftPaddle.y = newY;
      } else {
        rightPaddle.y = newY;
      }
    } else if (isAttracting) {
      mouseX = canvasX;
      mouseY = canvasY;
    }
  }

  function handlePointerUp() {
    isAttracting = false;
    draggingPaddle = null;
  }

  let resizeTimeout;
  function handleResize() {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateGameDimensions();
    }, 250);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    
    // Initial setup
    updateGameDimensions();
    gameLoop();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  });
</script>

<svelte:head>
  <style>
    @font-face {
      font-family: 'Pixel';
      src: url('/pixel.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  </style>
</svelte:head>

<div class="w-full flex justify-center items-center px-6 py-4">
  <div 
    bind:this={containerDiv}
    class="w-full max-w-[calc(100vw-50px)] relative backdrop-blur-sm bg-base/30 rounded-xl p-4 shadow-lg border border-surface0/20"
  >
    <div class="relative">
      <canvas
        bind:this={canvas}
        class="rounded-lg w-full h-[400px] touch-none"
        style="touch-action: none;"
      />
      <h1 
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[min(8vw,5rem)] whitespace-nowrap text-text/80 font-['Pixel'] pointer-events-none select-none"
        aria-label="What I Do"
      >
        What I Do
      </h1>
    </div>
  </div>
</div>
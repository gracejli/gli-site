"use client";
import React, { useEffect, useRef } from 'react';

export const ShootingStarCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // FIX 1: Initialization state
    // We initialize these, but we won't draw until we confirm mouse position
    let mouseX = 0; 
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let isFirstMove = true; // Flag to track if the mouse has moved yet

    const particles: any[] = [];

    class StarDust {
        x: number; y: number; size: number; color: string; vx: number; vy: number; life: number; decay: number;
        constructor(x: number, y: number) {
            this.x = x; this.y = y;
            this.size = Math.random() * 3 + 1; // Random size
            
            const hues = [50, 40, 60];
            const hue = hues[Math.floor(Math.random() * hues.length)];
            this.color = `hsla(${hue}, 100%, 70%, 1)`;
            
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.life -= this.decay; 
            this.size -= 0.05;
        }
        draw(ctx: CanvasRenderingContext2D) {
            if (this.size <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            
            // FIX 2: Draw Squares instead of Circles
            ctx.beginPath();
            // FillRect draws a square. Subtracting half size centers it on the coordinate
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            
            ctx.restore();
        }
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const drawMainStar = (x: number, y: number) => {
        // If it's the first move, don't draw the star at (0,0)
        if(isFirstMove) return; 

        const spikes = 5;
        const outerRadius = 12;
        const innerRadius = 6;
        let rot = Math.PI / 2 * 3;
        let cx = x;
        let cy = y;
        let step = Math.PI / spikes;
        
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            canvasContext.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            canvasContext.lineTo(x, y);
            rot += step;
        }
        canvasContext.lineTo(cx, cy - outerRadius);
        canvasContext.closePath();
        canvasContext.shadowBlur = 15;
        canvasContext.shadowColor = '#fbbf24';
        canvasContext.fillStyle = '#fffbeb';
        canvasContext.fill();
        canvasContext.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
       mouseX = e.clientX;
       mouseY = e.clientY;

       // FIX 1 IMPL: Handle the very first frame
       // If this is the first time the mouse moved, sync positions and exit
       // This prevents the "line from center" bug
       if (isFirstMove) {
           lastX = mouseX;
           lastY = mouseY;
           isFirstMove = false;
           return; 
       }

       const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
       
       // FIX 3: Fewer sparkles
       // Increased divider from 2 to 10. Higher number = fewer particles
       const steps = Math.floor(dist / 5); 

       for(let i = 0; i < steps; i++) {
         const t = i / steps;
         const lerpX = lastX + (mouseX - lastX) * t;
         const lerpY = lastY + (mouseY - lastY) * t;
         
         const offsetX = (Math.random() - 0.5) * 10;
         const offsetY = (Math.random() - 0.5) * 10;
         particles.push(new StarDust(lerpX + offsetX, lerpY + offsetY));
       }
       lastX = mouseX;
       lastY = mouseY;
    };

    const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        
        if (isFirstMove) {
           lastX = mouseX;
           lastY = mouseY;
           isFirstMove = false;
           return;
        }

        particles.push(new StarDust(mouseX, mouseY));
        lastX = mouseX;
        lastY = mouseY;
    };

    const animate = () => {
      canvasContext.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(canvasContext);
        if (p.life <= 0 || p.size <= 0) particles.splice(i, 1);
      }
      drawMainStar(mouseX, mouseY);
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] block"
    />
  );
};
"use client";
import React, { useEffect, useRef } from 'react';

// 1. Export this component directly
export const ShootingStarCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let lastX = width / 2;
    let lastY = height / 2;
    
    // ... (Keep your Particle Class and Logic exactly the same) ...
    const particles: any[] = []; // Simplified type for brevity in fix

    class StarDust {
        // ... (Keep your existing StarDust class logic)
        x: number; y: number; size: number; color: string; vx: number; vy: number; life: number; decay: number;
        constructor(x: number, y: number) {
            this.x = x; this.y = y;
            this.size = Math.random() * 2 + 1;
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
            this.life -= this.decay; this.size -= 0.05;
        }
        draw(ctx: CanvasRenderingContext2D) {
            if (this.size <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
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
       // ... (Keep your drawMainStar logic)
        const spikes = 5;
        const outerRadius = 12;
        const innerRadius = 6;
        let rot = Math.PI / 2 * 3;
        let cx = x;
        let cy = y;
        let step = Math.PI / spikes;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fbbf24';
        ctx.fillStyle = '#fffbeb';
        ctx.fill();
        ctx.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
       // ... (Keep your mouse move logic)
       mouseX = e.clientX;
       mouseY = e.clientY;
       const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
       const steps = Math.floor(dist / 2);
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
        // ... (Keep touch logic)
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        particles.push(new StarDust(mouseX, mouseY));
        lastX = mouseX;
        lastY = mouseY;
    };

    const animate = () => {
       // ... (Keep animate logic)
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
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
      // FIX IS HERE: Added 'block' to the className
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] block"
    />
  );
};
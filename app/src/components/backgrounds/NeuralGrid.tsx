'use client';

import React, { useEffect, useRef } from 'react';

interface NeuralGridProps {
  className?: string;
  intensity?: 'subtle' | 'normal' | 'intense';
  animated?: boolean;
}

export default function NeuralGrid({ 
  className = '', 
  intensity = 'normal', 
  animated = true 
}: NeuralGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    const drawNeuralGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      
      // Grid settings based on intensity
      const gridSize = intensity === 'subtle' ? 60 : intensity === 'normal' ? 40 : 30;
      const nodeCount = Math.floor((w * h) / (gridSize * gridSize * 4));
      
      // Draw grid lines
      ctx.strokeStyle = `rgba(0, 102, 255, ${intensity === 'subtle' ? 0.03 : intensity === 'normal' ? 0.05 : 0.08})`;
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      
      // Draw neural nodes
      for (let i = 0; i < nodeCount; i++) {
        const x = (i % Math.floor(w / gridSize)) * gridSize + Math.sin(time * 0.001 + i) * 10;
        const y = Math.floor(i / Math.floor(w / gridSize)) * gridSize + Math.cos(time * 0.0015 + i) * 8;
        
        if (x > w || y > h) continue;
        
        const pulse = animated ? 
          0.3 + 0.3 * Math.sin(time * 0.003 + i * 0.5) : 
          0.3;
        
        // Node glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, `rgba(124, 92, 255, ${pulse * 0.6})`);
        gradient.addColorStop(0.5, `rgba(0, 102, 255, ${pulse * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw connection lines between nearby nodes
      ctx.strokeStyle = `rgba(0, 102, 255, ${intensity === 'subtle' ? 0.1 : intensity === 'normal' ? 0.15 : 0.2})`;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodeCount - 1; i++) {
        const x1 = (i % Math.floor(w / gridSize)) * gridSize + Math.sin(time * 0.001 + i) * 10;
        const y1 = Math.floor(i / Math.floor(w / gridSize)) * gridSize + Math.cos(time * 0.0015 + i) * 8;
        
        for (let j = i + 1; j < Math.min(i + 4, nodeCount); j++) {
          const x2 = (j % Math.floor(w / gridSize)) * gridSize + Math.sin(time * 0.001 + j) * 10;
          const y2 = Math.floor(j / Math.floor(w / gridSize)) * gridSize + Math.cos(time * 0.0015 + j) * 8;
          
          const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          
          if (distance < gridSize * 1.5 && Math.random() > 0.7) {
            const opacity = animated ? 
              0.1 + 0.1 * Math.sin(time * 0.002 + i + j) : 
              0.1;
            
            ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (animated) {
        time += 16; // ~60fps
      }
      drawNeuralGrid();
      if (animated) {
        animationId = requestAnimationFrame(animate);
      }
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [intensity, animated]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
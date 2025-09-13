'use client';

import React, { useEffect, useState } from 'react';

interface ScrollerProps {
  className?: string;
  color?: string;
  width?: number;
  right?: number;
  opacity?: number;
}

export function Scroller({
  className = '',
  color = '#0D3880',
  width = 4,
  right = 4,
  opacity = 0.8
}: ScrollerProps) {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollTop = window.scrollY;
      const percentage = (scrollTop / scrollHeight) * 100;
      setScrollPercentage(percentage);
    };

    // Initial calculation
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className={`fixed z-50 ${className}`}
      style={{
        top: 0,
        right: `${right}px`,
        width: `${width}px`,
        height: '100%',
        pointerEvents: 'none' // Make sure it doesn't interfere with clicking
      }}
    >
      <div 
        className="absolute top-0 rounded-full transition-all duration-300 ease-out"
        style={{
          width: '100%',
          backgroundColor: color,
          height: `${scrollPercentage}%`,
          opacity: opacity
        }}
      />
    </div>
  );
}

// For when you need a scrollbar for specific containers rather than the whole page
export function ContainerScroller({
  containerId,
  className = '',
  color = '#0D3880',
  width = 4,
  right = 4,
  opacity = 0.8
}: ScrollerProps & { containerId: string }) {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const handleScroll = () => {
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const percentage = (scrollTop / scrollHeight) * 100;
      setScrollPercentage(percentage);
    };

    // Initial calculation
    handleScroll();

    // Add event listener
    container.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerId]);

  return (
    <div 
      className={`absolute z-10 ${className}`}
      style={{
        top: 0,
        right: `${right}px`,
        width: `${width}px`,
        height: '100%',
        pointerEvents: 'none' // Make sure it doesn't interfere with clicking
      }}
    >
      <div 
        className="absolute top-0 rounded-full transition-all duration-300 ease-out"
        style={{
          width: '100%',
          backgroundColor: color,
          height: `${scrollPercentage}%`,
          opacity: opacity
        }}
      />
    </div>
  );
}

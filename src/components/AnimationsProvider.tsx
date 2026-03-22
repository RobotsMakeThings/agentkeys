'use client';
import { useEffect } from 'react';

export function AnimationsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add animate-in classes to elements with data-animate attribute
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 80}ms`;
      el.classList.add('animate-in');
    });
  }, []);
  return <>{children}</>;
}

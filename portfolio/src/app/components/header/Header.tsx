'use client';

import { useEffect, useRef } from 'react';

// Approximate tip positions along "WOUT.VDB" in Bebas Neue
const SPARKLES = [
  { top: '8%',  left: '1%',  size: 44, delay: 0,   dur: 3.5 }, // W apex
  { top: '4%',  left: '20%', size: 34, delay: 0.9,  dur: 2.9 }, // O top
  { top: '6%',  left: '42%', size: 40, delay: 1.6,  dur: 3.3 }, // T top
  { top: '14%', left: '63%', size: 26, delay: 0.4,  dur: 4.0 }, // V notch
  { top: '5%',  left: '88%', size: 38, delay: 2.1,  dur: 3.1 }, // B top
];

export default function Header() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const targetAngle = useRef(125);
  const currentAngle = useRef(125);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = h1Ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetAngle.current =
        Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);

      // Specular highlight position relative to the h1 bounding box
      const sx = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width)  * 100));
      const sy = Math.min(100, Math.max(0, ((e.clientY - rect.top)  / rect.height) * 100));
      el.style.setProperty('--chrome-x', `${sx}%`);
      el.style.setProperty('--chrome-y', `${sy}%`);
    };

    const animate = () => {
      let diff = targetAngle.current - currentAngle.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      currentAngle.current += diff * 0.08;
      h1Ref.current?.style.setProperty(
        '--chrome-angle',
        `${currentAngle.current}deg`
      );
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="chrome-header">
      <h1 ref={h1Ref}>WOUT.VDB</h1>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={
            {
              top: s.top,
              left: s.left,
              '--sparkle-size': `${s.size}px`,
              '--sparkle-delay': `${s.delay}s`,
              '--sparkle-dur': `${s.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

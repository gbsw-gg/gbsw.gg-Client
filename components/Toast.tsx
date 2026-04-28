'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function Toast({ message, type, visible }: ToastProps) {
  const [wrapper, setWrapper] = useState<Element | null>(null);

  useEffect(() => {
    setTimeout(() => setWrapper(document.querySelector('.wrapper')), 0);
  }, []);

  if (!wrapper || !message) return null;

  const bg = type === 'success' ? 'bg-[#05A787]' : 'bg-[#EF4444]';
  const animation = visible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-2 pointer-events-none';

  return createPortal(
    <div
      className={`absolute top-[24px] left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${animation}`}
    >
      <div className={`${bg} text-white text-[13px] font-medium px-5 py-3 rounded-xl shadow-lg whitespace-nowrap`}>
        {message}
      </div>
    </div>,
    wrapper,
  );
}

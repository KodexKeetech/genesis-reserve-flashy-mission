import React, { useEffect } from 'react';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    // Set viewport meta tag for mobile
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] overflow-x-hidden">
      {children}
    </div>
  );
}
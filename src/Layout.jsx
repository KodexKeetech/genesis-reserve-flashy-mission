import React from 'react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen min-h-[100dvh] overflow-x-hidden">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      {children}
    </div>
  );
}
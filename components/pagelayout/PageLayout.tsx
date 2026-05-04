import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

function PageLayout({
  children,
  className,
  hasFilter,
  hasBackButton,
}: PageLayoutProps) {
  const hasSecondaryBar = hasFilter || hasBackButton;
  // Nav bar = 56px (h-14). Filter bar ~52px. Back button ~48px.
  const spacerClass = hasSecondaryBar ? 'pt-[108px] sm:pt-[116px]' : 'pt-14';
  return (
    <div className={`min-h-screen flex flex-col ${className || ''}`}>
      <Header
        hasFilter={hasFilter}
        hasBackButton={hasBackButton}
      />
      {/* Spacer to push content below the fixed header */}
      <div className={spacerClass} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default PageLayout;

export type PageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  hasFilter?: boolean;
  hasBackButton?: boolean;
};

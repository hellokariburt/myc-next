import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

function PageLayout({
  children,
  className,
  hasFilter,
  hasMobileFilter,
  hasBackButton,
}: PageLayoutProps) {
  const hasSecondaryBar = hasFilter || hasMobileFilter || hasBackButton;
  // Nav bar = 56px (h-14). Desktop filter bar with labels ~100px. Mobile filter/back button ~48px.
  const spacerClass = hasSecondaryBar ? 'pt-[108px] md:pt-[160px]' : 'pt-14';
  return (
    <div className={`min-h-screen flex flex-col ${className || ''}`}>
      <Header
        hasFilter={hasFilter}
        hasMobileFilter={hasMobileFilter}
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
  hasMobileFilter?: boolean;
  hasBackButton?: boolean;
};

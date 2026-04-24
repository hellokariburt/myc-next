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
  // Nav bar = 56px (h-14). Desktop filter bar ~76px. Mobile filter/back button ~44px.
  const spacerClass = hasSecondaryBar ? 'pt-[100px] md:pt-[132px]' : 'pt-14';
  return (
    <div className={`${className || ''}`}>
      <Header
        hasFilter={hasFilter}
        hasMobileFilter={hasMobileFilter}
        hasBackButton={hasBackButton}
      />
      {/* Spacer to push content below the fixed header */}
      <div className={spacerClass} />
      {children}
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

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
  return (
    <div className={`${className || ''}`}>
      <Header
        hasFilter={hasFilter}
        hasMobileFilter={hasMobileFilter}
        hasBackButton={hasBackButton}
      />
      {/* Spacer to push content below the fixed header */}
      <div className={hasSecondaryBar ? 'pt-[104px] md:pt-[104px]' : 'pt-14'} />
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

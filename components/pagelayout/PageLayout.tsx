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
  return (
    <div className={`${className || ''}`}>
      <Header
        hasFilter={hasFilter}
        hasMobileFilter={hasMobileFilter}
        hasBackButton={hasBackButton}
      />
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

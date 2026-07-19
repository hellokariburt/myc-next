import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

function PageLayout({
  children,
  className,
  hasBackButton,
}: PageLayoutProps) {
  // Nav bar = 56px (h-14); back button bar ~48px. The filter bar this also
  // used to account for is gone. These values are inherited, not re-measured —
  // if header spacing ever looks off, measure it rather than trusting them.
  const spacerClass = hasBackButton ? 'pt-[108px] sm:pt-[116px]' : 'pt-14';
  return (
    <div className={`min-h-screen flex flex-col ${className || ''}`}>
      <Header hasBackButton={hasBackButton} />
      {/* Spacer to push content below the fixed header */}
      <div className={spacerClass} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default PageLayout;

export type PageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  hasBackButton?: boolean;
};

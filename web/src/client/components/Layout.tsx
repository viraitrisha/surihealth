import { ReactNode } from 'react';
import Navigation from './Navbar';  // ← Geen ./client/ nodig
import Footer from './Footer';          // ← Geen ./client/ nodig

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
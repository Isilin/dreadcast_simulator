import { useState, type PropsWithChildren } from 'react';

import { HamburgerButton } from '../HamburgerButton';
import styles from './Sidebar.module.css';

export const Sidebar = ({ children }: PropsWithChildren) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <HamburgerButton isOpen={isSidebarOpen} onClick={handleToggleSidebar} />
      <div
        data-open={isSidebarOpen}
        className={styles.backdrop}
        onClick={handleCloseSidebar}
        aria-hidden="true"
      />
      <div data-open={isSidebarOpen} className={styles.sidebar}>
        {children}
      </div>
    </>
  );
};

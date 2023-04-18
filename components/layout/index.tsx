import React from 'react';
import type { NextPage } from 'next';
import NavBar from '../NavBar';
import Footer from '../Footer';
const Layout: NextPage = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default Layout;

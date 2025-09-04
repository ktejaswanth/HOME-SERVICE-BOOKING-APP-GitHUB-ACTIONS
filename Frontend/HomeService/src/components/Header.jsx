import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}

export default Header;

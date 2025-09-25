import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-secondary-dark border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-1">
              <li>
                <Link 
                  to="/"
                  className={`nav-link rounded-md ${isActive('/') ? 'nav-link-active' : 'hover:text-primary'}`}
                >
                  INÍCIO
                </Link>
              </li>
              <li>
                <Link 
                  to="/minhas-apostas"
                  className={`nav-link rounded-md ${isActive('/minhas-apostas') ? 'nav-link-active' : 'hover:text-primary'}`}
                >
                  MINHAS APOSTAS
                </Link>
              </li>
              <li>
                <Link 
                  to="/torneios"
                  className={`nav-link rounded-md ${isActive('/torneios') ? 'nav-link-active' : 'hover:text-primary'}`}
                >
                  TORNEIOS
                </Link>
              </li>
              <li>
                <Link 
                  to="/cassino"
                  className={`nav-link rounded-md ${isActive('/cassino') ? 'nav-link-active' : 'hover:text-primary'}`}
                >
                  CASSINO
                </Link>
              </li>
            </ul>
          </nav>

          {/* Login Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-primary" />
                  <div className="text-right">
                    <p className="text-sm font-medium">{profile?.fullName}</p>
                    <p className="text-xs text-primary">$ {profile?.senacoins_balance?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="btn bg-warning hover:bg-warning-dark text-secondary-dark text-sm flex items-center space-x-1"
                  >
                    <Settings size={16} />
                    <span>ADMIN</span>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="btn btn-primary text-sm flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>SAIR</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-primary text-sm"
              >
                ENTRAR
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} className="text-primary" />
              ) : (
                <Menu size={24} className="text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary-dark border-t border-primary/20 animate-fade-in-down">
          <div className="container mx-auto px-4 py-3">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/"
                  className={`block py-2 px-4 font-bold rounded ${isActive('/') ? 'bg-primary text-secondary-dark' : 'hover:bg-secondary-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  INÍCIO
                </Link>
              </li>
              <li>
                <Link 
                  to="/minhas-apostas"
                  className={`block py-2 px-4 rounded ${isActive('/minhas-apostas') ? 'bg-primary text-secondary-dark font-bold' : 'hover:bg-secondary-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  MINHAS APOSTAS
                </Link>
              </li>
              <li>
                <Link 
                  to="/torneios"
                  className={`block py-2 px-4 rounded ${isActive('/torneios') ? 'bg-primary text-secondary-dark font-bold' : 'hover:bg-secondary-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  TORNEIOS
                </Link>
              </li>
              <li>
                <Link 
                  to="/cassino"
                  className={`block py-2 px-4 rounded ${isActive('/cassino') ? 'bg-primary text-secondary-dark font-bold' : 'hover:bg-secondary-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  CASSINO
                </Link>
              </li>
              <li>
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center py-2 px-4 bg-secondary-light rounded">
                      <User size={20} className="text-primary mr-2" />
                      <div>
                        <p className="text-sm font-medium">{profile?.fullName}</p>
                        <p className="text-xs text-primary">$ {profile?.senacoins_balance?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block py-2 px-4 bg-warning text-secondary-dark font-bold rounded flex items-center justify-center space-x-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>PAINEL ADMIN</span>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full py-2 px-4 bg-error text-white font-bold rounded flex items-center justify-center space-x-1"
                    >
                      <LogOut size={16} />
                      <span>SAIR</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="block py-2 px-4 bg-primary text-secondary-dark font-bold rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ENTRAR
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
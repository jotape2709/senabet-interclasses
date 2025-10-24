import React from 'react';

interface LoginCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const LoginCard: React.FC<LoginCardProps> = ({ title = 'Login', subtitle, children }) => {
  return (
    <div className="w-full max-w-sm p-8 bg-yellow-100/80 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-yellow-800 text-center">{title}</h1>
      {subtitle && <p className="text-sm text-yellow-700 mb-4 text-center">{subtitle}</p>}
      {children}
    </div>
  );
};

export default LoginCard;

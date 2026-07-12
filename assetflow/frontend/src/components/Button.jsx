import React from 'react';
import { ThemeConfig } from './ThemeConfig';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  className = '' 
}) => {
  const baseStyle = {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    borderRadius: ThemeConfig.borderRadius.md,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    fontFamily: ThemeConfig.fonts.main,
    color: '#ffffff'
  };

  const variantStyles = {
    primary: {
      backgroundColor: ThemeConfig.colors.primary,
    },
    secondary: {
      backgroundColor: ThemeConfig.colors.secondary,
    },
    danger: {
      backgroundColor: ThemeConfig.colors.danger,
    },
    warning: {
      backgroundColor: ThemeConfig.colors.warning,
      color: '#111827'
    }
  };

  const finalStyle = {
    ...baseStyle,
    ...variantStyles[variant]
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={finalStyle}
      className={`assetflow-btn ${className}`}
    >
      {children}
    </button>
  );
};

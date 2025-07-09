import React from 'react';
import { LOGO_IMAGE_URL } from '../constants';

interface LogoProps {
  className?: string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', alt = 'RENZA Planejados Logo' }) => {
  // The logo is restored based on the user's latest request.
  // It uses a centralized constant for the URL and flexible className for styling,
  // avoiding hardcoded styles.
  if (!LOGO_IMAGE_URL) return null; // Render nothing if the logo URL is not set

  return (
    <img 
      src={LOGO_IMAGE_URL}
      alt={alt}
      className={className}
    />
  );
};

export default Logo;
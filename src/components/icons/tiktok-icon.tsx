import React from 'react';

interface TiktokIconProps {
  className?: string;
  size?: number;
  color?: string;
}

const TiktokIcon: React.FC<TiktokIconProps> = ({ 
  className = "", 
  size = 24, 
  color = "currentColor" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
      <circle cx="9" cy="16" r="4"></circle>
      <path d="M13 12c0-2.2 1.8-4 4-4"></path>
    </svg>
  );
};

export default TiktokIcon;
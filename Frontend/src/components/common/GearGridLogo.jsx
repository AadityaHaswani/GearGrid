export default function GearGridLogo({ size = 24, className = '', color = '#F4F4F5', accentColor = '#F59E0B' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 120 120" 
      width={size} 
      height={size} 
      fill="none"
      className={className}
      aria-label="GearGrid Logo"
    >
      {/* Outer Mechanical Gear Wheel */}
      <path 
        fill={color} 
        fillRule="evenodd" 
        d="
          M 55 12 L 65 12 L 66 21 A 40 40 0 0 1 76 25 L 83 19 L 90 26 L 85 33 A 40 40 0 0 1 90 43 L 99 44 L 99 56 L 90 57 A 40 40 0 0 1 85 67 L 90 74 L 83 81 L 76 75 A 40 40 0 0 1 66 79 L 65 88 L 55 88 L 54 79 A 40 40 0 0 1 44 75 L 37 81 L 30 74 L 35 67 A 40 40 0 0 1 30 57 L 21 56 L 21 44 L 30 43 A 40 40 0 0 1 35 33 L 30 26 L 37 19 L 44 25 A 40 40 0 0 1 54 21 Z
          M 60 25 A 25 25 0 1 0 85 50 L 73 50 A 13 13 0 1 1 60 37 Z
        " 
      />

      {/* Inner Mechanical Gear Cogs along G Arc */}
      <path 
        fill={color} 
        d="
          M 42 34 L 46 27 L 51 30 L 48 37 Z
          M 33 44 L 25 41 L 27 36 L 35 39 Z
          M 31 53 L 23 53 L 23 59 L 31 59 Z
          M 33 67 L 25 70 L 27 75 L 35 72 Z
          M 43 77 L 46 84 L 51 81 L 48 75 Z
        " 
      />

      {/* Stylized G Horizontal Crossbar & Right Terminal */}
      <path 
        fill={color} 
        d="
          M 50 44
          L 86 44
          L 86 66
          L 75 66
          L 75 54
          L 50 54
          Z
        " 
      />

      {/* Center Circular Negative Space Core */}
      <circle cx="60" cy="50" r="10" fill={color} />

      {/* Signature Warm Amber Accent */}
      <path 
        d="M 54 54 L 75 54 L 75 66 L 68 73 L 62 73" 
        stroke={accentColor} 
        strokeWidth="3.4" 
        strokeLinecap="square" 
        strokeLinejoin="miter" 
        strokeMiterlimit="4"
      />
    </svg>
  );
}

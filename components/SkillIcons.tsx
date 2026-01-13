import React from 'react';

export const SkillIcon = ({ id, className = "w-6 h-6" }: { id: string; className?: string }) => {
  const props = { className, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" };
  
  switch (id) {
    // --- NARUTO ---
    case 'n_1': // Combo (Fist)
      return (
        <svg {...props}>
           <path d="M6 13c0 1-2 2-2 4s2 3 4 3h4c2 0 4-2 4-4v-4l-3-4-4 2-3-2v9" />
           <path d="M15 12l4-2 2 3-3 4-3-1" />
        </svg>
      );
    case 'n_2': // Rasengan (Spiral)
      return (
        <svg {...props}>
           <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
           <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12" />
           <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
           <path d="M12 2v4 M12 18v4 M2 12h4 M18 12h4" strokeOpacity="0.5"/>
        </svg>
      );
    case 'n_3': // Shadow Clones (Multi-person)
      return (
        <svg {...props}>
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
        </svg>
      );
    case 'n_4': // Sage Mode (Eye)
      return (
        <svg {...props}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M8 12h8" strokeWidth="3" />
        </svg>
      );
    case 'n_5': // Rasenshuriken
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2l2 6h6l-4 4 2 6-6-3-6 3 2-6-4-4h6z" />
        </svg>
      );
    case 'n_6': // Harem Jutsu (Heart)
      return (
        <svg {...props}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 5 13 6 11 6" strokeWidth="1"/>
        </svg>
      );
    case 'n_7': // Tailed Beast Bomb (Sphere + Explosion)
      return (
        <svg {...props}>
           <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.3" />
           <path d="M12 4v16" strokeWidth="1" />
           <path d="M4 12h16" strokeWidth="1" />
           <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );

    // --- SASUKE ---
    case 's_1': // Lion Combo (Claw)
       return (
        <svg {...props}>
          <path d="M4 4l6 16" />
          <path d="M12 2l0 20" />
          <path d="M20 4l-6 16" />
        </svg>
       );
    case 's_2': // Fireball
       return (
        <svg {...props}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3z" />
        </svg>
       );
    case 's_3': // Chidori (Lightning)
       return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
       );
    case 's_4': // Susanoo (Ribs/Shield)
       return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M8 10h8" />
          <path d="M8 14h8" />
          <path d="M12 6v12" />
        </svg>
       );
    case 's_5': // Indra Arrow
       return (
        <svg {...props}>
           <path d="M12 2l-5 5h3v8h4V7h3L12 2z" />
           <path d="M12 15v7" />
           <path d="M9 19l3 3 3-3" />
           <path d="M5 10l-3 3 3 3" />
           <path d="M19 10l3 3-3 3" />
        </svg>
       );
    case 's_6': // Amaterasu (Eye + Flames)
       return (
        <svg {...props}>
           <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
           <circle cx="12" cy="12" r="3" fill="currentColor" />
           <path d="M12 16c-2 0-3 3-3 3s1 2 3 2 3-2 3-2-1-3-3-3" />
        </svg>
       );
    case 's_7': // Kirin (Dragon/Lightning)
       return (
        <svg {...props}>
           <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
           <path d="M12 22v-5" />
        </svg>
       );

    // --- KAKASHI ---
    case 'k_1': // Kunai
       return (
        <svg {...props}>
          <path d="M14.5 2L9 2l-2 8 5 8 5-8-2.5-8z" />
          <path d="M12 18v4" />
          <circle cx="12" cy="22" r="1" />
        </svg>
       );
    case 'k_2': // Mud Wall
       return (
        <svg {...props}>
           <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z" />
           <path d="M7 16h4" />
           <path d="M13 16h4" />
           <path d="M9 11v5" />
           <path d="M15 11v5" />
        </svg>
       );
    case 'k_3': // Raikiri (Hand + Flash)
       return (
        <svg {...props}>
          <path d="M18 6L6 18" />
          <path d="M21 3l-9 9" />
          <path d="M3 21l9-9" />
          <circle cx="12" cy="12" r="2" />
        </svg>
       );
    case 'k_4': // Water Dragon
       return (
        <svg {...props}>
          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
       );
    case 'k_5': // Kamui
       return (
        <svg {...props}>
           <circle cx="12" cy="12" r="10" />
           <path d="M12 12 L12 2" />
           <path d="M12 12 L20.66 7" />
           <path d="M12 12 L20.66 17" />
           <path d="M12 12 L12 22" />
           <path d="M12 12 L3.34 17" />
           <path d="M12 12 L3.34 7" />
        </svg>
       );
    case 'k_6': // Ninken (Dog/Paw)
       return (
        <svg {...props}>
           <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
           <path d="M9 12v3" />
           <path d="M15 12v3" />
           <path d="M8 22l-2-2" />
           <path d="M16 22l2-2" />
        </svg>
       );
    case 'k_7': // Purple Lightning
       return (
        <svg {...props}>
           <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2.5"/>
        </svg>
       );
    
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
  }
}
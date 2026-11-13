/* eslint-disable react-refresh/only-export-components */
/* Inline SVG icon set — replaces the bundled FontAwesome folder.
   Every icon is a plain component that inherits `currentColor`. */

function Svg({ children, size = 20, strokeWidth = 1.7, fill = "none", className, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Cart = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
  </Svg>
);

export const Search = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Svg>
);

export const Menu = (p) => (
  <Svg {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Svg>
);

export const Close = (p) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Minus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const Check = (p) => (
  <Svg {...p}>
    <path d="m20 6-11 11-5-5" />
  </Svg>
);

export const Trash = (p) => (
  <Svg {...p}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
  </Svg>
);

export const Heart = (p) => (
  <Svg {...p}>
    <path d="M12 21s-7.5-4.6-9.7-9A5.3 5.3 0 0 1 12 6.5 5.3 5.3 0 0 1 21.7 12c-2.2 4.4-9.7 9-9.7 9Z" />
  </Svg>
);

export const ChevronLeft = (p) => (
  <Svg {...p}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);

export const ChevronRight = (p) => (
  <Svg {...p}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowUp = (p) => (
  <Svg {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Svg>
);

export const Truck = (p) => (
  <Svg {...p}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </Svg>
);

export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5.5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const Sparkles = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 13.7 9l5.3 1.8L13.7 13 12 18.5 10.3 13 5 11.2 10.3 9 12 3.5Z" />
    <path d="M19 4.5 19.7 6.5 21.5 7 19.7 7.7 19 9.7 18.3 7.7 16.5 7 18.3 6.5 19 4.5Z" />
  </Svg>
);

export const Watch = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="6" />
    <path d="M12 9.5V12l1.8 1.2M9 6 9.5 3h5L15 6M9 18l.5 3h5l.5-3" />
  </Svg>
);

export const Headphones = (p) => (
  <Svg {...p}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 14h3v5H5.5A1.5 1.5 0 0 1 4 17.5V14ZM20 14h-3v5h1.5a1.5 1.5 0 0 0 1.5-1.5V14Z" />
  </Svg>
);

export const Shirt = (p) => (
  <Svg {...p}>
    <path d="M9 3 5 5 3 9l3 2v10h12V11l3-2-2-4-4-2-3 2-3-2Z" />
  </Svg>
);

export const Laptop = (p) => (
  <Svg {...p}>
    <rect x="4" y="5" width="16" height="11" rx="1.5" />
    <path d="M2 19h20l-1.5-3H3.5L2 19Z" />
  </Svg>
);

export const Sofa = (p) => (
  <Svg {...p}>
    <path d="M4 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
    <path d="M4 12a2 2 0 0 0-2 2v3h20v-3a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1H6v-1a2 2 0 0 0-2-2Z" />
    <path d="M6 20v-3M18 20v-3" />
  </Svg>
);

export const Bag = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l1 12H4L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const Package = (p) => (
  <Svg {...p}>
    <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </Svg>
);

export const Layers = (p) => (
  <Svg {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </Svg>
);

export const Users = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0M16 5.2A3.2 3.2 0 0 1 16 11M17.5 20a6 6 0 0 0-2-4.5" />
  </Svg>
);

export const Mail = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

export const Phone = (p) => (
  <Svg {...p}>
    <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />
  </Svg>
);

export const MapPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const Clock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </Svg>
);

export const Refresh = (p) => (
  <Svg {...p}>
    <path d="M20 11a8 8 0 0 0-13.7-5.3L4 8M4 5v3h3" />
    <path d="M4 13a8 8 0 0 0 13.7 5.3L20 16M20 19v-3h-3" />
  </Svg>
);

export const Filter = (p) => (
  <Svg {...p}>
    <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
  </Svg>
);

export const Quote = (p) => (
  <Svg {...p}>
    <path d="M9 7c-2.5 1-4 3.4-4 6v4h5v-5H7c0-1.8 1-3 2.5-3.6L9 7ZM19 7c-2.5 1-4 3.4-4 6v4h5v-5h-3c0-1.8 1-3 2.5-3.6L19 7Z" />
  </Svg>
);

export const Alert = (p) => (
  <Svg {...p}>
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 10v4M12 17.5v.01" />
  </Svg>
);

export const Info = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8v.01" />
  </Svg>
);

export const Spinner = ({ size = 20, className = "", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`anim-spin ${className}`}
    aria-hidden="true"
    {...rest}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Instagram = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5v.01" />
  </Svg>
);

export const Facebook = (p) => (
  <Svg {...p}>
    <path d="M14 8.5h2.5V5.5H14A3.5 3.5 0 0 0 10.5 9v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3V9a.5.5 0 0 1 .5-.5Z" />
  </Svg>
);

export const Twitter = (p) => (
  <Svg {...p}>
    <path d="M4 4h4.2l4 5.4L17 4h3l-6.3 7.5L20.5 20H16l-4.3-5.8L6.8 20H4l6.6-7.9L4 4Z" />
  </Svg>
);

/** Solid star — used by the rating widget. */
export const Star = ({ size = 16, filled = true, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8L12 3.6Z" />
  </svg>
);

const CATEGORY_ICONS = {
  watch: Watch,
  headphones: Headphones,
  shirt: Shirt,
  laptop: Laptop,
  sofa: Sofa,
  bag: Bag,
};

export function categoryIcon(name) {
  return CATEGORY_ICONS[name] || Sparkles;
}

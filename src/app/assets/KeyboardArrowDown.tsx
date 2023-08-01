export default function KeyboardArrowDown(props: KeyboardArrowDownProps) {
  return (
    <div className={`${props.className}`}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2_147)">
          <path
            d="M 14.82 15.18 L 24 24.34 L 33.18 15.18 L 36 18 L 24 30 L 12 18 L 14.82 15.18 Z"
            fill="#1C1C1C"
           />
        </g>
        <defs>
          <clipPath id="clip0_2_147">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

KeyboardArrowDown.defaultProps = {
  className: "",
};

interface KeyboardArrowDownProps {
  className: string;
}

/**
 * This component was generated from Figma with FireJet.
 * Learn more at https://www.firejet.io
 *
 * README:
 * The output code may look slightly different when copied to your codebase. To fix this:
 * 1. Include the necessary fonts. The required fonts are imported from public/index.html
 * 2. Include the global styles. They can be found in App.css
 *
 * Note: Step 2 is not required for tailwind.css output
 */

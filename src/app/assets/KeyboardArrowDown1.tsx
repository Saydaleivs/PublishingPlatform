export default function KeyboardArrowDown1(props: KeyboardArrowDown1Props) {
  return (
    <div className={`${props.className}`}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 49 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2_150)">
          <path
            d="M 16.238 13 L 25.531 22.16 L 34.824 13 L 37.679 15.82 L 25.531 27.82 L 13.383 15.82 L 16.238 13 Z"
            fill="#1C1C1C"
           />
        </g>
        <defs>
          <clipPath id="clip0_2_150">
            <rect
              width="48.5926"
              height="48"
              fill="white"
              transform="translate(0.222229)"
             />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

KeyboardArrowDown1.defaultProps = {
  className: "",
};

interface KeyboardArrowDown1Props {
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

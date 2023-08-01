export default function Check(props: CheckProps) {
  return (
    <div className={`${props.className}`}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 37 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 12.069 25.076 L 7.519 20.459 L 5.97 22.02 L 12.069 28.209 L 25.161 14.923 L 23.623 13.362 L 12.069 25.076 Z"
          fill="white"
         />
      </svg>
    </div>
  );
}

Check.defaultProps = {
  className: "",
};

interface CheckProps {
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

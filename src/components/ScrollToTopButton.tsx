import { useEffect, useState, useCallback } from "react";

type Props = {
  hideOnRoutes?: string[]; // e.g., ["/auth"]
};

const ScrollToTopButton: React.FC<Props> = ({ hideOnRoutes = [] }) => {
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(() => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    setVisible(scrolled > 200);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Light-brown theme with subtle shadow and hover
  // Uses Tailwind; adjust colors if custom palette exists
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      className={[
        // positioning
        "fixed right-4 bottom-4 z-50",
        // visibility + transition
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none",
        "transition-all duration-300 ease-out",
        // size + layout
        "h-11 w-11 rounded-full grid place-items-center",
        // light brown base + hover/active
        "bg-amber-200 text-amber-900",
        "shadow-md hover:shadow-lg",
        "hover:bg-amber-300 active:bg-amber-400",
        // subtle border ring for focus
        "ring-1 ring-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
      ].join(" ")}
    >
      {/* Up arrow icon (chevron) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M6.7 14.7a1 1 0 0 1-1.4-1.4l6-6a1 1 0 0 1 1.4 0l6 6a1 1 0 1 1-1.4 1.4L12 9.41l-5.3 5.3z" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;

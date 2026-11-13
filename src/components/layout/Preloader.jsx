import { useEffect, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader ${done ? "is-done" : ""}`} aria-hidden={done}>
      <div className="preloader__inner">
        <span className="preloader__monogram">H</span>
        <span className="preloader__bar">
          <span />
        </span>
      </div>
    </div>
  );
}

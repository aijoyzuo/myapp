// src/component/Lightbox.jsx
import { useEffect } from "react";

export default function Lightbox({
  isOpen,
  images = [],
  index = 0,
  onClose,
  onPrev,
  onNext,
  showBadge = false,
  srcResolver,      
  altResolver 
}) {
  // 鍵盤事件
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !images[index]) return null;

  const current = images[index];

   const src = srcResolver
    ? srcResolver(current)
    : current.image || current.src;

    const alt = altResolver
  ? altResolver(current)
  : (current.title || "");
 

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button
        className="lightbox-btn lightbox-prev"
        aria-label="上一張"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        ‹
      </button>

      <div className="lightbox-img-wrapper" onClick={(e) => e.stopPropagation()}>
        {showBadge && (
          <div className="lightbox-badge">No.{index + 1}</div>
        )}
        <img src={src} alt={alt} className="lightbox-img" />
      </div>

      <button
        className="lightbox-btn lightbox-next"
        aria-label="下一張"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        ›
      </button>

      <button
        className="lightbox-close"
        aria-label="關閉"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        ×
      </button>
    </div>
  );
}

// src/component/Lightbox.jsx
import { useEffect, useState, useRef } from "react";

export default function Lightbox({
  isOpen,
  images = [],
  index = 0,
  onClose,
  onPrev,
  onNext,
  showBadge = false,
  srcResolver,
  altResolver,
  metaResolver,
  actionsResolver,
  closeLabel = "關閉",
}) {
  const imgRef = useRef(null);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !images[index]) return null;
  const item = images[index];

  const src = srcResolver ? srcResolver(item) : item.image || item.src;
  const alt = altResolver ? altResolver(item) : (item.title || "");
  const meta = metaResolver ? metaResolver(item) : [];
  const actions = actionsResolver ? actionsResolver(item, index) : [];

  // 圖片載入後依天然尺寸判斷是否算小圖
  const handleImgLoad = (e) => {
    const nw = e.target.naturalWidth;
    const nh = e.target.naturalHeight;
    // 你可以調整這個門檻；這裡以寬 < 320 或 高 < 320 視為小圖
    const SMALL_W = 320;
    const SMALL_H = 320;
    setIsSmall(nw < SMALL_W || nh < SMALL_H);
  };

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <button
        className="lightbox-btn lightbox-prev"
        aria-label="上一張"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >‹</button>

      <div className="lightbox-img-wrapper" onClick={(e) => e.stopPropagation()}>
        {showBadge && <div className="lightbox-badge">No.{index + 1}</div>}

        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleImgLoad}
          className={`lightbox-img ${isSmall ? 'small' : ''}`}
        />

        {/* 底部資訊框 */}
        <div className="lightbox-info overlay" onClick={(e) => e.stopPropagation()}>
          {item.title && (
            <h6 className="lightbox-title mb-2 fw-bold">{item.title}</h6>
          )}

          {Array.isArray(meta) && meta.length > 0 && (
            <ul className="lightbox-meta list-unstyled d-flex flex-wrap gap-2 mb-2">
              {meta.map(({ label, value }, i) => (
                <li key={i} className="lightbox-meta__chip">
                  <span className="lightbox-meta__label">{label}</span>
                  <span className="lightbox-meta__value">{value}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="d-flex justify-content-end gap-2 flex-wrap">
            {actions.map((a, i) =>
              a.href ? (
                <a
                  key={i}
                  className={`btn ${a.variant === "secondary" ? "btn-outline-light" : "btn-danger"}`}
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {a.label}
                </a>
              ) : (
                <button
                  key={i}
                  className={`btn ${a.variant === "secondary" ? "btn-outline-light" : "btn-danger"}`}
                  onClick={(e) => { e.stopPropagation(); a.onClick?.(item, index); }}
                >
                  {a.label}
                </button>
              )
            )}
            <button className="btn btn-outline-light" onClick={(e) => { e.stopPropagation(); onClose(); }}>
              {closeLabel}
            </button>
          </div>
        </div>
      </div>

      <button
        className="lightbox-btn lightbox-next"
        aria-label="下一張"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >›</button>

      <button
        className="lightbox-close"
        aria-label="關閉"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >×</button>
    </div>
  );
}

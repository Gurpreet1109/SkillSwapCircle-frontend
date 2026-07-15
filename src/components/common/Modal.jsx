import { useEffect } from "react";

const Modal = ({ show, onClose, title, children, size = "md", footer }) => {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  const maxWidths = { sm: 400, md: 560, lg: 720, xl: 900 };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div style={{
        position: "fixed", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", zIndex: 1050, padding: "1rem",
      }}>
        <div
          className="glass-card animate-fade-up"
          style={{ width: "100%", maxWidth: maxWidths[size], maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        >
          {/* Header */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h5 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{title}</h5>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.3rem", lineHeight: 1 }}
            >×</button>
          </div>
          {/* Body */}
          <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
            {children}
          </div>
          {/* Footer */}
          {footer && (
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;

const Input = ({
  label,
  error,
  hint,
  icon,
  type = "text",
  className = "",
  as = "input",
  rows = 3,
  ...props
}) => {
  const Tag = as;
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="d-block mb-1" style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-muted)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-dim)", pointerEvents: "none", fontSize: "1rem",
          }}>
            {icon}
          </span>
        )}
        <Tag
          type={type}
          rows={rows}
          className="input-dark"
          style={{ paddingLeft: icon ? "2.5rem" : "1rem", borderColor: error ? "var(--danger)" : undefined }}
          {...props}
        />
      </div>
      {error && <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: 4 }}>{error}</p>}
      {hint && !error && <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginTop: 4 }}>{hint}</p>}
    </div>
  );
};

export default Input;

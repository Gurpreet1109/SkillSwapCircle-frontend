const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const sizes = { sm: "py-1 px-3 fs-sm", md: "py-2 px-4", lg: "py-3 px-5 fs-5" };
  const variants = {
    primary: "btn-glow",
    outline: "btn-outline-glow",
    danger: "btn btn-danger border-0",
    ghost: "btn border-0 text-muted",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? "w-100" : ""} d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
      style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
            borderTop: "2px solid white", borderRadius: "50%",
            animation: "spin 0.7s linear infinite", display: "inline-block"
          }}
        />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;

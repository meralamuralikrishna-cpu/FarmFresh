import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  as: Tag = "button",
  className = "",
  ...props
}) {
  return (
    <Tag className={`btn btn--${variant} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

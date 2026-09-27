const variants = {
  primary:
    "border-transparent bg-pasture text-white hover:bg-pasture-deep",
  ghost:
    "border-line bg-transparent text-ink hover:border-pasture hover:text-pasture-deep",
  light: "border-transparent bg-white text-pasture-deep hover:bg-foam",
};

export default function Button({
  children,
  variant = "primary",
  as: Tag = "button",
  className = "",
  ...props
}) {
  return (
    <Tag
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] px-[1.4rem] py-[0.85rem] text-[0.95rem] font-semibold tracking-[0.01em] transition-[transform,background,color,border-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0",
        variants[variant] ?? variants.primary,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}

function Select({
  children,
  className = "",
  ...props
}) {
  return (
    <select
      className={`
        border
        rounded
        w-full
        p-2
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
function Input({
  className = "",
  ...props
}) {
  return (
    <input
      className={`
        border
        rounded
        p-2
        w-64
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;
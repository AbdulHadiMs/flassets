function Input({
  className = "",
  ...props
}) {
  return (
    <input
      className={`
        border
        rounded
        w-full
        p-2
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;
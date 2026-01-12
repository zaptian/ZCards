const CustomImageInput = ({
  type = "text",
  inputRef,
  input_classname = "",
  input_placeholder = "",
  search_text,
  onChange_Access,
  icon = null,
  iconpresent = false,
  iconPosition = "left", // "left" | "right"
  iconStyle = "",
  componentStyle = "",
}) => {
  return (
    <div className={`relative ${componentStyle}`}>
      {/* Icon */}
      {iconpresent && (
        <span
          className={`absolute top-1/2 -translate-y-1/2
            ${iconStyle}
            ${iconPosition === "left" ? "left-3" : "right-3"}
          `}
        >
          {icon}
        </span>
      )}

      {/* Input */}
      <input
        ref={inputRef}
        type={type}
        className={`
          ${input_classname}
          ${iconpresent && iconPosition === "left" ? "pl-[40px]" : ""}
          ${iconpresent && iconPosition === "right" ? "pr-[40px]" : ""}
        `}
        placeholder={input_placeholder}
        value={search_text}
        onChange={onChange_Access}
      />
    </div>
  );
};

export default CustomImageInput;

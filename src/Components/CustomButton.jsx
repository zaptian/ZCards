const CustomButton = ({
  label = "",
  iconSrc = null,
  iconSize = "w-[24px] h-[24px]",
  onClick = () => {},
  disabled = false,
  textColor = "",
  btn_animation = "",
  icon_animation = "",
  btn_bg_color = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group ${btn_bg_color}  ${textColor} flex items-center justify-center transform transition-all duration-300 ease-in-out ${btn_animation}`}
    >
      {/* Icon  */}
      {iconSrc && (
        <span
          className={`${iconSize} transform transition-transform duration-200 ease-in-out ${icon_animation}`}
        >
          {iconSrc}
        </span>
      )}

      {/* Label */}
      {label && (
        <span
          className={`transform transition-transform duration-200 ease-in-out group-hover:${btn_animation}`}
        >
          {label}
        </span>
      )}
    </button>
  );
};

export default CustomButton;

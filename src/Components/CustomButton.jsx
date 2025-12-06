const CustomButton = ({
  label = "",
  label_style = "",
  button_style = "",
  img_src = null, // React component (SVG)
  img_style = "",
  onClick = () => {},
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer
                  transition-all duration-150
                  hover:drop-shadow-[0_0_4px_rgba(64,64,64,0.4)]
                  ${button_style}`}
    >
      {/* Render SVG */}
      {img_src && (
        <div style={img_style} className={`flex items-center justify-center`}>
          {img_src}
        </div>
      )}

      {/* Label */}
      {label && <span className={`${label_style}`}>{label}</span>}
    </button>
  );
};

export default CustomButton;

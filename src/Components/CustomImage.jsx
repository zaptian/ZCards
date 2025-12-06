const CustomImage = ({
  src,
  alt = "",
  width = "100px",
  height = "100px",
  frameClassNmae = "",
  imgClassName = "",
}) => {
  return (
    <div className={`overflow-hidden ${frameClassNmae}`}>
      {src && (
        <div
          className={`w-full h-full object-cover ${imgClassName}`}
          style={{ width, height }}
        >
          {src}
        </div>
      )}
    </div>
  );
};

export default CustomImage;

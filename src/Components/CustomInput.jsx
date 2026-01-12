const CustomInput = ({
  type = "text",
  useRef,
  input_classname = "",
  input_placeholder = "",
  search_text,
  onChange_Access,
}) => {
  return (
    <div>
      <input
        ref={useRef}
        type={type}
        className={`${input_classname}`}
        placeholder={input_placeholder}
        value={search_text}
        onChange={onChange_Access}
      />
    </div>
  );
};

export default CustomInput;

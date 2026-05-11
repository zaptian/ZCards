const CustomLabel = ({
  label_text,
  label_style = "",
  title,
  required = false,
}) => {
  return (
    <div title={title} className={`flex items-center gap-1 ${label_style}`}>
      <span title={label_text}>{label_text}</span>

      {required && (
        <span className="text-red-500 text-sm font-semibold" aria-hidden="true">
          *
        </span>
      )}
    </div>
  );
};

export default CustomLabel;

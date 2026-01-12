const CustomLabel = ({ label_text, label_style }) => {
  return <div className={`${label_style}`}>{label_text}</div>;
};

export default CustomLabel;

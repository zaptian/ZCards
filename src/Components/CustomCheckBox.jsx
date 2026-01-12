import React, { useEffect, useRef } from "react";

export default function CustomCheckBox({
  checked,
  defaultChecked,
  onChange,
  label,
  indeterminate = false,
  disabled = false,
  id,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  return (
    <label htmlFor={id}>
      <input
        id={id}
        ref={ref}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
}

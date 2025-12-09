const TextArea = ({ className, name, type, label, value, onChange, decoration, disabled }) => {
  const classes = `flex justify-end flex-row-reverse sm:w-2/3 rounded-2xl border-solid border-2 border-primary mb-3 sm:mb-0
                  ${className || ""}`;

  const renderInputGroup = () => (
    <div className={classes}>
      <textarea
        id={name}
        className="w-full rounded-2xl text-secondary"
        name={name}
        value={value}
        type={type}
        placeholder={label}
        aria-label={label}
        onChange={onChange}
      />

      <div
        className={`flex items-center px-4 sm:px-6 py-2 sm:py-3
          ${disabled ? "bg-gray-200" : ""} `}
      >
        {decoration}
      </div>
    </div>
  );

  const renderInput = () => (
    <textarea
      id={name}
      className="rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary"
      name={name}
      value={value}
      type={type}
      placeholder={label}
      aria-label={label}
      onChange={onChange}
    />
  );

  return decoration ? renderInputGroup() : renderInput();
};

export default TextArea;

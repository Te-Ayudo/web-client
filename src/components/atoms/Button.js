const Button = ({ className, href, onClick, children, fs, bg, tc, decoration, disabled = false, ...props }) => {
  const classes = `btn-base
                  ${fs || "text-[16px]"} sm:text-[20px] lg:text-[24px]
                  ${bg || "bg-primary"}
                  ${tc || "text-white"}
                  ${className || ""}`;

  const renderButton = () => (
    <button className={`${classes} active:bg-opacity-80`} onClick={onClick} disabled={disabled} {...props}>
      <span>{children}</span>
    </button>
  );

  const renderLink = () => (
    <a href={href} onClick={onClick} className={`flexCenter ${classes} ${className || ""}`} {...props}>
      <span>{children}</span>
    </a>
  );

  const renderLinkGroup = () => (
    <a href={href} onClick={onClick} className={`flexCenter text-primary ${className || ""}`} {...props}>
      <i className={`flex items-center px-4 sm:px-6 py-2 sm:py-3`}>{decoration}</i>
      <span>{children}</span>
    </a>
  );

  return href ? (decoration ? renderLinkGroup() : renderLink()) : renderButton();
};

export default Button;

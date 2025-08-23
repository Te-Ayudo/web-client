const Main = ({ header, children, footer, isSticky = false }) => {
  return (
    <>
      {header}
      <main className={isSticky ? "mt-[72px] sm:mt-[120px]" : ""}>{children}</main>
      {footer}
    </>
  );
};

export default Main;

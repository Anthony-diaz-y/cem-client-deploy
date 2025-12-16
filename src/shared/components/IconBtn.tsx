interface IconBtnProps {
  text?: string;
  onclick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  outline?: boolean;
  customClasses?: string;
  type?: "button" | "submit" | "reset";
}

export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}: IconBtnProps) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center justify-center outline-none ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 hover:bg-black hover:text-yellow-50 duration-300 ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline && "text-yellow-50"}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}

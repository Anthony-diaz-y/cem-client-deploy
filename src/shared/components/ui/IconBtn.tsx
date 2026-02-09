interface IconBtnProps {
  text?: string;
  onclick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  outline?: boolean;
  customClasses?: string;
  type?: "button" | "submit" | "reset";
}

const IconBtn = ({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}: IconBtnProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center justify-center outline-none ${outline ? "border-2 border-cem-primary bg-transparent text-cem-primary" : "bg-cem-primary text-white"
        } cursor-pointer gap-x-2 rounded-xl py-2.5 px-6 font-bold hover:bg-cem-primary-dark hover:shadow-lg hover:shadow-cem-primary/20 duration-300 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default IconBtn;


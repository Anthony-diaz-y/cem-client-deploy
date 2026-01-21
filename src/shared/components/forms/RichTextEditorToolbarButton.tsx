import { IconType } from "react-icons";

interface ToolbarButtonProps {
  icon: IconType;
  onClick: () => void;
  isActive?: boolean;
  title: string;
  disabled?: boolean;
}

const ToolbarButton = ({
  icon: Icon,
  onClick,
  isActive = false,
  title,
  disabled = false
}: ToolbarButtonProps) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded transition-colors ${
      isActive
        ? "bg-yellow-50/20 text-yellow-50"
        : "text-richblack-300 hover:bg-richblack-600 hover:text-richblack-5"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    title={title}
  >
    <Icon className="text-xl" />
  </button>
);

export default ToolbarButton;


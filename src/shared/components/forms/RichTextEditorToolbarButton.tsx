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
    className={`p-1.5 rounded-lg transition-all ${isActive
        ? "bg-white/20 text-white"
        : "text-white/80 hover:bg-white/10 hover:text-white"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "active:scale-95"}`}
    title={title}
  >
    <Icon className="text-xl" />
  </button>
);

export default ToolbarButton;


import { MdOutlineInfo } from "react-icons/md";

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  return (
    <div className="tooltip">
      <MdOutlineInfo />
      <span className="tooltiptext">{text}</span>
    </div>
  );
}

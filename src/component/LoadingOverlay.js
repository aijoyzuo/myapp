import { PulseLoader } from "react-spinners";

export default function LoadingOverlay({ show = false, text = '載入中...' }) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <PulseLoader size={15} color="#6e340d" />
      <p>{text}</p>
    </div>
  );
}
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

const TOAST_STYLES = {
  success: {
    container:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-100",
    close:
      "hover:bg-green-100 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400",
    Icon: CheckCircle2,
  },
  error: {
    container:
      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-100",
    close:
      "hover:bg-red-100 dark:hover:bg-red-800/30 text-red-600 dark:text-red-400",
    Icon: AlertCircle,
  },
  warning: {
    container:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-100",
    close:
      "hover:bg-yellow-100 dark:hover:bg-yellow-800/30 text-yellow-600 dark:text-yellow-400",
    Icon: Info,
  },
};

const ToastItem = ({ message, type = "error", onClose }) => {
  const styles = TOAST_STYLES[type] || TOAST_STYLES.error;
  const Icon = styles.Icon;

  return (
    <div
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-2xl shadow-lg
        border backdrop-blur-md
        animate-in fade-in slide-in-from-right-4 duration-300
        ${styles.container}
      `}
    >
      <div className="shrink-0">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="flex-1 text-xs font-bold leading-tight tracking-tight">
        {message}
      </div>
      <button
        onClick={onClose}
        className={`p-1 rounded-lg transition-all duration-200 active:scale-90 ${styles.close}`}
        aria-label="Close toast"
      >
        <X size={14} strokeWidth={3} />
      </button>
    </div>
  );
};

export default ToastItem;

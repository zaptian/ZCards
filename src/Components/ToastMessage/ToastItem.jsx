const TOAST_STYLES = {
  success: {
    container:
      "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-200",
    close: "text-green-500 hover:text-green-700",
  },

  error: {
    container:
      "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200",
    close: "text-red-500 hover:text-red-700",
  },

  warning: {
    container:
      "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-200",
    close: "text-yellow-500 hover:text-yellow-700",
  },
};

const ToastItem = ({ message, type = "error", onClose }) => {
  const styles = TOAST_STYLES[type] || TOAST_STYLES.error;

  return (
    <div
      className={`
        flex items-start gap-3
        px-4 py-3 rounded-lg shadow-md
        border
        animate-slide-in
        ${styles.container}
      `}
    >
      <div className="flex-1 text-sm leading-snug">{message}</div>

      <button
        onClick={onClose}
        className={styles.close}
        aria-label="Close toast"
      >
        ✕
      </button>
    </div>
  );
};

export default ToastItem;

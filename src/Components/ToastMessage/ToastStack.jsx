import ToastItem from "./ToastItem";

const ToastStack = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-[320px]">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastStack;

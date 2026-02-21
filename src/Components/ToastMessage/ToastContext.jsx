import { createContext, useContext, useCallback, useState } from "react";
import ToastStack from "./ToastStack";

const ToastContext = createContext(null);

const MAX_TOASTS = 3;
const TOAST_DURATION = 3000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type) => {
      const id = crypto.randomUUID();

      setToasts((prev) => {
        const updated = [...prev, { id, message, type }];
        return updated.slice(-MAX_TOASTS);
      });

      setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
};

/*
addToast("File uploaded successfully", "success");
addToast("Failed to upload file", "error");
addToast("Network is slow", "warning");
*/

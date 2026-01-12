import { useEffect } from "react";

export const useDismissablePanel = ({ refs = [], isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      const clickedInside = refs.some((ref) => ref.current?.contains(e.target));

      if (!clickedInside) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, refs, onClose]);
};

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "../../store/useModalStore";
import { DetailView } from "./DetailView";

const ModalInner: React.FC = () => {
  const { open, resource, url, closeModal } = useModalStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  if (!open || !url || !resource) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden
      />
      <div
        className="relative z-70 max-w-4xl w-full bg-gray-900 rounded-xl shadow-xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh" }}
      >
        <div className="p-4">
          <button
            onClick={closeModal}
            aria-label="Close"
            className="ml-auto block mb-2 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
          >
            Close
          </button>
          <DetailView resource={resource} url={url} />
        </div>
      </div>
    </div>
  );
};

export const Modal: React.FC = () => {
  return createPortal(<ModalInner />, document.body);
};

export default Modal;

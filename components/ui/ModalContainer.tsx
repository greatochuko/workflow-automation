import React from "react";

interface ModalContainerProps {
  open: boolean;
  closeModal: () => void;
  children: React.ReactElement;
}

export default function ModalContainer({
  open,
  closeModal,
  children,
}: ModalContainerProps) {
  // useEffect(() => {
  //   if (open) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }
  // }, [open]);

  return (
    <div
      className={`fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm duration-200 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={closeModal}
    >
      {children}
    </div>
  );
}

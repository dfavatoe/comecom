import { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastVariant = "success" | "danger" | "warning" | "info";

type ToastContextType = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("success");

  const showToast = (msg: string, type: ToastVariant = "success") => {
    setMessage(msg);
    setVariant(type);
    setShow(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999, position: "fixed", top: 20, right: 20 }}
      >
        <Toast
          bg={variant}
          onClose={() => {
            setShow(false);
          }}
          show={show}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

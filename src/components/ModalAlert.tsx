import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { ModalAlertProps } from "@/model/types/types";

function ModalAlert({ showAlert, setShowAlert, alertText }: ModalAlertProps) {
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false); // Hide modal after 3 seconds
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [showAlert, setShowAlert]);

  return (
    <Modal show={showAlert} onHide={() => setShowAlert(false)} backdrop={false}>
      <Modal.Body style={{ backgroundColor: "#fdf5db" }}>
        <p>{alertText}</p>
      </Modal.Body>
    </Modal>
  );
}

export default ModalAlert;

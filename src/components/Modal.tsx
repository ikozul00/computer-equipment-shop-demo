import styles from './Modal.module.css';
import ReactDOM from "react-dom";

interface ModalProps {
    isOpen: boolean;
    message: string;
    selectMessage?: string;
    errorMessage?: string;
    onClose: () => void;
    onSelect: () => void;
}

export const Modal = ({ isOpen, message, selectMessage, errorMessage, onClose, onSelect }: ModalProps) => {

    if (!isOpen) {
        return null;
    }

    const modal = (
        <div className={styles["modal-overlay"]}>
            <div className={styles.modal}>
                <p>{message}</p>
                {errorMessage && (
                    <p>Error: {errorMessage}</p>
                )}
                <div className={styles["btn-container"]}>
                    <button
                        className={`${styles["select-btn"]} ${styles["modal-btn"]}`}
                        onClick={onSelect}
                    >{selectMessage ?? "Okay"}
                    </button>
                    <button
                        className={`${styles["close-btn"]} ${styles["modal-btn"]}`}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )

    return ReactDOM.createPortal(modal, document.body);

}
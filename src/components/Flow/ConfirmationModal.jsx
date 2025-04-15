import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./ConfirmationModal.scss";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, data, loading }) => {
  const [editedData, setEditedData] = useState({
    cedula: "",
    notificacion_celular: "",
    tipologia: "",
    ...data,
  });

  useEffect(() => {
    if (isOpen) {
      setEditedData({
        cedula: data.cedula || data.documentValue || "",
        notificacion_celular: data.notificacion_celular || data.celular || "",
        tipologia: data.tipologia || "",
        ...data,
      });
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirm = () => {
    onConfirm(editedData);
  };

  return ReactDOM.createPortal(
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <h2>Confirmar datos</h2>
        <p>Por favor verifique los siguientes datos antes de continuar:</p>

        <div className="confirmation-form">
          <div className="form-group">
            <label>Cédula/RUC:</label>
            <input
              type="text"
              value={editedData.cedula || editedData.documentValue || ""}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Número de celular para notificaciones:</label>
            <input
              type="tel"
              name="notificacion_celular"
              value={editedData.notificacion_celular || ""}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              maxLength="10"
              placeholder="Ingrese su número de celular"
            />
            <small>Debe tener 10 dígitos</small>
          </div>

          {/* {editedData.tipologia && (
            <div className="form-group">
              <label>Servicio seleccionado:</label>
              <input
                type="text"
                value={editedData.tipologia || ""}
                disabled
                className="disabled-input"
              />
            </div>
          )} */}
        </div>

        <div className="confirmation-actions">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={
              loading ||
              !editedData.notificacion_celular ||
              editedData.notificacion_celular.length !== 10
            }
          >
            {loading ? "Enviando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;

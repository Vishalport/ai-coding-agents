import React, { useState, useEffect } from "react";
import { API, UserStatus, StatusLabel } from "../../enums/appEnums";
import "./UserModal.css";

/**
 * @description Modal that fetches and displays all users from the API
 * @param {boolean} props.isOpen  - controls modal visibility
 * @param {Function} props.onClose - callback to close the modal
 */
const UserModal = ({ isOpen, onClose }) => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (isOpen) fetchUsers();
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API.BASE + API.USERS);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const json = await res.json();
      setUsers(json.result);
    } catch (err) {
      console.error("[fetchUsers]", err.message);
      setError("Could not load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={handleOverlayClick}>
      <div className="modal__container">
        <div className="modal__header">
          <h2 className="modal__title">Team Members</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal__body">
          {loading && <p className="modal__state">Loading users...</p>}
          {error   && <p className="modal__state modal__state--error">{error}</p>}

          {!loading && !error && users.length === 0 && (
            <p className="modal__state">No users found.</p>
          )}

          {!loading && !error && users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-card__avatar">
                {user.name.charAt(0)}
              </div>
              <div className="user-card__info">
                <h3 className="user-card__name">{user.name}</h3>
                <p  className="user-card__email">{user.email}</p>
                <p  className="user-card__role">{user.role}</p>
              </div>
              <span className={`user-card__badge user-card__badge--${user.status}`}>
                {StatusLabel[user.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserModal;

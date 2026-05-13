import React, { useState } from "react";
import UserModal from "../components/UserModal/UserModal";
import "./HomePage.css";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="home-page">
      <div className="home-page__hero">
        <h1 className="home-page__title">Welcome to MoonCode</h1>
        <p className="home-page__subtitle">
          Your team, all in one place.
        </p>
        <button
          className="home-page__btn"
          onClick={() => setIsModalOpen(true)}
        >
          View Team Members
        </button>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container } from "react-bootstrap";
import { dataportfolio, meta, calc_images } from "../../content_option";
import Modal from "react-modal";
import Calculator from "./calculator"; 
import Wavetable from "./wavetable"; 
import Submarine from "./submarine";
import DM from "./dm";
import Sampler from "./sampler";
Modal.setAppElement("#root"); // Set the app element for accessibility

export const Portfolio = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage("");
  };

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Portfolio | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

       {/* Calculator Component */}
       <Calculator openModal={openModal} />

        <Wavetable openModal={openModal} />
        <Submarine openModal={openModal} />
        <DM openModal={openModal} />
        <Sampler openModal={openModal} />
        {/* Modal for full-screen images */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="overlay"
        >
          <button className="close-modal" onClick={closeModal}>
            ✖
          </button>
          <img
            src={selectedImage}
            alt="Full screen"
            className="full-screen-img"
          />
        </Modal>
      </Container>
    </HelmetProvider>
  );
};

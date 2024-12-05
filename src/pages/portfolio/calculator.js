import React from "react";
import { calc_images } from "../../content_option";
import "./style.css"; // Ensure styles are imported if needed
import { Container, Row, Col } from "react-bootstrap";
const Calculator = ({ openModal }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href =
      "https://drive.google.com/file/d/1OAnrQcDhXF7CT4zTUclSWDAjXpgq5-09/view"; // Replace with your Google Drive PDF link
    link.download = "instructions.pdf"; // The name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      {/* Inverted images row */}
      {/* Text Section */}
      {/* <div> */}
       
      {/* </div> */}

      <h2 className="mt-5" style={{ fontWeight: "bold", fontSize: "24px" }}>
        THE POSTFIX OPERATOR
        <h5 style={{ fontWeight: "bold", fontSize: "10px" }}>2021</h5>
        <h6 style={{ fontWeight: "bold", fontSize: "10px" }}>
            Materials: 3.5" TFT LCD 480x320 HD color screen, gray smoked acrylic
            (1/8''); PLA, machine screws #4-40x1/2'', powered by Arduino Uno.
          </h6>
      </h2>
      <div className="text-container">
        <div className="text-box">
          <h4 style={{ fontWeight: "bold", fontSize: "14px" }}>
            Sister Engineering and Ruptur Vision’s approach is to reimagine
            daily electronic devices with a DIY aesthetic. The first born of
            this seasonal collaboration is the Postfix Operator. This calculator
            pays homage to the world's first scientific calculator, the Hewlett
            Packard 35 pocket calculator, which used reverse Polish or postfix
            notation as opposed to algebraic notation that is seen on today's
            calculators. This method allows you to perform complex operations on
            a calculator in a way that mirrors the way our brains process
            problems. It breaks down the complexity of equations and you no
            longer have to worry about misplaced parenthesis.
          </h4>
          {/* Download Instructions Button */}
          <button onClick={handleDownload} className="download-button">
            Download Instructions 
          </button>
          
        </div>
 
      <Row>
          {calc_images.slice(2, 5).map((image, index) => (
            <div className="po_item" key={index}>
              <img
                src={image}
                alt={`Calc ${index + 3}`}
                className="full-width-img invert-image"
                onClick={() => openModal(image)}
              />
            </div>
          ))}
        </Row>
        </div>
      {/* Full-width images */}
      <div
        className="image-row mb-5 p-2"
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {calc_images.slice(0, 2).map((image, index) => (
          <div className="po_item" key={index}>
            <img
              src={image}
              alt={`Calc ${index + 3}`}
              style={{ width: "100%", height: "auto" }} // Adjust width as needed
              onClick={() => openModal(image)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Calculator;

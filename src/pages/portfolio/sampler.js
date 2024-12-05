import React from "react";
import { samper_images } from "../../content_option";
import "./style.css"; // Ensure styles are imported if needed
import { Container, Row, Col } from "react-bootstrap";
const Sampler = ({ openModal }) => {
  // const handleDownload = () => {
  //     const link = document.createElement("a");
  //     link.href = "https://drive.google.com/file/d/1OAnrQcDhXF7CT4zTUclSWDAjXpgq5-09/view"; // Replace with your Google Drive PDF link
  //     link.download = "instructions.pdf"; // The name of the downloaded file
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };
  //   const [currentSet, setCurrentSet] = useState(1); // 1 for first set, 2 for second set

  //   const handleSlide = () => {
  //     setCurrentSet((prevSet) => (prevSet === 1 ? 2 : 1)); // Toggle between sets
  //   };

  return (
    <>
      <div className="po_section">
        <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>
          SAMPLER
          <h5 style={{ fontWeight: "bold", fontSize: "10px" }}>2022</h5>
          <h6 style={{ fontWeight: "bold", fontSize: "10px" }}>WIP</h6>
        </h2>

        <div className="text-container">
          <div className="text-box">
            <h4 style={{ fontWeight: "bold", fontSize: "14px" }}>
              See rough specs below.
            </h4>
            <div>
            <img
              src={samper_images[0]}
              alt={`sampler-0`}
              className="responsive-image" // Apply CSS class to control the image's size and aspect ratio
              onClick={() => openModal(samper_images[0])}
            />
          </div>
          </div>
          <div className="po_item">
            <iframe
              src="https://player.vimeo.com/video/688613949?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
              width="700"
              height="350"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title="sisterengineering experiments10"
            ></iframe>
          </div>   
        </div>


        <Row  style={{
    display: 'flex',
    justifyContent: 'space-between', // Adds spacing between items
    alignItems: 'center', // Ensures items are vertically aligned
  }}>
          {samper_images.slice(1, 4).map((image, index) => (
            <div key={index} style={{ flex: '1 1 auto', maxWidth: '33%' }}>
              <img
                src={image}
                alt={`sampler ${index + 3}`}
                className="sampler-image"
                onClick={() => openModal(image)}
              />
            </div>
          ))}
        </Row>
       
      </div>
    </>
  );
};

export default Sampler;

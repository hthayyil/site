import React, {useState} from "react";
import { synth_images } from "../../content_option";
import "./style.css"; // Ensure styles are imported if needed
const Wavetable = ({ openModal }) => {
  // const handleDownload = () => {
  //     const link = document.createElement("a");
  //     link.href = "https://drive.google.com/file/d/1OAnrQcDhXF7CT4zTUclSWDAjXpgq5-09/view"; // Replace with your Google Drive PDF link
  //     link.download = "instructions.pdf"; // The name of the downloaded file
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };
  const [currentSet, setCurrentSet] = useState(1); // 1 for first set, 2 for second set

  const handleSlide = () => {
    setCurrentSet((prevSet) => (prevSet === 1 ? 2 : 1)); // Toggle between sets
  };

  return (
    <>
      <div className="po_section">

      {/* </div> */}
      <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>PYRAMID SYNTH 
      <h5 style={{ fontWeight: "bold", fontSize: "10px" }}>2021</h5>
      <h6 style={{ fontWeight: "bold", fontSize: "10px" }}>
            Materials: PLA, 100K OHM 1/5W Linear Potentiometer,¼ inch Stereo Female (6.35mm), microcontroller.
          </h6>
      </h2>
  
      <div className="text-container">
        <div className="text-box">
          <h4 style={{ fontWeight: "bold", fontSize: "14px" }}>
            A simple standalone wavetable synthesizer with 5 waveforms: sine, ramp, square,
            saw, and wave. It has 4 voices, each with parameters for pitch and
            envelope. The player modifies the synth parameters using the 5 potentiometers and listens to the audio using the quarter
            inch audio jack. 
          </h4>
          <button className="download-button">
            Inquire
          </button>
        </div>

        <div className="po_item" >
        <img
          src={synth_images[1]}
          alt={`synth-0}`}
          className="full-width-img invert-image"
          onClick={() => openModal(synth_images[1])}
        />
        </div>
      </div>
      {/* <div
        className="image-row mb-5 p-2"
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      > */}
        {/* {synth_images.slice(0, 2).map((image, index) => ( */}
     {/* Sliding Image Section */}
     <div className="image-row">
        <div className="image-wrapper">
          {currentSet === 1 ? (
            <>
              <div className="po_item_med">
                <img
                  src={synth_images[0]}
                  alt={`synth-1`}
                  onClick={() => openModal(synth_images[0])}
                />
              </div>
              <div className="po_item_med">
                <img
                  src={synth_images[2]}
                  alt={`synth-2`}
                  onClick={() => openModal(synth_images[2])}
                />
              </div>
            </>
          ) : (
            <>
              <div className="po_item_med">
                <img
                  src={synth_images[4]}
                  alt={`synth-5`}
                  onClick={() => openModal(synth_images[4])}
                />
              </div>
              <div className="po_item_med">
                <img
                  src={synth_images[5]}
                  alt={`synth-6`}
                  onClick={() => openModal(synth_images[5])}
                />
              </div>
            </>
          )}
        </div>

        {/* Slide button */}
        <button className="slide-button" onClick={handleSlide}>
          &#x3e; {/* Right arrow icon */}
        </button>
      </div>
      </div>
    </>
  );
};

export default Wavetable;

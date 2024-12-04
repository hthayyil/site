import React from "react";
import { submarine_images } from "../../content_option";
import "./style.css"; // Ensure styles are imported if needed
const Submarine = ({ openModal }) => {
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
      <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>ATOMIC SUBMARINE SYNTH 
      <h5 style={{ fontWeight: "bold", fontSize: "10px" }}>2023</h5>
      <h6 style={{ fontWeight: "bold", fontSize: "10px" }}>
            Materials:10 gauge sheet metal, 12 20K ohm 1/5w Linear Potentiometer,¼ inch Stereo Female (6.35mm).
          </h6>
      </h2>
  
      <div className="text-container">
        <div className="text-box">
          <h4 style={{ fontWeight: "bold", fontSize: "14px" }}>
            8 Voice polyphonic synthesizer with 12 knobs that control volume, attack, release, octave, FM ratio, mix, cutoff/FM amount, filter attack, filter decay and reverb.
            MIDI is sent to the synth using usb MIDI. The player can listen to the audio using the quarter inch audio jack.
            
          </h4>
        </div>
      </div>
      <div className="po_item_big" >
        <img
          src={submarine_images[1]}
          alt={`synth-0}`}
          className="full-width-img"
          onClick={() => openModal(submarine_images[1])}
        />
        </div>
        <div className="po_item_big" >
        <img
          src={submarine_images[2]}
          alt={`synth-0}`}
          className="full-width-img"
          onClick={() => openModal(submarine_images[2])}
        />
        <h5 style={{ fontWeight: "bold", fontSize: "12px" }}>Presented at CC Projects, NYC</h5>
        </div>
        
        <div className="po_item_big" >
        <img
          src={submarine_images[0]}
          alt={`synth-0}`}
          className="full-width-img"
          onClick={() => openModal(submarine_images[0])}
        />
        <h5 style={{ fontWeight: "bold", fontSize: "12px" }}>Presented at Forge Projects, Taghkanic, NY</h5>
        </div>
        </div>
    </>
  );
};

export default Submarine;

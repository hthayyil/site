import React from "react";
import { drone_machine_images } from "../../content_option";
import "./style.css"; // Ensure styles are imported if needed
const DM = ({ openModal }) => {
  return (
    <>
      {/* <div> */}

      {/* </div> */}
      <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>DRONE MACHINES
      <h5 style={{ fontWeight: "bold", fontSize: "10px" }}>2023</h5>
      <h6 style={{ fontWeight: "bold", fontSize: "10px" }}>
            Materials:10 gauge sheet metal, 12 20K ohm 1/5w Linear Potentiometer,¼ inch Stereo Female (6.35mm).
          </h6>
      </h2>
  
      <div className="text-container">
        <div className="text-box">
          <h4 style={{ fontWeight: "bold", fontSize: "14px" }}>
          Drone Machines are open source, industrial strength machines, made for hands on control of software and hardware. The original idea sprang from a desire to create live electronic music, where physical interaction with tools and mechanisms would directly control the sounds. The performance, quality of materials, and components used to fabricate these machines are as important as the sound itself. Drone Machines forge a connection with material and mechanical motion creating a human/machine interface for your audience to experience.
          </h4>
        </div>
        <div className="po_item_big" >
        <img
          src={drone_machine_images[0]}
          alt={`synth-0}`}
          className="full-width-img invert-image"
          onClick={() => openModal(drone_machine_images[0])}
        />
        </div>
      </div>

        <div className="po_item_big" >
        <img
          src={drone_machine_images[1]}
          alt={`synth-0}`}
          className="full-width-img"
          onClick={() => openModal(drone_machine_images[1])}
        />
        </div>
        
        <div className="po_item_big" >
        <img
          src={drone_machine_images[2]}
          alt={`synth-0}`}
          className="full-width-img"
          onClick={() => openModal(drone_machine_images[2])}
        />
        </div>
  
    </>
  );
};

export default DM;

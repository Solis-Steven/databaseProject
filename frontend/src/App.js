import "./style.css";
import StarfieldAnimation from "react-starfield-animation";
import { FormRemote } from "./components/FormRemote";
import { Route, Routes } from "react-router-dom"
import { Frame } from "./components/Frame";
import { Tables } from "./components/Tables";
import { Attributes } from "./components/Attributes";
import { SaLogin } from "./components/SaLogin";

export default function App() {
  return (
    <>
      <StarfieldAnimation
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      numParticles={1000}
      particleSpeed={0}
      dx={0.000000001} // x speed of stars in px/frame, default 0.05
      dy={0.000000001}
      />

      <Routes>
        <Route path="/" element={<SaLogin />} />
        <Route path="/formremote" element={<FormRemote />} />
        <Route path="/schema" element={<Frame />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/attributes" element={<Attributes />} />
      </Routes>
      {/* <Frame /> */}
      
    </>
    
  );
}

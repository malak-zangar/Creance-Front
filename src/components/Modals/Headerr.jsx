import neodev from "../../assets/neodev.png"; 
import { Header } from "antd/es/layout/layout";

function Headerr() {
 
  return (
    <Header
    style={{
      padding: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: '#f1effd',
      paddingRight: "16px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", paddingLeft: "16px" }}>
      <img src={neodev} alt="Logo" style={{ height: "35px", marginRight: "16px" }} />
      <h1 style={{ margin: 0, fontSize: "20px" }}>Neopolis Development</h1>
    </div>
    
  </Header>
  );
}

export default Headerr;

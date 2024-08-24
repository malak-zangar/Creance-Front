import neodev from "../../assets/logo-neopolis.png"; 
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
    </div>
    
  </Header>
  );
}

export default Headerr;

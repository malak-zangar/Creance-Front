import { useState } from "react";
import axios from "axios";
import FormData from "form-data";
import "./App.css";



function App() {
  const [apiResponse, setApiResponse] = useState(null);

  const handleCreatePipeline = async () => {
    // debugger;
    const apiUrl = import.meta.env.VITE_APP_API_URL;
  
    let data = new FormData();
  
    data.append("url", "https://gitlab.com/houssam1270108/myapp1234.git");
    data.append("sonar_url", "http://109.205.176.62:9001");
    data.append("jenkins_url", "http://109.205.176.62:8080/");
    data.append("jenkins_username", "houssam");
    data.append("branchName", "main");
    data.append("credentialsId", "gitlab_token");
  
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiUrl}create_pipelinee`,
      data: data,
    };
  
    axios
      .request(config)
      .then((response) => {
        setApiResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setApiResponse(error);
      });
  };

  return (
    <div>
      <button onClick={handleCreatePipeline}>Execute</button>
      <h4><pre>{JSON.stringify(apiResponse, null, 2)}</pre></h4>
    </div>
  );
}

export default App;

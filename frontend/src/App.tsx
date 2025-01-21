import { useState } from "react";
import "./App.css";

function App() {
  const [repoUrl, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployId, setDeployId] = useState("");
  const deployHandler = async () => {
    if (!repoUrl) {
      alert("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      console.log(repoUrl);
      // const response = await fetch("http://localhost:3000/deploy", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ repoUrl }),
      // });
      // const data = await response.json();
      // setDeployId(data.repoId);
      // console.log(response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <>
      <h1>Deploymenter</h1>
      <form onSubmit={deployHandler}>
        <label>
          <input
            type="text"
            placeholder="Enter a URL"
            value={repoUrl}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          Deploy
        </button>
      </form>
      {loading && <p>Deploying...</p>}
      {deployId && <p>Deployed with ID: {deployId}</p>}
      {deployId && (
        <p>
          <a
            href={`http://${deployId}.localhost:3000`}
            target="_blank"
            rel="noreferrer"
          >
            View Deployment
          </a>
        </p>
      )}
    </>
  );
}

export default App;

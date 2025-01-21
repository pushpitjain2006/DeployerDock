import { useState } from "react";
import "./App.css";

function App() {
  const [repoUrl, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployId, setDeployId] = useState("");
  const [repoBase, setBase] = useState("");
  const deployHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!repoUrl) {
      alert("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      console.log(repoUrl);
      const response = await fetch("http://localhost:3000/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl, repoBase }),
      });
      const data = await response.json();
      setDeployId(data.repoId);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <>
      <h1>Deploymenter</h1>
      <form onSubmit={deployHandler} className="form" action="">
        <label>
          <input
            type="text"
            placeholder="Enter a URL"
            value={repoUrl}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter a base folder"
            value={repoBase}
            onChange={(e) => setBase(e.target.value)}
          ></input>
        </label>
        <button type="submit" disabled={loading}>
          Deploy
        </button>
      </form>
      {repoUrl && <p>Deploying: {repoUrl}</p>}
      {loading && <p>Deploying...</p>}
      {deployId && <p>Deployed with ID: {deployId}</p>}
      {deployId && (
        <p>
          <a
            href={`http://${deployId}.localhost:3001`}
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

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
      alert("Please enter a repository URL");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_APP_BackendURL + "/deploy" ||
          "http://localhost:3000/deploy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ repoUrl, repoBase }),
        }
      );
      const data = await response.json();
      setDeployId(data.repoId);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">
          Deploymenter{" "}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </h1>
        <p className="subtitle">Effortless Deployments with a Click</p>
      </header>
      <main className="main">
        <form onSubmit={deployHandler} className="form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter repository URL"
              value={repoUrl}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter base folder (optional)"
              value={repoBase}
              onChange={(e) => setBase(e.target.value)}
              className="input"
            />
          </div>
          <button
            type="submit"
            className={`button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : "Deploy Now"}
          </button>
        </form>
        <section className="output">
          {repoUrl && !loading && <p className="info">Deploying: {repoUrl}</p>}
          {loading && <p className="info">🚀 Deploying, hold tight...</p>}
          {deployId && (
            <>
              <p className="success">🎉 Deployment Successful!</p>
              <p className="info">Deployment ID: {deployId}</p>
              <p>
                <a
                  href={`https://${deployId}.${
                    import.meta.env.VITE_APP_Hostname || "localhost:3001"
                  }`}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  View Deployment
                </a>
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

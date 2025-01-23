import { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg p-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Git Frontend Deployer
          </h1>
          <p className="text-sm text-zinc-400">
            Effortless Frontend Deployments
          </p>
        </header>

        <form onSubmit={deployHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your Git repository URL"
            value={repoUrl}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-700 text-zinc-200 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <input
            type="text"
            placeholder="Base folder (optional)"
            value={repoBase}
            onChange={(e) => setBase(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-700 text-zinc-200 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-zinc-900 font-semibold transition-all duration-300 ${
              loading
                ? "bg-zinc-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 active:scale-[0.98]"
            }`}
          >
            {loading ? "Deploying..." : "Deploy Now"}
          </button>
        </form>

        {deployId && (
          <div className="mt-6 text-center space-y-2">
            <p className="text-green-400 font-medium">Deployment Successful</p>
            <p className="text-zinc-400 text-sm">Deployment ID: {deployId}</p>
            <a
              href={`https://${deployId}.${
                import.meta.env.VITE_APP_Hostname || "localhost:3001"
              }`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Deployment Site (It may take a few seconds to deploy)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

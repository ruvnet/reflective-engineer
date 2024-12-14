import MainNav from "../components/MainNav";

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Tools" />
      
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <section className="flex-1 glass-panel p-6 animate-matrix-fade">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-code text-console-cyan">Tools</h1>
            
            <div className="border-b border-console-cyan/20">
              <nav className="-mb-px flex space-x-8" aria-label="Tools">
                <button className="border-console-cyan text-console-cyan whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                  Overview
                </button>
                <button className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                  Prompt Tools
                </button>
                <button className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                  Analysis Tools
                </button>
                <button className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                  Utilities
                </button>
              </nav>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool cards will go here */}
            <div className="glass-panel p-4 border border-console-cyan/20">
              <h2 className="text-xl text-console-cyan mb-2">Coming Soon</h2>
              <p className="text-console-text">Tools section under development</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Tools;

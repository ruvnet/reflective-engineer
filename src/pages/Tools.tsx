import MainNav from "../components/MainNav";

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Tools" />
      
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <section className="flex-1 glass-panel p-6 animate-matrix-fade">
          <h1 className="text-2xl font-code text-console-cyan mb-6">Tools</h1>
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

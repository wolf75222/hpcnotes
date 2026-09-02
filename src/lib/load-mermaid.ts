type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
};

let mermaidPromise: Promise<MermaidApi> | null = null;
let renderChain: Promise<void> = Promise.resolve();

function readGlobalMermaid(): MermaidApi | undefined {
  return (globalThis as unknown as { mermaid?: MermaidApi }).mermaid;
}

function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= (async () => {
    // The package entry (`mermaid.core.mjs`) lazy-imports diagram chunks.
    // Turbopack never finishes those imports, so diagrams stay on
    // "Rendering diagram…". The min bundle has no dynamic imports.
    await import("mermaid/dist/mermaid.min.js");
    const mermaid = readGlobalMermaid();
    if (mermaid == null) {
      throw new Error("Mermaid did not attach to the page.");
    }
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "neutral",
    });
    return mermaid;
  })();
  return mermaidPromise;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Timed out rendering the diagram."));
    }, ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function renderMermaidChart(id: string, chart: string): Promise<string> {
  const job = renderChain.then(async () => {
    const mermaid = await loadMermaid();
    const { svg } = await withTimeout(mermaid.render(id, chart.trim()), 20000);
    return svg;
  });
  renderChain = job.then(
    () => undefined,
    () => undefined,
  );
  return job;
}

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
};

let mermaidPromise: Promise<MermaidApi> | null = null;
let renderChain: Promise<void> = Promise.resolve();

function readGlobalMermaid(): MermaidApi | undefined {
  return (globalThis as unknown as { mermaid?: MermaidApi }).mermaid;
}

function configure(mermaid: MermaidApi) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "neutral",
  });
}

function findMermaidScript(): HTMLScriptElement | null {
  return (
    document.querySelector<HTMLScriptElement>("script#hpc-mermaid") ??
    document.querySelector<HTMLScriptElement>('script[src="/vendor/mermaid.min.js"]')
  );
}

function injectMermaidScript(): HTMLScriptElement {
  const script = document.createElement("script");
  script.id = "hpc-mermaid";
  script.src = "/vendor/mermaid.min.js";
  script.async = true;
  document.head.appendChild(script);
  return script;
}

function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= (async () => {
    if (readGlobalMermaid() == null && findMermaidScript() == null) {
      injectMermaidScript();
    }

    const started = Date.now();
    while (readGlobalMermaid() == null) {
      if (Date.now() - started > 20000) {
        throw new Error("Timed out loading mermaid.");
      }
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }

    const mermaid = readGlobalMermaid();
    if (mermaid == null) {
      throw new Error("Mermaid did not attach to the page.");
    }
    configure(mermaid);
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

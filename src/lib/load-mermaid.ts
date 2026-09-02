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
  mermaidPromise ??= new Promise((resolve, reject) => {
    const existing = readGlobalMermaid();
    if (existing) {
      existing.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "neutral",
      });
      resolve(existing);
      return;
    }

    const src = "/vendor/mermaid.min.js";
    const ready = (script: HTMLScriptElement) => {
      script.addEventListener("load", () => {
        const mermaid = readGlobalMermaid();
        if (mermaid == null) {
          reject(new Error("Mermaid did not attach to the page."));
          return;
        }
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
        });
        resolve(mermaid);
      });
      script.addEventListener("error", () => {
        reject(new Error("Failed to load mermaid."));
      });
    };

    const prev = document.querySelector<HTMLScriptElement>(
      'script[data-hpc-mermaid="1"]',
    );
    if (prev) {
      const already = readGlobalMermaid();
      if (already) {
        already.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
        });
        resolve(already);
        return;
      }
      ready(prev);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.hpcMermaid = "1";
    ready(script);
    document.head.appendChild(script);
  });
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

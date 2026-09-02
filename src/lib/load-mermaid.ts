type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
};

const SCRIPT_SRC = "/vendor/mermaid.min.js";
const svgCache = new Map<string, string>();

let mermaidPromise: Promise<MermaidApi> | null = null;
let renderChain: Promise<void> = Promise.resolve();
let renderSeq = 0;

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

function ensureMermaidScript(): HTMLScriptElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    "script[data-hpc-mermaid]",
  );
  if (existing != null) {
    return existing;
  }

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;
  script.dataset.hpcMermaid = "1";
  document.head.appendChild(script);
  return script;
}

export function prefetchMermaid() {
  ensureMermaidScript();
}

function waitForMermaid(script: HTMLScriptElement | null): Promise<MermaidApi> {
  const attached = readGlobalMermaid();
  if (attached != null) {
    return Promise.resolve(attached);
  }

  return new Promise((resolve, reject) => {
    const started = Date.now();
    let settled = false;

    const succeed = (api: MermaidApi) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearInterval(poll);
      window.clearTimeout(timer);
      resolve(api);
    };

    const fail = (error: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearInterval(poll);
      window.clearTimeout(timer);
      reject(error);
    };

    const poll = window.setInterval(() => {
      const api = readGlobalMermaid();
      if (api != null) {
        succeed(api);
      } else if (Date.now() - started > 20000) {
        fail(new Error("Timed out loading mermaid."));
      }
    }, 30);

    const timer = window.setTimeout(() => {
      fail(new Error("Timed out loading mermaid."));
    }, 20000);

    script?.addEventListener(
      "load",
      () => {
        const api = readGlobalMermaid();
        if (api != null) {
          succeed(api);
        }
      },
      { once: true },
    );
    script?.addEventListener(
      "error",
      () => fail(new Error("Failed to load mermaid.")),
      { once: true },
    );
  });
}

function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= (async () => {
    const script = ensureMermaidScript();
    const mermaid = await waitForMermaid(script);
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

export function renderMermaidChart(chart: string): Promise<string> {
  const key = chart.trim();
  const cached = svgCache.get(key);
  if (cached != null) {
    return Promise.resolve(cached);
  }

  const job = renderChain.then(async () => {
    const hit = svgCache.get(key);
    if (hit != null) {
      return hit;
    }
    const mermaid = await loadMermaid();
    renderSeq += 1;
    const id = `hpcmmd${renderSeq}`;
    const { svg } = await withTimeout(mermaid.render(id, key), 20000);
    svgCache.set(key, svg);
    return svg;
  });
  renderChain = job.then(
    () => undefined,
    () => undefined,
  );
  return job;
}

export function svgToDataUrl(svg: string): string {
  const trimmed = svg.trim();
  const withNs = /xmlns=/.test(trimmed)
    ? trimmed
    : trimmed.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(withNs)}`;
}

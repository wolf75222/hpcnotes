type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
};

const SCRIPT_SRC = "/vendor/mermaid.min.js";
const LOAD_MS = 8000;
const RENDER_MS = 8000;
const svgCache = new Map<string, string>();

let mermaidPromise: Promise<MermaidApi> | null = null;
let renderChain: Promise<void> = Promise.resolve();
let renderSeq = 0;

function unwrapMermaid(value: unknown): MermaidApi | undefined {
  if (value == null || typeof value !== "object") {
    return undefined;
  }
  const record = value as {
    render?: unknown;
    initialize?: unknown;
    default?: unknown;
  };
  if (
    typeof record.render === "function" &&
    typeof record.initialize === "function"
  ) {
    return record as MermaidApi;
  }
  if (record.default != null && record.default !== value) {
    return unwrapMermaid(record.default);
  }
  return undefined;
}

function readGlobalMermaid(): MermaidApi | undefined {
  const g = globalThis as unknown as {
    mermaid?: unknown;
    __esbuild_esm_mermaid_nm?: { mermaid?: unknown };
  };
  return (
    unwrapMermaid(g.mermaid) ?? unwrapMermaid(g.__esbuild_esm_mermaid_nm?.mermaid)
  );
}

function configure(mermaid: MermaidApi) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "neutral",
    fontFamily: "inherit",
    themeVariables: {
      background: "white",
    },
    flowchart: {
      htmlLabels: false,
      useMaxWidth: true,
    },
    sequence: {
      useMaxWidth: true,
    },
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
      } else if (Date.now() - started > LOAD_MS) {
        fail(new Error("Timed out loading mermaid."));
      }
    }, 30);

    const timer = window.setTimeout(() => {
      fail(new Error("Timed out loading mermaid."));
    }, LOAD_MS);

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
    const { svg } = await withTimeout(mermaid.render(id, key), RENDER_MS);
    svgCache.set(key, svg);
    return svg;
  });
  renderChain = job.then(
    () => undefined,
    () => undefined,
  );
  return job;
}

export function prepareMermaidSvg(svg: string): string {
  let trimmed = svg.trim();
  if (!/xmlns=/.test(trimmed)) {
    trimmed = trimmed.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const viewBox = trimmed.match(
    /viewBox="\s*([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([0-9.eE+-]+)\s*"/,
  );
  if (viewBox != null) {
    const width = viewBox[3];
    const height = viewBox[4];
    if (width != null && height != null) {
      if (/width="/.test(trimmed)) {
        trimmed = trimmed.replace(/width="[^"]*"/, `width="${width}"`);
      } else {
        trimmed = trimmed.replace("<svg", `<svg width="${width}"`);
      }
      if (/height="/.test(trimmed)) {
        trimmed = trimmed.replace(/height="[^"]*"/, `height="${height}"`);
      } else {
        trimmed = trimmed.replace(/<svg/, `<svg height="${height}"`);
      }
    }
  }
  trimmed = trimmed.replace(/style="[^"]*max-width:[^"]*"/, (style) =>
    style.replace(/max-width:\s*[^;"]*;?/, ""),
  );
  return trimmed.replace(
    /(<svg[^>]*>)/,
    '$1<rect width="100%" height="100%" fill="white"/>',
  );
}

export function mermaidSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(prepareMermaidSvg(svg))}`;
}

const assets = [
  { name: "campaign-hero.webp", type: "Image", status: "Ready" },
  { name: "product-demo.mp4", type: "Video", status: "Scanning" },
];
export default function Page() {
  return (
    <main>
      <header>
        <div>
          <span>Media pipeline</span>
          <h1>Files in. Safe assets out.</h1>
          <p>
            Upload, quarantine, inspect, transform, and deliver every asset from
            one tenant-safe catalog.
          </p>
        </div>
        <button>Upload assets</button>
      </header>
      <section className="metrics">
        <article>
          <b>1.8 TB</b>
          <small>Stored</small>
        </article>
        <article>
          <b>842</b>
          <small>Assets</small>
        </article>
        <article>
          <b>0</b>
          <small>Threats delivered</small>
        </article>
      </section>
      <h2>Recent assets</h2>
      <section className="grid">
        {assets.map((asset) => (
          <article className="card" key={asset.name}>
            <div className="preview">{asset.type}</div>
            <strong>{asset.name}</strong>
            <p>{asset.status} · Private</p>
            <button className="link">Inspect →</button>
          </article>
        ))}
      </section>
    </main>
  );
}

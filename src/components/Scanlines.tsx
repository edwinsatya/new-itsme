/**
 * Persistent broadcast texture: scanlines, vignette, film grain and a
 * slow CRT sweep. All fixed, pointer-events: none, transform/opacity only.
 */
const Scanlines = () => (
  <div aria-hidden>
    <div className="crt-scanlines" />
    <div className="crt-vignette" />
    <div className="crt-grain" />
    <div className="crt-sweep" />
  </div>
);

export default Scanlines;

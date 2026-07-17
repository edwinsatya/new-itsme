/**
 * Subtle full-screen finish: soft vignette + animated grain.
 * Modern-console feel — deliberately NOT a heavy CRT filter; the outro
 * section adds its own local scanlines for the one retro wink.
 */
const ScreenFX = () => (
  <div aria-hidden>
    <div className="fx-vignette" />
    <div className="fx-grain" />
  </div>
);

export default ScreenFX;

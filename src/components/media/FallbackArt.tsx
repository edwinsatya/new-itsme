import clsx from "clsx";

export type FallbackVariant = "space" | "monogram" | "portal" | "ultra";

/**
 * Designed stand-ins for media slots that have no file yet — navy radial
 * space, glowing acid ring, ultramarine bloom, grain. Never a gray box.
 */
export default function FallbackArt({
  variant,
  className,
}: {
  variant: FallbackVariant;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={clsx("grain pointer-events-none overflow-hidden", className)}
      style={{ containerType: "size" }}
    >
      {/* deep navy space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 12%, #131b4d 0%, #0a0e2c 46%, #050506 100%)",
        }}
      />

      {/* ultramarine bloom */}
      <div
        className={clsx(
          "absolute rounded-full",
          variant === "monogram"
            ? "inset-[-30%] opacity-90"
            : "-top-[12%] left-[-18%] h-[70%] w-[75%] opacity-70 blur-2xl"
        )}
        style={{
          background:
            "radial-gradient(closest-side, rgba(61,67,255,0.85), rgba(61,67,255,0.28) 55%, transparent 75%)",
        }}
      />

      {(variant === "space" || variant === "portal") && (
        <>
          {/* glowing acid ring, tipped into perspective */}
          <div
            className="absolute left-1/2 top-[74%] aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2"
            style={{ perspective: "900px" }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                transform: "rotateX(62deg)",
                border: "clamp(10px, 2.6vw, 34px) solid var(--color-acid)",
                boxShadow:
                  "0 0 90px rgba(200,255,46,0.5), 0 0 26px rgba(200,255,46,0.65), inset 0 0 60px rgba(200,255,46,0.35)",
              }}
            />
          </div>
          {/* white diagonal beam */}
          <div
            className="absolute left-1/2 top-1/2 h-[170%] w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-[26deg] bg-white/85"
            style={{ boxShadow: "0 0 22px rgba(255,255,255,0.8)" }}
          />
        </>
      )}

      {variant === "monogram" && (
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="font-serif leading-none text-acid"
            style={{ fontSize: "clamp(56px, 44cqw, 300px)" }}
          >
            ES
          </span>
        </div>
      )}

      {variant === "ultra" && (
        <>
          <div
            className="absolute right-[-15%] top-[-10%] h-[85%] w-[70%] rounded-full opacity-80 blur-2xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(61,67,255,0.9), rgba(61,67,255,0.3) 60%, transparent 75%)",
            }}
          />
          <div
            className="absolute bottom-[-25%] left-[-12%] h-[70%] w-[60%] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(200,255,46,0.55), transparent 70%)",
            }}
          />
        </>
      )}
    </div>
  );
}

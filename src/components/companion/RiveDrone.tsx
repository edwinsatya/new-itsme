"use client";

import { useEffect, useImperativeHandle, type Ref } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import type { DroneHandle } from "./Companion";

const SM = "Companion";

/**
 * Rive-backed companion. Loaded (code-split) only after /companion.riv is
 * confirmed to exist, so the Rive runtime never ships to visitors while
 * the canvas fallback is in service.
 *
 * Expects: artboard "Companion", state machine "Companion", inputs
 * alert(bool) / jump(trigger) / arrive(trigger) / zone(number 0–6) /
 * lookX,lookY(number −1…1). See Companion.tsx for the full contract.
 */
const RiveDrone = ({
  handleRef,
  size,
  onFail,
}: {
  handleRef: Ref<DroneHandle>;
  size: number;
  onFail: () => void;
}) => {
  const { rive, RiveComponent } = useRive({
    src: "/companion.riv",
    artboard: "Companion",
    stateMachines: SM,
    autoplay: true,
    onLoadError: onFail,
  });

  const alertIn = useStateMachineInput(rive, SM, "alert");
  const jumpIn = useStateMachineInput(rive, SM, "jump");
  const arriveIn = useStateMachineInput(rive, SM, "arrive");
  const zoneIn = useStateMachineInput(rive, SM, "zone");
  const lookX = useStateMachineInput(rive, SM, "lookX");
  const lookY = useStateMachineInput(rive, SM, "lookY");

  useImperativeHandle(
    handleRef,
    () => ({
      alert(on) {
        if (alertIn) alertIn.value = on;
      },
      jump() {
        jumpIn?.fire();
      },
      arrive(zoneIdx) {
        if (zoneIn) zoneIn.value = zoneIdx;
        arriveIn?.fire();
      },
      set(zoneIdx) {
        if (zoneIn) zoneIn.value = zoneIdx;
      },
    }),
    [alertIn, jumpIn, arriveIn, zoneIn]
  );

  // cursor gaze — mirrors the canvas drone's behaviour
  useEffect(() => {
    if (!lookX || !lookY || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = document.querySelector(".companion");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const within = Math.hypot(dx, dy) < 300;
      lookX.value = within ? Math.max(-1, Math.min(1, dx / 150)) : 0;
      lookY.value = within ? Math.max(-1, Math.min(1, dy / 150)) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [lookX, lookY]);

  return <RiveComponent className="companion-canvas" style={{ width: size, height: size }} />;
};

export default RiveDrone;

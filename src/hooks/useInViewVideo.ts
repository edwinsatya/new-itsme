"use client";

import { useEffect, type RefObject } from "react";

/**
 * Plays the video while it is on screen and pauses it once it leaves,
 * so off-screen loops never burn battery.
 */
export function useInViewVideo(
  ref: RefObject<HTMLVideoElement | null>,
  enabled = true
) {
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay can be blocked; the poster/first frame stays */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(video);
    return () => io.disconnect();
  }, [ref, enabled]);
}

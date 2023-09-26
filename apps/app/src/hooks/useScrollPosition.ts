import { useCallback, useEffect, useRef, useState } from "react";
import throttle from "lodash/fp/throttle";

export default function useScrollPosition(
  scrollElement: HTMLElement | null,
  scrollFactor = 0
) {
  const [position, setPosition] = useState(0);

  const onScroll = useCallback((ev: Event) => {
    const newPos = (ev.target as HTMLElement).scrollTop;
    setPosition(newPos);
  }, []);

  const throttledScrollCallback = throttle(50, onScroll);

  useEffect(() => {
    if (scrollElement)
      scrollElement.addEventListener("scroll", throttledScrollCallback);

    return () => {
      if (scrollElement)
        scrollElement.removeEventListener("scroll", throttledScrollCallback);
    };
  }, [scrollElement]);

  return position * scrollFactor;
}

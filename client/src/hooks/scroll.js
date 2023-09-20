import { useRef } from "react";

//When you create a hook it must begin with use
export default function useScroll() {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const { current } = scrollRef;
    direction === "left"
      ? (current.scrollLeft -= 500)
      : (current.scrollLeft += 500);
  };

  return { scroll, scrollRef };
}

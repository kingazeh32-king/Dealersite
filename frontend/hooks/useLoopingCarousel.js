'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function getClosestIndex(container) {
  const scrollLeft = container.scrollLeft;
  let closest = 0;
  let minDistance = Infinity;

  Array.from(container.children).forEach((child, index) => {
    const offset = child.offsetLeft - container.offsetLeft;
    const distance = Math.abs(offset - scrollLeft);
    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  return closest;
}

export function useLoopingCarousel(items, { interval = 5000 } = {}) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isJumping = useRef(false);
  const scrollEndTimer = useRef(null);

  const count = items.length;

  const loopItems = useMemo(() => {
    if (!count) return [];
    return [...items, ...items, ...items];
  }, [items, count]);

  const scrollToIndex = useCallback((index, smooth = true) => {
    const container = scrollRef.current;
    if (!container?.children[index]) return;

    const card = container.children[index];
    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  const normalizeScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !count || isJumping.current) return;

    const closest = getClosestIndex(container);

    if (closest >= count * 2) {
      isJumping.current = true;
      scrollToIndex(closest - count, false);
      setActiveIndex((closest - count) % count);
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    } else if (closest < count) {
      isJumping.current = true;
      scrollToIndex(closest + count, false);
      setActiveIndex(closest % count);
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    } else {
      setActiveIndex(closest % count);
    }
  }, [count, scrollToIndex]);

  useEffect(() => {
    if (!count) return;
    const timer = setTimeout(() => scrollToIndex(count, false), 0);
    return () => clearTimeout(timer);
  }, [count, scrollToIndex]);

  const goNext = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !count) return;
    const closest = getClosestIndex(container);
    scrollToIndex(closest + 1, true);
  }, [count, scrollToIndex]);

  const goPrev = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !count) return;
    const closest = getClosestIndex(container);
    scrollToIndex(closest - 1, true);
  }, [count, scrollToIndex]);

  const goTo = useCallback(
    (logicalIndex) => {
      if (!count) return;
      scrollToIndex(count + logicalIndex, true);
      setActiveIndex(logicalIndex);
    },
    [count, scrollToIndex]
  );

  useEffect(() => {
    if (isPaused || count <= 1) return undefined;

    const timer = setInterval(goNext, interval);
    return () => clearInterval(timer);
  }, [isPaused, count, interval, goNext]);

  function handleScroll() {
    if (isJumping.current) return;
    const container = scrollRef.current;
    if (!container || !count) return;
    const closest = getClosestIndex(container);
    setActiveIndex(closest % count);

    clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(normalizeScroll, 120);
  }

  function handleScrollEnd() {
    clearTimeout(scrollEndTimer.current);
    normalizeScroll();
  }

  useEffect(() => {
    return () => clearTimeout(scrollEndTimer.current);
  }, []);

  const pauseProps = {
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
    onFocus: () => setIsPaused(true),
    onBlur: () => setIsPaused(false),
  };

  return {
    scrollRef,
    loopItems,
    activeIndex,
    count,
    goNext,
    goPrev,
    goTo,
    handleScroll,
    handleScrollEnd,
    pauseProps,
  };
}

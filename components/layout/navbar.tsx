'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { FocusEvent, PointerEvent, CSSProperties } from 'react';

type Link = { label: string; href: string };

export function Navbar(): JSX.Element {
  const pathname = usePathname();

  const [links] = useState<Link[]>([
    { label: 'Labels', href: '/' },
    { label: 'Processed', href: '/processed' },
  ]);

  const [selectedLinkIndex, setSelectedLinkIndex] = useState(
    links.findIndex((link) => link.href === pathname) || 0,
  );

  const [linkRefs, setLinkRefs] = useState<Array<HTMLAnchorElement | null>>([]);
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [isInitialHoveredElement, setIsInitialHoveredElement] = useState(true);

  const navRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    setLinkRefs((prev) => prev.slice(0, links.length));
  }, [links.length]);

  useEffect(() => {
    const newIndex = links.findIndex((link) => link.href === pathname) || 0;
    setSelectedLinkIndex(newIndex);
  }, [pathname, links]);

  const navRect = navRef.current?.getBoundingClientRect();
  const selectedRect = linkRefs[selectedLinkIndex]?.getBoundingClientRect();

  const onLeaveLinks = () => {
    setIsInitialHoveredElement(true);
    setHoveredLinkIndex(null);
  };

  const onEnterLink = (
    e: PointerEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>,
    i: number,
  ) => {
    if (!e.target || !(e.target instanceof HTMLAnchorElement)) return;

    setHoveredLinkIndex((prev) => {
      if (prev != null && prev !== i) {
        setIsInitialHoveredElement(false);
      }
      return i;
    });
    setHoveredRect(e.target.getBoundingClientRect());
  };

  const hoverStyles: CSSProperties = { opacity: 0 };
  if (navRect && hoveredRect) {
    hoverStyles.transform = `translate3d(${hoveredRect.left - navRect.left}px,${
      hoveredRect.top - navRect.top
    }px,0px)`;
    hoverStyles.width = hoveredRect.width;
    hoverStyles.height = hoveredRect.height;
    hoverStyles.opacity = hoveredLinkIndex != null ? 1 : 0;
    hoverStyles.transition = isInitialHoveredElement
      ? `opacity 150ms`
      : `transform 150ms 0ms, opacity 150ms 0ms, width 150ms`;
  }

  const selectStyles: CSSProperties = { opacity: 0 };
  if (navRect && selectedRect) {
    selectStyles.width = selectedRect.width * 0.8;
    selectStyles.transform = `translateX(calc(${
      selectedRect.left - navRect.left
    }px + 10%))`;
    selectStyles.opacity = 1;
    selectStyles.transition = isInitialRender.current
      ? `opacity 150ms 150ms`
      : `transform 150ms 0ms, opacity 150ms 150ms, width 150ms`;

    isInitialRender.current = false;
  }

  return (
    <nav
      ref={navRef}
      className='relative z-0 flex flex-shrink-0 items-center justify-center py-2'
      onPointerLeave={onLeaveLinks}
    >
      {links.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          className={cn(
            'text-md text-md relative z-20 flex h-8 cursor-pointer select-none items-center rounded-md bg-transparent px-4 font-semibold text-slate-500 transition-colors',
            {
              'text-slate-800':
                hoveredLinkIndex === i || selectedLinkIndex === i,
            },
          )}
          ref={(el) => {
            if (el) linkRefs[i] = el;
          }}
          onPointerEnter={(e) => onEnterLink(e, i)}
          onFocus={(e) => onEnterLink(e, i)}
        >
          {item.label}
        </Link>
      ))}
      <div
        className='absolute left-0 top-0 z-10 rounded-md bg-gray-200 transition-[width]'
        style={hoverStyles}
      />
      <div
        className='absolute bottom-0 left-0 z-10 h-1 rounded-full bg-slate-700'
        style={selectStyles}
      />
    </nav>
  );
}

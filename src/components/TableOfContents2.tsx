import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

//import { UnfoldMore, UnfoldLess, Dismiss, Restore } from "./toc-buttons.js";


const UnfoldMore = (props: {onClick:any}) : JSX.Element => {return (<button onClick={props.onClick} className="unfold-more" aria-label="Expand table of contents" title="Expand table of contents" />)}
const UnfoldLess = (props: {onClick:any}) : JSX.Element => {return (<button onClick={props.onClick}  className="unfold-more" aria-label="Expand table of contents" title="Expand table of contents" />)}
const Dismiss = (props: {onClick:any}) : JSX.Element => {return (<button onClick={props.onClick}  className="unfold-more" aria-label="Expand table of contents" title="Expand table of contents" />)}
const Restore = (props: {onClick:any}) : JSX.Element => {return (<button onClick={props.onClick}  className="unfold-more" aria-label="Expand table of contents" title="Expand table of contents" />)}


enum State {
  Normal,
  Expanded,
  Collapsed,
}

export function TOC({
  postSelector,
  headingSelector,
}: {
  postSelector?: string;
  headingSelector?: string;
}) {
  postSelector = postSelector || ".e-content.entry-content";
  headingSelector = headingSelector || "h2,h3,h4,h5,h6";

  const { headings } = useHeadingsData(postSelector, headingSelector);
  const { inViewId } = useInViewId(postSelector, headingSelector);

  const [expansion, setExpansion] = useState(State.Normal);
  const scrollRef = useRef<HTMLDivElement>(null);

  const expand = () => setExpansion(State.Expanded);
  const normal = () => setExpansion(State.Normal);
  const collapse = () => setExpansion(State.Collapsed);

  function scroll(to: number) {
    scrollRef.current?.scroll({
      top: to - 75,
      behavior: "smooth",
    });
  }
  const dismissIfExpanded = () => {
    if (expansion === State.Expanded) expand();
  };

  return (
    <nav aria-label="Table of Contents">
      {expansion !== State.Collapsed && (
        <div className="controls">
          {expansion === State.Normal ? (
            <UnfoldMore onClick={expand} />
          ) : (
            <UnfoldLess onClick={normal} />
          )}
          <Dismiss onClick={collapse} />
        </div>
      )}
      <div
        ref={scrollRef}
        className={classNames("outer-scroll", {
          expanded: expansion === State.Expanded,
          collapsed: expansion ===State.Collapsed,
          normal: expansion=== State.Normal,
        })}
      >
        {expansion === State.Collapsed ? (
          <Restore onClick={normal} />
        ) : (
          <>
            <div role="heading" aria-level={6}>
              In this post:
            </div>
            <ul>
              {headings.map((h) => (
                <li key={h.id}>
                  <H
                    entry={h}
                    inView={inViewId}
                    scroll={scroll}
                    onClick={dismissIfExpanded}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </nav>
  );
}

function H({
  entry,
  inView,
  scroll,
  onClick,
}: {
  entry: HEntry;
  inView: string | undefined;
  scroll: (to: number) => void;
  onClick: () => void;
}) {
  const aRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (inView === entry.id && aRef.current) {
      scroll(aRef.current.offsetTop);
    }
  }, [inView]);

  return (
    <>
      <a
        href={`#${entry.id}`}
        className={classNames("h", entry.id === inView ? "active" : undefined)}
        ref={aRef}
        onClick={() => {
          onClick();
        }}
      >
        {entry.text}
      </a>
      {entry.items && (
        <ul>
          {entry.items.map((h) => (
            <li key={h.id}>
              <H entry={h} inView={inView} scroll={scroll} onClick={onClick} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function useInViewId(postSelector: string, headingSelector: string) {
  const [inViewId, setInViewId] = useState<string | undefined>();

  useEffect(() => {
    const inViewSet = new Map<string, HTMLElement>();

    const callback: IntersectionObserverCallback = (changes) => {
      for (const change of changes) {
        // eslint-disable-next-line no-unused-expressions
        change.isIntersecting
          ? inViewSet.set(change.target.id, change.target as HTMLElement)
          : inViewSet.delete(change.target.id);
      }

      const inView = Array.from(inViewSet.entries())
        .map(([id, el]) => [id, el.offsetTop] as const)
        .filter(([id, _]) => !!id);

      if (inView.length > 0) {
        setInViewId(
          inView.reduce((acc, next) => (next[1] < acc[1] ? next : acc))[0]
        );
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -20% 0px",
    });

    // for (const el of document
    //   .querySelector(postSelector)!
    //   .querySelectorAll(headingSelector)) {
    //   observer.observe(el);
    // }
    return () => observer.disconnect();
  }, []);

  return { inViewId };
}

interface HEntry {
  text: string;
  id: string;
  level: number;
  items?: HEntry[];
}

function getNestedHeadings(headings: readonly HTMLHeadingElement[]): HEntry[] {
  const sentinel: HEntry = { text: "", id: "", level: 0 };
  const traversalStack: HEntry[] = [sentinel];

  for (const h of headings) {
    const hLevel = level(h);
    for (
      let last = traversalStack[traversalStack.length - 1];
      hLevel <= last.level;
      traversalStack.pop(), last = traversalStack[traversalStack.length - 1]
    // eslint-disable-next-line no-empty
    ) {}

    const last = traversalStack[traversalStack.length - 1];
    last.items = last.items || [];
    last.items.push({
      text: h.textContent || "",
      id: h.id,
      level: hLevel,
    });
    traversalStack.push(last.items[last.items.length - 1]);
  }

  return sentinel.items || [];
}

function level(e: HTMLHeadingElement): number {
  return parseInt(e.tagName[1]);
}

function useHeadingsData(postSelector: string, headingSelector: string) {
  const [headings, setHeadings] = useState<HEntry[]>([]);

  useEffect(() => {
    const hs = getNestedHeadings(
      Array.from(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document
          .querySelector(postSelector)!
          .querySelectorAll<HTMLHeadingElement>(headingSelector)
      )
    );
    setHeadings(hs);
  }, []);

  return { headings };
}
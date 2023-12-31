import React from "react";


const Headings = (props: { headings:any, activeId :any}) :any=> {
  const { headings, activeId } = props;

  return (
    <ul>
      {headings.map((heading:any) => (
        <li key={heading.id} className={heading.id === activeId ? "active" : ""}>
          <a
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(`#${heading.id}`).scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            {heading.title}
          </a>
          {heading.items.length > 0 && (
            <ul>
              {heading.items.map((child:any) => (
                <li
                  key={child.id}
                  className={child.id === activeId ? "active" : ""}
                >
                  <a
                    href={`#${child.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(`#${child.id}`).scrollIntoView({
                        behavior: "smooth"
                      });
                    }}
                  >
                    {child.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )};
  
    
  const getNestedHeadings = (headingElements:HTMLElement[]) :  { id: string; title: string; items?: any[] }[] => {
    const nestedHeadings:  { id: string; title: string; items?: any[] }[] = [];
  
    headingElements.forEach((heading, index:number) => {
      const { innerText: title, id } = heading;
  
      if (heading.nodeName === "H2") {
        nestedHeadings.push({ id, title, items: [] });
      } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
        nestedHeadings[nestedHeadings.length - 1].items.push({
          id,
          title
        });
      }
    });
  
    return nestedHeadings;
  };
  /**
   * Dynamically generates the table of contents list, using any H2s and H3s it can find in the main text
   */
  const useHeadingsData = () => {
    const [nestedHeadings, setNestedHeadings] = React.useState([]);
  
    React.useEffect(() => {
      const headingElements : HTMLElement[] = Array.from(
        document.querySelectorAll("main h2, main h3")
      );
  
      // Created a list of headings, with H3s nested
      const newNestedHeadings = getNestedHeadings(headingElements);
      setNestedHeadings(newNestedHeadings);
    }, []);
  
    return { nestedHeadings };
  };

  
  const useIntersectionObserver = (setActiveId:any) => {
   
    const headingElements = Array.from(document.querySelectorAll("h2, h3"));

    const headingElementsRef = React.useRef<any>({});
    React.useEffect(() => {

      const callback = (headings:any) => {
        headingElementsRef.current = headings.reduce((map:any, headingElement:any) => {
          map[headingElement.target.id] = headingElement;
          return map;
        }, headingElementsRef.current);
  
        // Get all headings that are currently visible on the page
        const visibleHeadings :any= [];
        Object.keys(headingElementsRef.current).forEach((key) => {
          const headingElement :any = headingElementsRef.current[key];
          if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
        });
  
        const getIndexFromId = (id:any) =>
          headingElements.findIndex((heading) => heading.id === id);
  
        // If there is only one visible heading, this is our "active" heading
        if (visibleHeadings.length === 1) {
          setActiveId(visibleHeadings[0].target.id);
          // If there is more than one visible heading,
          // choose the one that is closest to the top of the page
        } else if (visibleHeadings.length > 1) {
          const sortedVisibleHeadings = visibleHeadings.sort(
            (a:any, b:any) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
          );
  
          setActiveId(sortedVisibleHeadings[0].target.id);
        }
      };
  
      const observer = new IntersectionObserver(callback, { root: document.querySelector("iframe"), rootMargin: "500px" });
  
      headingElements.forEach((element) => observer.observe(element));
  
      return () => observer.disconnect();
    }, [setActiveId]);
  };
  
  /**
   * Renders the table of contents.
   */
  export const TableOfContents = () => {
    const [activeId, setActiveId] = React.useState();
    const { nestedHeadings } = useHeadingsData();
    useIntersectionObserver(setActiveId);
  
    return (
      <nav aria-label="Table of contents">
        <Headings headings={nestedHeadings} activeId={activeId} />
      </nav>
    );
  };
  
  
  const DummyText =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  
  export const App = () => {
    return (
      <div className="container">
        <main>
          <h2 id="initial-header">Initial header</h2>
          <p>{DummyText}</p>
          <h2 id="second-header">Second header</h2>
          <p>{DummyText}</p>
          <h3 id="third-header">Third header</h3>
          <p>{DummyText}</p>
          <p>{DummyText}</p>
          <h2 id="fourth-header">Fourth header</h2>
          <p>{DummyText}</p>
          <p>{DummyText}</p>
          <p>{DummyText}</p>
          <p>{DummyText}</p>
          <h3 id="fifth-header">Fifth header</h3>
          <p>{DummyText}</p>
          <p>{DummyText}</p>
        </main>
        <TableOfContents />
      </div>
    );
  };
 
  

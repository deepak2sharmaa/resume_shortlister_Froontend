// // import * as React from 'react';

// // const MOBILE_BREAKPOINT = 768;

// // export function useIsMobile() {
// //   const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

// //   React.useEffect(() => {
// //     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
// //     const onChange = () => {
// //       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
// //     };
// //     mql.addEventListener('change', onChange);
// //     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
// //     return () => mql.removeEventListener('change', onChange);
// //   }, []);

// //   return !!isMobile;
// // }



// import { useEffect, useState } from "react";

// export default function useMobile(breakpoint = 768) {
//   const [isMobile, setIsMobile] = useState<boolean>(
//     typeof window !== "undefined" ? window.innerWidth < breakpoint : false
//   );

//   useEffect(() => {
//     const onResize = () => setIsMobile(window.innerWidth < breakpoint);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [breakpoint]);

//   return isMobile;
// }



import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

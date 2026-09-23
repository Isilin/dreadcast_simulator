import { createContext, useContext, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

/** DOM node at the centre of the app footer, owned by AppShell. */
export const AppFooterSlotContext = createContext<HTMLElement | null>(null);

/**
 * Renders its children in the centre of the app footer. The children stay in
 * the page's React tree, so they keep its context (persistence, router...).
 */
export const AppFooterPortal = ({ children }: PropsWithChildren) => {
  const slot = useContext(AppFooterSlotContext);
  return slot ? createPortal(children, slot) : null;
};

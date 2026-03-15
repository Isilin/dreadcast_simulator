import { type PropsWithChildren, useEffect } from 'react';

import { bootstrapAuthSession, initAuthListener } from './auth.service';

export const AuthBootstrap = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    initAuthListener();
    void bootstrapAuthSession();
  }, []);

  return <>{children}</>;
};

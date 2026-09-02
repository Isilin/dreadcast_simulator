import { type PropsWithChildren, useEffect } from 'react';

export const AuthBootstrap = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    void import('./auth.service').then(
      ({ bootstrapAuthSession, initAuthListener }) => {
        initAuthListener();
        void bootstrapAuthSession();
      },
    );
  }, []);

  return <>{children}</>;
};

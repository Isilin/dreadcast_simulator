import { useMemo } from 'react';

import { useTitles } from '../services';
import { indexTitleNames } from './title.rules';

/** Id to name lookup of the title catalogue, empty while it loads. */
export const useTitleNames = () => {
  const { data: titles } = useTitles();
  return useMemo(() => indexTitleNames(titles), [titles]);
};

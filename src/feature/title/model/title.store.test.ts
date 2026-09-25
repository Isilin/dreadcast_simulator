import { beforeEach, describe, expect, it } from 'vitest';

import { initialState, useTitleStore } from './title.store';

describe('title store', () => {
  beforeEach(() => {
    useTitleStore.setState({ titles: initialState });
  });

  it('unlocks then locks a title', () => {
    useTitleStore.getState().toggleTitle('b');
    useTitleStore.getState().toggleTitle('a');

    expect(useTitleStore.getState().titles).toEqual(['a', 'b']);

    useTitleStore.getState().toggleTitle('b');

    expect(useTitleStore.getState().titles).toEqual(['a']);
  });

  it('replaces the titles with a sorted copy', () => {
    const titles = ['c', 'a'];
    useTitleStore.getState().replaceTitles(titles);

    expect(useTitleStore.getState().titles).toEqual(['a', 'c']);
    expect(titles).toEqual(['c', 'a']);
  });
});

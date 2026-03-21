let isReadOnlyBuildView = false;

export const setBuildReadOnlyMode = (value: boolean): void => {
  isReadOnlyBuildView = value;
};

export const getBuildReadOnlyMode = (): boolean => isReadOnlyBuildView;

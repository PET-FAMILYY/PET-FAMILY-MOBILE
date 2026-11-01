import Constants from 'expo-constants';

interface AppExtra {
  commitHash?: string;
  commitDirty?: boolean;
}

export interface AppInfo {
  name: string;
  version: string;
  commitHash: string;
  commitShort: string;
  commitDirty: boolean;
}

export const getAppInfo = (): AppInfo => {
  const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;
  const commitHash = extra.commitHash ?? 'desconhecido';

  return {
    name: Constants.expoConfig?.name ?? 'Pet Family',
    version: Constants.expoConfig?.version ?? '1.0.0',
    commitHash,
    commitShort: commitHash.slice(0, 7),
    commitDirty: extra.commitDirty ?? false,
  };
};

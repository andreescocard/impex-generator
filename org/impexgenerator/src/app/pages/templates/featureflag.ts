export interface FeatureFlag {
  key: string;
  status?: boolean; 
}

export function createFeatureFlagImpex(flag: FeatureFlag): string {
  return `INSERT_UPDATE FeatureFlag; key[unique = true]; status[default = true]
           ; ${flag.key} ; ${flag.status !== undefined ? (flag.status ? 'true' : 'false') : ''}`;
}

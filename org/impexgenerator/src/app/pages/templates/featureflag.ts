export interface FeatureFlag {
    uid: string;
    enabled: boolean;
    name: string;
    description: string;
  }
  

  export function createFeatureFlagImpex(flag: FeatureFlag): string {
    return `INSERT_UPDATE FeatureFlag; uid[unique=true]; enabled; name[lang=en]; description[lang=en]
                         ; ${flag.uid}       ; ${flag.enabled}   ; ${flag.name}  ; ${flag.description}`;
  }
  
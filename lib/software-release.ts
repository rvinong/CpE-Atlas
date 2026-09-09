export type SoftwareRelease = {
  version: string;
  releaseDate: string;
  changes: {
    added?: string[];
    improved?: string[];
    fixed?: string[];
  };
};

export const softwareRelease = {
  status: 'coming-soon',
  version: null,
  releaseDate: null,
  windowsUrl: null,
  fileSize: null,
  changelogUrl: '/changelog',
} as const;

export const releaseHistory: SoftwareRelease[] = [];

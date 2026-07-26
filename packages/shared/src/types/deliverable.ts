export interface Deliverable {
  id: string; // "DEL-013"
  name: string;
  type: 'documentation' | 'code' | 'configuration' | 'rapport' | 'plan' | 'specification' | 'audit';
  description: string;
  mandatory: boolean;
  producedBy: string[]; // Agent IDs
  consumedBy: string[]; // Agent IDs
  qualityGates: string[]; // QG IDs
}

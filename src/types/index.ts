export type TestCategory = 'timed' | 'page' | 'numeric';

export interface TestConfig {
  id: string;
  category: TestCategory;
  name: string;
  subtitle: string;
  durationSeconds?: number;
  targetWords?: number;
  isCustom?: boolean;
}

export type ThemeMode = 'day' | 'night' | 'system';

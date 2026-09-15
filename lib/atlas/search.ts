import { systemList } from './systems';
import { lessons } from './learning';
import type { SystemId } from './types';
export interface SearchResult {
  id: string;
  name: string;
  kind: 'System' | 'Component' | 'Lesson' | 'Action';
  system?: SystemId;
  component?: string;
  lesson?: string;
  detail: string;
  text: string;
}
const aliases: Record<string, string[]> = {
  cpu: ['processor', 'central processing unit'],
  gpu: ['graphics card', 'graphics processing unit'],
  ram: ['memory'],
  ssd: ['storage', 'solid state drive'],
  psu: ['power supply'],
  vrm: ['voltage regulator'],
  atmega: ['microcontroller', 'ATmega328P'],
  digital: ['PWM', 'pulse width modulation', 'digital pins'],
  driver: ['L293D', 'motor driver'],
};
export const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
export const searchIndex: SearchResult[] = systemList
  .flatMap<SearchResult>((system) => [
    {
      id: `system:${system.id}`,
      name: system.name,
      kind: 'System' as const,
      system: system.id,
      detail: system.category,
      text: normalize(`${system.name} ${system.category} ${system.overview}`),
    },
    ...system.parts.map((part) => ({
      id: `${system.id}:${part.id}`,
      name: part.name,
      kind: 'Component' as const,
      system: system.id,
      component: part.id,
      detail: system.name,
      text: normalize(
        [
          part.name,
          part.fullName,
          part.category,
          part.description,
          part.lesson,
          part.aliases,
          part.searchKeywords,
          part.relatedTopics,
          aliases[part.id],
          Object.values(part.specifications),
        ]
          .flat(Infinity)
          .join(' '),
      ),
    })),
  ])
  .concat(
    lessons.map((lesson) => ({
      id: `lesson:${lesson.id}`,
      name: lesson.title,
      kind: 'Lesson' as const,
      system: lesson.system,
      lesson: lesson.id,
      detail: 'Guided lesson',
      text: normalize(
        `${lesson.title} ${lesson.description} ${lesson.steps.map((s) => s.description).join(' ')}`,
      ),
    })),
  );
export function searchAtlas(query: string, actions: SearchResult[] = []) {
  const terms = normalize(query).split(' ').filter(Boolean);
  return [...actions, ...searchIndex]
    .filter((item) => terms.every((term) => item.text.includes(term)))
    .sort(
      (a, b) =>
        Number(normalize(b.name).startsWith(normalize(query))) -
        Number(normalize(a.name).startsWith(normalize(query))),
    );
}

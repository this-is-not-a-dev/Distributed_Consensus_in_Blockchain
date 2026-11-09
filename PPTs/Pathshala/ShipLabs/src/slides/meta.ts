import type { Part } from '../config';

export interface SlideMeta {
  id: number;
  title: string;
  part: Part;
  stepCount: number;
  suggestedMinutes: number;
}

const rows: [string, Part, number, number][] = [
  ['ShipLabs', 'intro', 1, 1],
  ['The Road Map', 'intro', 3, 2],
  ['The Problem', 'A', 4, 3],
  ['What the System Must Guarantee', 'A', 2, 2],
  ['Meet ShipLabs', 'A', 5, 3],
  ["Who It's For", 'A', 4, 3],
  ['System Architecture', 'A', 5, 4],
  ['Tech Stack', 'A', 2, 2],
  ['Data Model', 'A', 3, 3],
  ['Answers That Stream Live', 'B', 3, 3],
  ['Unboxing Control Blocks', 'B', 3, 3],
  ['Tutor: Getting to Know You', 'B', 3, 3],
  ['The Tutor State Machine', 'B', 2, 3],
  ['The Intent Gate', 'B', 4, 3],
  ["Points You Can't Farm", 'B', 3, 3],
  ["A Question That's Actually Right", 'B', 2, 2],
  ['Four Checkpoints of Truth', 'B', 4, 4],
  ['Draw It or Find It', 'B', 2, 2],
  ['Your Notes Become a Course', 'B', 3, 3],
  ['Beating the Forgetting Curve', 'B', 3, 3],
  ['Credits, XP and Ranks', 'B', 3, 3],
  ['Coach: One Sentence, Full Project', 'C', 3, 3],
  ['The Code Review', 'C', 3, 3],
  ['VS Code: Connect Once', 'C', 3, 3],
  ['Every 5 Seconds', 'C', 2, 2],
  ['The Pause That Triggers a Review', 'C', 3, 3],
  ['Comments, Never Code', 'C', 2, 3],
  ["Hands Off, I'll Run It", 'C', 3, 3],
  ['Everything on One Page', 'C', 2, 2],
  ['Three Engines, One Answer', 'C', 3, 2],
  ['Locks Everywhere', 'C', 2, 3],
  ['By the Numbers', 'C', 1, 2],
  ['How It Was Built', 'C', 2, 2],
  ['Thank You', 'C', 1, 1],
];

export const SLIDE_META: SlideMeta[] = rows.map(([title, part, stepCount, suggestedMinutes], i) => ({
  id: i + 1,
  title,
  part,
  stepCount,
  suggestedMinutes,
}));

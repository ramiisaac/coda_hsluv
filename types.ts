// Type definitions for the HSLuv Coda Pack

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSLuvColor {
  h: number;
  s: number;
  l: number;
}

export interface HPLuvColor {
  h: number;
  p: number;
  l: number;
}

export interface CMYKColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'large' | 'small';
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia';

export const WCAG_CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

export const STANDARD_COLORS = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",
} as const;

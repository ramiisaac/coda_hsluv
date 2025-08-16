import { Hsluv } from 'hsluv';

import {
  RGBColor,
  CMYKColor,
  ColorBlindnessType,
  WCAG_CONTRAST_RATIOS,
  WCAGLevel,
  TextSize,
} from './types';

/**
 * Validates that a hex color string is in the correct format
 */
export function isValidHexColor(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

/**
 * Validates that HSLuv values are within acceptable ranges
 */
export function isValidHsluv(h: number, s: number, l: number): boolean {
  return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
}

/**
 * Validates that HPLuv values are within acceptable ranges
 */
export function isValidHpluv(h: number, p: number, l: number): boolean {
  return h >= 0 && h <= 360 && p >= 0 && p <= 100 && l >= 0 && l <= 100;
}

/**
 * Validates that RGB values are within acceptable ranges
 */
export function isValidRgb(r: number, g: number, b: number): boolean {
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

/**
 * Convert hex to RGB array
 */
export function hexToRgb(hex: string): number[] {
  return (
    hex
      .replace(/^#/, '')
      .match(/.{2}/g)
      ?.map((x) => parseInt(x, 16)) || [0, 0, 0]
  );
}

/**
 * Convert RGB array to hex
 */
export function rgbToHex(rgb: number[]): string {
  return (
    '#' + rgb.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')
  );
}

/**
 * Get relative luminance of a color
 */
export function getLuminance(hex: string): number {
  let rgb = hexToRgb(hex).map((x) => x / 255);
  rgb = rgb.map((x) =>
    x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Number(ratio.toFixed(2));
}

/**
 * Mix two colors with a given ratio
 */
export function mixColors(
  color1: string,
  color2: string,
  ratio: number,
): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const mixed = rgb1.map((c, i) => c * (1 - ratio) + rgb2[i] * ratio);
  return rgbToHex(mixed);
}

/**
 * Rotate hue by degrees
 */
export function rotateHue(h: number, degrees: number): number {
  return (h + degrees) % 360;
}

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk(r: number, g: number, b: number): CMYKColor {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  const k = Math.min(c, m, y);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 1 };
  }

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  return {
    c: Math.round(c * 100) / 100,
    m: Math.round(m * 100) / 100,
    y: Math.round(y * 100) / 100,
    k: Math.round(k * 100) / 100,
  };
}

/**
 * Convert CMYK to RGB
 */
export function cmykToRgb(
  c: number,
  m: number,
  y: number,
  k: number,
): RGBColor {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

/**
 * Simulate color blindness
 */
export function simulateColorBlindness(
  rgb: number[],
  type: ColorBlindnessType,
): number[] {
  const matrices = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
  };

  const matrix = matrices[type];
  return [
    rgb[0] * matrix[0][0] + rgb[1] * matrix[0][1] + rgb[2] * matrix[0][2],
    rgb[0] * matrix[1][0] + rgb[1] * matrix[1][1] + rgb[2] * matrix[1][2],
    rgb[0] * matrix[2][0] + rgb[1] * matrix[2][1] + rgb[2] * matrix[2][2],
  ].map(Math.round);
}

/**
 * Check WCAG accessibility compliance
 */
export function checkAccessibility(
  foreground: string,
  background: string,
  level: WCAGLevel,
  size: TextSize,
): boolean {
  const ratio = calculateContrastRatio(foreground, background);

  if (level === 'AA') {
    return size === 'large'
      ? ratio >= WCAG_CONTRAST_RATIOS.AA_LARGE
      : ratio >= WCAG_CONTRAST_RATIOS.AA_NORMAL;
  } else if (level === 'AAA') {
    return size === 'large'
      ? ratio >= WCAG_CONTRAST_RATIOS.AAA_LARGE
      : ratio >= WCAG_CONTRAST_RATIOS.AAA_NORMAL;
  }

  return false;
}

/**
 * Evaluate color harmony between two colors
 */
export function evaluateColorHarmony(color1: string, color2: string): string {
  const hsluv1 = new Hsluv();
  const hsluv2 = new Hsluv();
  hsluv1.hex = color1;
  hsluv2.hex = color2;
  hsluv1.hexToHsluv();
  hsluv2.hexToHsluv();

  let hueDiff = Math.abs(hsluv1.hsluv_h - hsluv2.hsluv_h);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;

  if (hueDiff < 30) return 'Analogous (harmonious)';
  if (Math.abs(hueDiff - 180) < 30) return 'Complementary (high contrast)';
  if (Math.abs(hueDiff - 120) < 30) return 'Triadic (balanced)';
  if (Math.abs(hueDiff - 90) < 30) return 'Square (vibrant)';
  return 'Discordant (use with caution)';
}

/**
 * Determine if a color is warm or cool
 */
export function isWarmOrCool(color: string): string {
  const hsluv = new Hsluv();
  hsluv.hex = color;
  hsluv.hexToHsluv();
  return hsluv.hsluv_h >= 30 && hsluv.hsluv_h <= 210 ? 'Cool' : 'Warm';
}

/**
 * Get common color name
 */
export function getColorName(color: string): string {
  const colorNames: Record<string, string> = {
    '#FF0000': 'Red',
    '#00FF00': 'Lime',
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#FF00FF': 'Magenta',
    '#00FFFF': 'Cyan',
    '#000000': 'Black',
    '#FFFFFF': 'White',
  };
  return colorNames[color.toUpperCase()] || 'Unknown';
}

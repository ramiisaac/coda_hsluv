import * as coda from '@codahq/packs-sdk';
import { Hsluv } from 'hsluv';
import {
  isValidHexColor,
  isValidHsluv,
  isValidHpluv,
  isValidRgb,
  hexToRgb,
  rgbToHex,
  calculateContrastRatio,
  mixColors,
  rotateHue,
  rgbToCmyk,
  cmykToRgb,
  simulateColorBlindness,
  checkAccessibility,
  evaluateColorHarmony,
  isWarmOrCool,
  getColorName,
} from './helpers';
import { RGBSchema, HSLuvSchema, HPLuvSchema, CMYKSchema } from './schemas';
import { STANDARD_COLORS, WCAG_CONTRAST_RATIOS } from './types';

export const pack = coda.newPack();

// Color Conversion Formulas

pack.addFormula({
  name: 'HexToRgb',
  description: 'Convert Hex to RGB',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'hex',
      description: 'Hex color',
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: RGBSchema,
  execute: async function ([hex]) {
    if (!isValidHexColor(hex)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const color = new Hsluv();
    color.hex = hex;
    color.hexToRgb();
    return {
      r: Math.round(color.rgb_r * 255),
      g: Math.round(color.rgb_g * 255),
      b: Math.round(color.rgb_b * 255),
    };
  },
});

pack.addFormula({
  name: 'RgbToHex',
  description: 'Convert RGB to Hex',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'r',
      description: 'Red',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'g',
      description: 'Green',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'b',
      description: 'Blue',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([r, g, b]) {
    if (!isValidRgb(r, g, b)) {
      throw new coda.UserVisibleError(
        'Invalid RGB values. Values must be between 0 and 255.',
      );
    }

    const color = new Hsluv();
    color.rgb_r = r / 255;
    color.rgb_g = g / 255;
    color.rgb_b = b / 255;
    color.rgbToHex();
    return color.hex;
  },
});

pack.addFormula({
  name: 'HexToHsluv',
  description: 'Convert Hex to HSLuv',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'hex',
      description: 'Hex color',
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: HSLuvSchema,
  execute: async function ([hex]) {
    if (!isValidHexColor(hex)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const color = new Hsluv();
    color.hex = hex;
    color.hexToHsluv();
    return {
      h: Math.round(color.hsluv_h * 100) / 100,
      s: Math.round(color.hsluv_s * 100) / 100,
      l: Math.round(color.hsluv_l * 100) / 100,
    };
  },
});

pack.addFormula({
  name: 'HsluvToHex',
  description: 'Convert HSLuv to Hex',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'h',
      description: 'Hue',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 's',
      description: 'Saturation',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'l',
      description: 'Lightness',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([h, s, l]) {
    if (!isValidHsluv(h, s, l)) {
      throw new coda.UserVisibleError(
        'Invalid HSLuv values. Hue: 0-360, Saturation and Lightness: 0-100.',
      );
    }

    const color = new Hsluv();
    color.hsluv_h = h;
    color.hsluv_s = s;
    color.hsluv_l = l;
    color.hsluvToHex();
    return color.hex;
  },
});

pack.addFormula({
  name: 'HexToHpluv',
  description: 'Convert Hex to HPLuv',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'hex',
      description: 'Hex color (e.g., #FF0000)',
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: HPLuvSchema,
  execute: async function ([hex]) {
    if (!isValidHexColor(hex)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const color = new Hsluv();
    color.hex = hex;
    color.hexToHpluv();
    return {
      h: Math.round(color.hpluv_h * 100) / 100,
      p: Math.round(color.hpluv_p * 100) / 100,
      l: Math.round(color.hpluv_l * 100) / 100,
    };
  },
});

pack.addFormula({
  name: 'HpluvToHex',
  description: 'Convert HPLuv to Hex',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'h',
      description: 'Hue (0-360)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'p',
      description: 'Percent (0-100)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'l',
      description: 'Lightness (0-100)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([h, p, l]) {
    if (!isValidHpluv(h, p, l)) {
      throw new coda.UserVisibleError(
        'Invalid HPLuv values. Hue: 0-360, Percent and Lightness: 0-100.',
      );
    }

    const color = new Hsluv();
    color.hpluv_h = h;
    color.hpluv_p = p;
    color.hpluv_l = l;
    color.hpluvToHex();
    return color.hex;
  },
});

// Add ComplementaryColor formula
pack.addFormula({
  name: 'ComplementaryColor',
  description: 'Generate a complementary color',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'hex',
      description: 'Base hex color (e.g., #FF0000)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([hex]) {
    if (!isValidHexColor(hex)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const color = new Hsluv();
    color.hex = hex;
    color.hexToHsluv();
    color.hsluv_h = rotateHue(color.hsluv_h, 180);
    color.hsluvToHex();
    return color.hex;
  },
});

// Continue with the rest of the formulas...
// (Keep all the existing formulas from the previous pack.ts but update naming if needed)

pack.addFormula({
  name: 'RGBToCMYK',
  description: 'Convert RGB values to CMYK values',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'r',
      description: 'Red (0-255)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'g',
      description: 'Green (0-255)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'b',
      description: 'Blue (0-255)',
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: CMYKSchema,
  execute: async function ([r, g, b]) {
    if (!isValidRgb(r, g, b)) {
      throw new coda.UserVisibleError(
        'Invalid RGB values. Values must be between 0 and 255.',
      );
    }
    return rgbToCmyk(r, g, b);
  },
});

pack.addFormula({
  name: 'CMYKToRGB',
  description: 'Convert CMYK values to RGB values',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'c',
      description: 'Cyan (0-1)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'm',
      description: 'Magenta (0-1)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'y',
      description: 'Yellow (0-1)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'k',
      description: 'Key/Black (0-1)',
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: RGBSchema,
  execute: async function ([c, m, y, k]) {
    if (c < 0 || c > 1 || m < 0 || m > 1 || y < 0 || y > 1 || k < 0 || k > 1) {
      throw new coda.UserVisibleError(
        'Invalid CMYK values. All values must be between 0 and 1.',
      );
    }
    return cmykToRgb(c, m, y, k);
  },
});

// Color Analysis Formulas

pack.addFormula({
  name: 'ContrastRatio',
  description: 'Calculate the contrast ratio between two colors',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color1',
      description: 'First hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color2',
      description: 'Second hex color',
    }),
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([color1, color2]) {
    if (!isValidHexColor(color1) || !isValidHexColor(color2)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    return calculateContrastRatio(color1, color2);
  },
});

pack.addFormula({
  name: 'IsAccessible',
  description:
    'Check if a text color is accessible on a given background color according to WCAG guidelines',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'foreground',
      description: 'Foreground hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'background',
      description: 'Background hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'level',
      description: "WCAG level: 'AA' or 'AAA'",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'size',
      description: "Text size: 'large' or 'small'",
    }),
  ],
  resultType: coda.ValueType.Boolean,
  execute: async function ([foreground, background, level, size]) {
    if (!isValidHexColor(foreground) || !isValidHexColor(background)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (!['AA', 'AAA'].includes(level)) {
      throw new coda.UserVisibleError(
        "Invalid WCAG level. Please use 'AA' or 'AAA'.",
      );
    }
    if (!['large', 'small'].includes(size)) {
      throw new coda.UserVisibleError(
        "Invalid text size. Please use 'large' or 'small'.",
      );
    }

    return checkAccessibility(
      foreground,
      background,
      level as any,
      size as any,
    );
  },
});

pack.addFormula({
  name: 'SuggestTextColor',
  description:
    'Suggest an accessible text color for a given background color based on WCAG guidelines',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'backgroundColor',
      description: 'Background hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'level',
      description: "WCAG level: 'AA' or 'AAA'",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([backgroundColor, level]) {
    if (!isValidHexColor(backgroundColor)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (!['AA', 'AAA'].includes(level)) {
      throw new coda.UserVisibleError(
        "Invalid WCAG level. Please use 'AA' or 'AAA'.",
      );
    }

    const blackContrast = calculateContrastRatio(
      backgroundColor,
      STANDARD_COLORS.BLACK,
    );
    const whiteContrast = calculateContrastRatio(
      backgroundColor,
      STANDARD_COLORS.WHITE,
    );
    const threshold =
      level === 'AAA'
        ? WCAG_CONTRAST_RATIOS.AAA_NORMAL
        : WCAG_CONTRAST_RATIOS.AA_NORMAL;

    if (blackContrast >= threshold && blackContrast > whiteContrast) {
      return STANDARD_COLORS.BLACK;
    } else if (whiteContrast >= threshold) {
      return STANDARD_COLORS.WHITE;
    } else {
      return 'No sufficiently contrasting color found';
    }
  },
});

pack.addFormula({
  name: 'ColorName',
  description: 'Get the name of a color',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color',
      description: 'Hex color',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color]) {
    return getColorName(color);
  },
});

pack.addFormula({
  name: 'IsWarmOrCool',
  description: 'Determine if a color is warm or cool',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color',
      description: 'Hex color',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color]) {
    if (!isValidHexColor(color)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    return isWarmOrCool(color);
  },
});

// Color Harmony Formulas

pack.addFormula({
  name: 'EvaluateColorHarmony',
  description: 'Evaluate the harmony of a color combination',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color1',
      description: 'First hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color2',
      description: 'Second hex color',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color1, color2]) {
    if (!isValidHexColor(color1) || !isValidHexColor(color2)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    return evaluateColorHarmony(color1, color2);
  },
});

// Color Scheme Generation Formulas

pack.addFormula({
  name: 'MonochromaticScheme',
  description: 'Generate a monochromatic color scheme',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'baseColor',
      description: 'Base hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'count',
      description: 'Number of colors to generate',
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({ type: coda.ValueType.String }),
  execute: async function ([baseColor, count]) {
    if (!isValidHexColor(baseColor)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (count < 1 || count > 20) {
      throw new coda.UserVisibleError('Count must be between 1 and 20.');
    }

    const color = new Hsluv();
    color.hex = baseColor;
    color.hexToHsluv();
    const baseHue = color.hsluv_h;
    const baseSat = color.hsluv_s;

    const scheme: string[] = [];
    for (let i = 0; i < count; i++) {
      color.hsluv_h = baseHue;
      color.hsluv_s = baseSat;
      color.hsluv_l = count === 1 ? color.hsluv_l : (100 / (count - 1)) * i;
      color.hsluvToHex();
      scheme.push(color.hex);
    }
    return scheme;
  },
});

pack.addFormula({
  name: 'AnalogousScheme',
  description: 'Generate an analogous color scheme',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'baseColor',
      description: 'Base hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'count',
      description: 'Number of colors to generate',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'angle',
      description: 'Angle between colors (default: 30)',
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({ type: coda.ValueType.String }),
  execute: async function ([baseColor, count, angle = 30]) {
    if (!isValidHexColor(baseColor)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (count < 1 || count > 20) {
      throw new coda.UserVisibleError('Count must be between 1 and 20.');
    }
    if (angle < 1 || angle > 180) {
      throw new coda.UserVisibleError(
        'Angle must be between 1 and 180 degrees.',
      );
    }

    const color = new Hsluv();
    color.hex = baseColor;
    color.hexToHsluv();

    const scheme: string[] = [color.hex];
    for (let i = 1; i < count; i++) {
      color.hsluv_h = rotateHue(color.hsluv_h, angle);
      color.hsluvToHex();
      scheme.push(color.hex);
    }
    return scheme;
  },
});

pack.addFormula({
  name: 'TriadicScheme',
  description: 'Generate a triadic color scheme',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'baseColor',
      description: 'Base hex color',
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({ type: coda.ValueType.String }),
  execute: async function ([baseColor]) {
    if (!isValidHexColor(baseColor)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const color = new Hsluv();
    color.hex = baseColor;
    color.hexToHsluv();

    const scheme: string[] = [color.hex];
    for (let i = 1; i < 3; i++) {
      color.hsluv_h = rotateHue(color.hsluv_h, 120);
      color.hsluvToHex();
      scheme.push(color.hex);
    }
    return scheme;
  },
});

pack.addFormula({
  name: 'TetradicScheme',
  description: 'Generate a tetradic (rectangle) color scheme',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'baseColor',
      description: 'Base hex color',
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({ type: coda.ValueType.String }),
  execute: async function ([baseColor]) {
    if (!isValidHexColor(baseColor)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const color = new Hsluv();
    color.hex = baseColor;
    color.hexToHsluv();
    const baseHue = color.hsluv_h;

    const scheme: string[] = [color.hex];
    color.hsluv_h = rotateHue(baseHue, 60);
    color.hsluvToHex();
    scheme.push(color.hex);
    color.hsluv_h = rotateHue(baseHue, 180);
    color.hsluvToHex();
    scheme.push(color.hex);
    color.hsluv_h = rotateHue(baseHue, 240);
    color.hsluvToHex();
    scheme.push(color.hex);
    return scheme;
  },
});

// Color Manipulation Formulas

pack.addFormula({
  name: 'AdjustBrightness',
  description: 'Adjust the brightness of a color',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color',
      description: 'Hex color to adjust',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'adjustment',
      description: 'Brightness adjustment (-100 to 100)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color, adjustment]) {
    if (!isValidHexColor(color)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const hsluv = new Hsluv();
    hsluv.hex = color;
    hsluv.hexToHsluv();
    hsluv.hsluv_l = Math.max(0, Math.min(100, hsluv.hsluv_l + adjustment));
    hsluv.hsluvToHex();
    return hsluv.hex;
  },
});

pack.addFormula({
  name: 'AdjustSaturation',
  description: 'Adjust the saturation of a color',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color',
      description: 'Hex color to adjust',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'adjustment',
      description: 'Saturation adjustment (-100 to 100)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color, adjustment]) {
    if (!isValidHexColor(color)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }

    const hsluv = new Hsluv();
    hsluv.hex = color;
    hsluv.hexToHsluv();
    hsluv.hsluv_s = Math.max(0, Math.min(100, hsluv.hsluv_s + adjustment));
    hsluv.hsluvToHex();
    return hsluv.hex;
  },
});

pack.addFormula({
  name: 'MixColors',
  description: 'Mix two colors with a given ratio',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color1',
      description: 'First hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color2',
      description: 'Second hex color',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'ratio',
      description: 'Mixing ratio (0 to 1)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color1, color2, ratio]) {
    if (!isValidHexColor(color1) || !isValidHexColor(color2)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (ratio < 0 || ratio > 1) {
      throw new coda.UserVisibleError('Ratio must be between 0 and 1.');
    }

    return mixColors(color1, color2, ratio);
  },
});

pack.addFormula({
  name: 'Tint',
  description: 'Create a tint of a color (mix with white)',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color',
      description: 'Hex color to tint',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'amount',
      description: 'Tint amount (0 to 1)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color, amount]) {
    if (!isValidHexColor(color)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (amount < 0 || amount > 1) {
      throw new coda.UserVisibleError('Amount must be between 0 and 1.');
    }

    return mixColors(color, STANDARD_COLORS.WHITE, amount);
  },
});

pack.addFormula({
  name: 'Shade',
  description: 'Create a shade of a color (mix with black)',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color',
      description: 'Hex color to shade',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'amount',
      description: 'Shade amount (0 to 1)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color, amount]) {
    if (!isValidHexColor(color)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (amount < 0 || amount > 1) {
      throw new coda.UserVisibleError('Amount must be between 0 and 1.');
    }

    return mixColors(color, STANDARD_COLORS.BLACK, amount);
  },
});

pack.addFormula({
  name: 'SimulateColorBlindness',
  description: 'Simulate how a color appears to people with color blindness',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color',
      description: 'Hex color to simulate',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'type',
      description:
        'Type of color blindness (protanopia, deuteranopia, or tritanopia)',
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([color, type]) {
    if (!isValidHexColor(color)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (!['protanopia', 'deuteranopia', 'tritanopia'].includes(type)) {
      throw new coda.UserVisibleError(
        'Invalid color blindness type. Use protanopia, deuteranopia, or tritanopia.',
      );
    }

    const rgb = hexToRgb(color);
    const simulatedRgb = simulateColorBlindness(rgb, type as any);
    return rgbToHex(simulatedRgb);
  },
});

// Gradients

pack.addFormula({
  name: 'LinearGradient',
  description: 'Generate a linear gradient between two colors',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color1',
      description: 'Start color (hex)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'color2',
      description: 'End color (hex)',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'steps',
      description: 'Number of color steps',
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({ type: coda.ValueType.String }),
  execute: async function ([color1, color2, steps]) {
    if (!isValidHexColor(color1) || !isValidHexColor(color2)) {
      throw new coda.UserVisibleError(
        'Invalid hex color format. Please use #RRGGBB format.',
      );
    }
    if (steps < 2 || steps > 100) {
      throw new coda.UserVisibleError('Steps must be between 2 and 100.');
    }

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const gradient: string[] = [];

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio);
      const g = Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio);
      const b = Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio);
      gradient.push(rgbToHex([r, g, b]));
    }
    return gradient;
  },
});

// Column Format

pack.addColumnFormat({
  name: 'ColorPreview',
  instructions: "Displays color preview(s) based on the cell's hex value(s)",
  formulaName: 'ColorPreviewFormatter',
  matchers: [
    new RegExp('#[0-9A-Fa-f]{6}'),
    new RegExp('#[0-9A-Fa-f]{6}(,\\s*#[0-9A-Fa-f]{6})*'),
  ],
});

pack.addFormula({
  name: 'ColorPreviewFormatter',
  description: 'Formats a cell with color preview(s) based on its hex value(s)',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'input',
      description:
        'The hex color value or comma-separated list of hex color values',
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([input]) {
    function normalizeColor(hex: string): string | null {
      hex = hex.trim().replace(/^#/, '');
      if (!/^[0-9A-Fa-f]{3,6}$/.test(hex)) {
        console.warn(`Skipping invalid hex color: #${hex}`);
        return null;
      }
      if (hex.length < 6) {
        hex = hex
          .split('')
          .map((char) => char + char)
          .join('');
      }
      return '#' + hex;
    }

    function generateColorSVG(hex: string): string | null {
      const normalizedHex = normalizeColor(hex);
      if (!normalizedHex) return null;
      return `
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" fill="${normalizedHex}" />
        </svg>
      `.trim();
    }

    const colors = input.split(',');
    const validSvgs = colors
      .map(generateColorSVG)
      .filter((svg) => svg !== null);

    if (validSvgs.length === 0) {
      throw new coda.UserVisibleError(
        'No valid colors found. Please use 3 or 6-digit hex color codes.',
      );
    }

    let svg: string;
    if (validSvgs.length > 1) {
      svg = `
        <svg viewBox="0 0 ${validSvgs.length * 22} 20" xmlns="http://www.w3.org/2000/svg">
          ${validSvgs
            .map(
              (colorSvg, index) =>
                `<g transform="translate(${index * 22}, 0)">${colorSvg}</g>`,
            )
            .join('')}
        </svg>
      `.trim();
    } else {
      svg = validSvgs[0]!;
    }

    const encoded = Buffer.from(svg).toString('base64');
    return coda.SvgConstants.DataUrlPrefix + encoded;
  },
});

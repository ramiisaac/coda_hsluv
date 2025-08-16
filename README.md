# Coda HSLuv Pack

This Coda Pack provides a collection of formulas for working with colors, including color conversion, color analysis, color harmony, color scheme generation, and color manipulation.

## Files

- pack.ts
  - Responsibility: the Pack entrypoint — registers all Coda formulas, column formats, and ties the SDK schemas to runtime logic.
  - Notable formulas (examples):
    - HexToRgb(hex) -> { r, g, b }  
      Example: `=HexToRgb("#FF0000")` returns `{r:255,g:0,b:0}`
    - RgbToHex(r,g,b) -> "#RRGGBB"  
      Example: `=RgbToHex(255,0,0)` returns `"#FF0000"`
    - HexToHsluv(hex) / HsluvToHex(h,s,l)
    - HexToHpluv(hex) / HpluvToHex(h,p,l)
    - ComplementaryColor(hex) -> complementary hex
    - RGBToCMYK(...) / CMYKToRGB(...)
    - ContrastRatio(color1, color2) -> number
    - IsAccessible(foreground, background, level, size) -> boolean
    - SuggestTextColor(backgroundColor, level) -> "#000000" | "#FFFFFF" | message
    - ColorName(hex) -> common color name
    - IsWarmOrCool(hex) -> "Warm" | "Cool"
    - EvaluateColorHarmony(color1, color2) -> string
    - MonochromaticScheme(baseColor,count), AnalogousScheme(...), TriadicScheme(...), TetradicScheme(...)
    - AdjustBrightness/AdjustSaturation, MixColors, Tint, Shade
    - SimulateColorBlindness(color, type)
    - LinearGradient(color1, color2, steps) -> array of hex
  - Column format:
    - ColorPreview (uses ColorPreviewFormatter) — returns a small SVG data URL to preview one or more hex colors.

- helpers.ts
  - Responsibility: pure helper utilities used by pack.ts. Keep helper code focused and well-tested.
  - Functions:
    - isValidHexColor(hex): validate `#RRGGBB`
    - isValidHsluv(h,s,l), isValidHpluv(h,p,l), isValidRgb(r,g,b)
    - hexToRgb(hex) -> [r,g,b]
    - rgbToHex([r,g,b]) -> "#RRGGBB"
    - getLuminance(hex) -> number (relative luminance)
    - calculateContrastRatio(color1,color2) -> number (rounded to 2 decimals)
    - mixColors(color1,color2,ratio) -> mixed hex
    - rotateHue(h,degrees) -> normalized hue
    - rgbToCmyk(r,g,b) -> {c,m,y,k}
    - cmykToRgb(c,m,y,k) -> {r,g,b}
    - simulateColorBlindness(rgbArray,type) -> simulated rgb array
    - checkAccessibility(foreground, background, level, size) -> boolean
    - evaluateColorHarmony(color1,color2) -> string
    - isWarmOrCool(color) -> "Warm"|"Cool"
    - getColorName(color) -> common name or "Unknown"
  - Notes:
    - Contrast uses WCAG luminance formula.
    - Validation accepts 6-digit hex (#RRGGBB). The ColorPreviewFormatter tolerates #RGB by normalizing to 6 digits.
    - Color-blindness matrices are simple linear projections for protanopia, deuteranopia, and tritanopia.

- schemas.ts
  - Responsibility: Coda object schema definitions used by formulas that return structured objects.
  - Exports:
    - RGBSchema — { r:number, g:number, b:number }
    - HSLuvSchema — { h:number, s:number, l:number }
    - HPLuvSchema — { h:number, p:number, l:number }
    - CMYKSchema — { c:number, m:number, y:number, k:number }
  - These schemas are attached to formulas returning objects so Coda can render structured results.

- types.ts
  - Responsibility: TypeScript type aliases and constants shared across the pack.
  - Exports:
    - Interfaces: RGBColor, HSLuvColor, HPLuvColor, CMYKColor
    - Type aliases: WCAGLevel = 'AA'|'AAA', TextSize = 'large'|'small', ColorBlindnessType = 'protanopia'|'deuteranopia'|'tritanopia'
    - WCAG_CONTRAST_RATIOS — constants for AA/AAA thresholds
    - STANDARD_COLORS — BLACK/WHITE hex values

## Development & Usage

- Build: `pnpm run coda:build`
- Validate: `pnpm run coda:validate`
- Upload: `pnpm run coda:upload`
- Release: `pnpm run coda:release`

The pack code uses the `hsluv` npm package for conversions. All formulas are registered from `pack.ts` and rely on helpers in `helpers.ts` and schemas in `schemas.ts`.

## Quick Examples

- Convert hex to HSLuv:
  `=HexToHsluv("#FF0000")` -> { h: 0, s: 100, l: 50 }

- Get complementary color:
  `=ComplementaryColor("#FF0000")` -> "#00FFFF" (example, actual result from HSLuv conversion)

- Check accessibility:
  `=IsAccessible("#000000","#FFFFFF","AA","small")` -> true

- Generate a gradient:
  `=LinearGradient("#FF0000","#00FF00",5)` -> array of 5 hex colors between red and green

## Notes & Contributing

- The pack uses the `hsluv` library for conversions between hex, HSLuv, and HPLuv.
- Helpers encapsulate color math so formulas remain concise.
- If you add formulas to pack.ts, update README examples and list them in the Files -> pack.ts section.

## Existing formula reference

### Color Conversion

### HexToRgb

Convert a hex color to RGB values.

**Example:**
`=HexToRgb("#FF0000")` returns `{r: 255, g: 0, b: 0}`

### RgbToHex

Convert RGB values to a hex color.

**Example:**
`=RgbToHex(255, 0, 0)` returns `"#FF0000"`

### HexToHsluv

Convert a hex color to HSLUV values.

**Example:**
`=HexToHsluv("#FF0000")` returns `{h: 0, s: 100, l: 50}`

### HsluvToHex

Convert HSLUV values to a hex color.

**Example:**
`=HsluvToHex(0, 100, 50)` returns `"#FF0000"`

### HexToHpluv

Convert a hex color to HPLuv values.

**Example:**
`=HexToHpluv("#FF0000")` returns `{h: 0, p: 100, l: 53.23}`

### HpluvToHex

Convert HPLuv values to a hex color.

**Example:**
`=HpluvToHex(0, 100, 53.23)` returns `"#FF0000"`

### RGBToCMYK

Convert RGB values to CMYK values.

**Example:**
`=RGBToCMYK(255, 0, 0)` returns `{c: 0, m: 1, y: 1, k: 0}`

### CMYKToRGB

Convert CMYK values to RGB values.

**Example:**
`=CMYKToRGB(0, 1, 1, 0)` returns `{r: 255, g: 0, b: 0}`

## Color Analysis

### ContrastRatio

Calculate the contrast ratio between two colors.

**Example:**
`=ContrastRatio("#000000", "#FFFFFF")` returns `21`

### IsAccessible

Check if a text color is accessible on a given background color according to WCAG guidelines.

**Example:**
`=IsAccessible("#000000", "#FFFFFF", "AA", "large")` returns `true`

### SuggestTextColor

Suggest an accessible text color for a given background color based on WCAG guidelines.

**Example:**
`=SuggestTextColor("#FF0000", "AA")` returns `"#FFFFFF"`

### ColorName

Get the name of a color.

**Example:**
`=ColorName("#FF0000")` returns `"Red"`

### IsWarmOrCool

Determine if a color is warm or cool.

**Example:**
`=IsWarmOrCool("#FF0000")` returns `"Warm"`

## Color Harmony

### EvaluateColorHarmony

Evaluate the harmony of a color combination.

**Example:**
`=EvaluateColorHarmony("#FF0000", "#00FF00")` returns `"Complementary (high contrast)"`

## Color Scheme Generation

### MonochromaticScheme

Generate a monochromatic color scheme.

**Example:**
`=MonochromaticScheme("#FF0000", 5)` returns `["#FF0000", "#E60000", "#CC0000", "#B30000", "#990000"]`

### AnalogousScheme

Generate an analogous color scheme.

**Example:**
`=AnalogousScheme("#FF0000", 5, 30)` returns `["#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00"]`

### TriadicScheme

Generate a triadic color scheme.

**Example:**
`=TriadicScheme("#FF0000")` returns `["#FF0000", "#00FF00", "#0000FF"]`

### TetradicScheme

Generate a tetradic (rectangle) color scheme.

**Example:**
`=TetradicScheme("#FF0000")` returns `["#FF0000", "#00FF00", "#0000FF", "#FF00FF"]`

## Color Manipulation

### AdjustBrightness

Adjust the brightness of a color.

**Example:**
`=AdjustBrightness("#FF0000", 20)` returns `"#FF3333"`

### AdjustSaturation

Adjust the saturation of a color.

**Example:**
`=AdjustSaturation("#FF0000", -50)` returns `"#800000"`

### MixColors

Mix two colors with a given ratio.

**Example:**
`=MixColors("#FF0000", "#00FF00", 0.5)` returns `"#808000"`

### Tint

Create a tint of a color (mix with white).

**Example:**
`=Tint("#FF0000", 0.5)` returns `"#FF8080"`

### Shade

Create a shade of a color (mix with black).

**Example:**
`=Shade("#FF0000", 0.5)` returns `"#800000"`

### SimulateColorBlindness

Simulate how a color appears to people with color blindness.

**Example:**
`=SimulateColorBlindness("#FF0000", "protanopia")` returns `"#7F7F3F"`

## Gradients

### LinearGradient

Generate a linear gradient between two colors.

**Example:**
`=LinearGradient("#FF0000", "#00FF00", 5)` returns `["#FF0000", "#BF4000", "#7F8000", "#3FBF00", "#00FF00"]`

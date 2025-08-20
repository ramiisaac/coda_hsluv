# Coda HSLuv Pack

A comprehensive Coda Pack for HSLuv color space conversions, accessibility analysis, and advanced color manipulation. This pack provides professional-grade color tools for designers, developers, and data analysts working with color data in Coda.

## Features

- **Advanced Color Conversions**: Support for HSLuv, HPLuv, RGB, CMYK, and Hex color spaces
- **Accessibility Analysis**: WCAG-compliant contrast ratio calculations and accessibility checking
- **Color Harmony Evaluation**: Analyze color relationships and generate harmonious color schemes
- **Color Scheme Generation**: Create monochromatic, analogous, triadic, and tetradic color palettes
- **Color Manipulation**: Adjust brightness, saturation, create tints and shades
- **Color Blindness Simulation**: Simulate how colors appear to users with different types of color vision deficiency
- **Gradient Generation**: Create smooth color gradients with custom step counts
- **Visual Color Preview**: Column format for displaying color swatches directly in tables

## Installation

1. In your Coda document, click "Packs" in the left sidebar
2. Search for "HSLuv" or install this pack directly
3. Click "Install"
4. No authentication required - all calculations are performed locally

## Color Conversion Formulas

### HexToRgb
Convert hexadecimal color values to RGB format.

**Syntax:** `HexToRgb(hex)`

**Parameters:**
- `hex` (required): Hex color code in #RRGGBB format

**Returns:** Object with r, g, b values (0-255)

**Example:**
```
HexToRgb("#FF0000")
// Returns: {r: 255, g: 0, b: 0}
```

### RgbToHex
Convert RGB values to hexadecimal color format.

**Syntax:** `RgbToHex(r, g, b)`

**Parameters:**
- `r` (required): Red value (0-255)
- `g` (required): Green value (0-255)
- `b` (required): Blue value (0-255)

**Returns:** Hex color string

**Example:**
```
RgbToHex(255, 0, 0)
// Returns: "#FF0000"
```

### HexToHsluv
Convert hex colors to HSLuv color space for perceptually uniform color manipulation.

**Syntax:** `HexToHsluv(hex)`

**Parameters:**
- `hex` (required): Hex color code in #RRGGBB format

**Returns:** Object with h (hue), s (saturation), l (lightness) values

**Example:**
```
HexToHsluv("#FF0000")
// Returns: {h: 0, s: 100, l: 53.24}
```

### HsluvToHex
Convert HSLuv values back to hex format.

**Syntax:** `HsluvToHex(h, s, l)`

**Parameters:**
- `h` (required): Hue (0-360)
- `s` (required): Saturation (0-100)
- `l` (required): Lightness (0-100)

**Returns:** Hex color string

**Example:**
```
HsluvToHex(0, 100, 53.24)
// Returns: "#FF0000"
```

### HexToHpluv
Convert hex colors to HPLuv color space for more saturated color manipulation.

**Syntax:** `HexToHpluv(hex)`

**Example:**
```
HexToHpluv("#FF0000")
// Returns: {h: 0, p: 426.23, l: 53.24}
```

### HpluvToHex
Convert HPLuv values to hex format.

**Syntax:** `HpluvToHex(h, p, l)`

**Example:**
```
HpluvToHex(0, 426.23, 53.24)
// Returns: "#FF0000"
```

### RGBToCMYK
Convert RGB values to CMYK color space for print applications.

**Syntax:** `RGBToCMYK(r, g, b)`

**Example:**
```
RGBToCMYK(255, 0, 0)
// Returns: {c: 0, m: 100, y: 100, k: 0}
```

### CMYKToRGB
Convert CMYK values to RGB color space.

**Syntax:** `CMYKToRGB(c, m, y, k)`

**Example:**
```
CMYKToRGB(0, 100, 100, 0)
// Returns: {r: 255, g: 0, b: 0}
```

## Accessibility Analysis

### ContrastRatio
Calculate the WCAG contrast ratio between two colors.

**Syntax:** `ContrastRatio(color1, color2)`

**Parameters:**
- `color1` (required): First color (hex format)
- `color2` (required): Second color (hex format)

**Returns:** Contrast ratio as a decimal (1-21)

**Example:**
```
ContrastRatio("#000000", "#FFFFFF")
// Returns: 21.00 (maximum contrast)
```

### IsAccessible
Check if a color combination meets WCAG accessibility standards.

**Syntax:** `IsAccessible(foreground, background, level, size)`

**Parameters:**
- `foreground` (required): Text color (hex format)
- `background` (required): Background color (hex format)
- `level` (required): WCAG level ("AA" or "AAA")
- `size` (required): Text size ("large" or "small")

**Returns:** Boolean indicating if combination is accessible

**Example:**
```
IsAccessible("#000000", "#FFFFFF", "AA", "small")
// Returns: true
```

### SuggestTextColor
Automatically suggest accessible text color for a given background.

**Syntax:** `SuggestTextColor(backgroundColor, level)`

**Parameters:**
- `backgroundColor` (required): Background color (hex format)
- `level` (required): WCAG level ("AA" or "AAA")

**Returns:** Recommended text color (black or white)

**Example:**
```
SuggestTextColor("#FF0000", "AA")
// Returns: "#FFFFFF"
```

## Color Analysis

### ColorName
Get the common name for a color.

**Syntax:** `ColorName(hex)`

**Example:**
```
ColorName("#FF0000")
// Returns: "Red"
```

### IsWarmOrCool
Determine if a color has warm or cool characteristics.

**Syntax:** `IsWarmOrCool(hex)`

**Example:**
```
IsWarmOrCool("#FF0000")
// Returns: "Warm"
```

### EvaluateColorHarmony
Analyze the harmonic relationship between two colors.

**Syntax:** `EvaluateColorHarmony(color1, color2)`

**Example:**
```
EvaluateColorHarmony("#FF0000", "#00FFFF")
// Returns: "Complementary (high contrast)"
```

## Color Scheme Generation

### MonochromaticScheme
Generate a monochromatic color palette based on a single base color.

**Syntax:** `MonochromaticScheme(baseColor, count)`

**Parameters:**
- `baseColor` (required): Base color (hex format)
- `count` (required): Number of colors to generate

**Example:**
```
MonochromaticScheme("#FF0000", 5)
// Returns: ["#FF0000", "#E60000", "#CC0000", "#B30000", "#990000"]
```

### AnalogousScheme
Generate an analogous color scheme using colors adjacent on the color wheel.

**Syntax:** `AnalogousScheme(baseColor, count, stepDegrees)`

**Parameters:**
- `baseColor` (required): Base color (hex format)
- `count` (required): Number of colors to generate
- `stepDegrees` (optional): Degrees between each color (default: 30)

**Example:**
```
AnalogousScheme("#FF0000", 5, 30)
// Returns: ["#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00"]
```

### TriadicScheme
Generate a triadic color scheme using three evenly spaced colors.

**Syntax:** `TriadicScheme(baseColor)`

**Example:**
```
TriadicScheme("#FF0000")
// Returns: ["#FF0000", "#00FF00", "#0000FF"]
```

### TetradicScheme
Generate a tetradic (rectangle) color scheme using four colors.

**Syntax:** `TetradicScheme(baseColor)`

**Example:**
```
TetradicScheme("#FF0000")
// Returns: ["#FF0000", "#80FF00", "#00FFFF", "#8000FF"]
```

## Color Manipulation

### AdjustBrightness
Modify the brightness of a color by a specified percentage.

**Syntax:** `AdjustBrightness(color, percentage)`

**Parameters:**
- `color` (required): Base color (hex format)
- `percentage` (required): Brightness adjustment (-100 to 100)

**Example:**
```
AdjustBrightness("#FF0000", 20)
// Returns: "#FF3333"
```

### AdjustSaturation
Modify the saturation of a color by a specified percentage.

**Syntax:** `AdjustSaturation(color, percentage)`

**Example:**
```
AdjustSaturation("#FF0000", -50)
// Returns: "#BF4040"
```

### MixColors
Blend two colors together with a specified ratio.

**Syntax:** `MixColors(color1, color2, ratio)`

**Parameters:**
- `color1` (required): First color (hex format)
- `color2` (required): Second color (hex format)
- `ratio` (required): Mix ratio (0.0 = all color1, 1.0 = all color2)

**Example:**
```
MixColors("#FF0000", "#00FF00", 0.5)
// Returns: "#808000"
```

### Tint
Create a tint by mixing a color with white.

**Syntax:** `Tint(color, amount)`

**Parameters:**
- `color` (required): Base color (hex format)
- `amount` (required): Tint amount (0.0 to 1.0)

**Example:**
```
Tint("#FF0000", 0.3)
// Returns: "#FF4D4D"
```

### Shade
Create a shade by mixing a color with black.

**Syntax:** `Shade(color, amount)`

**Example:**
```
Shade("#FF0000", 0.3)
// Returns: "#B30000"
```

## Color Blindness Analysis

### SimulateColorBlindness
Simulate how a color appears to people with different types of color vision deficiency.

**Syntax:** `SimulateColorBlindness(color, type)`

**Parameters:**
- `color` (required): Color to simulate (hex format)
- `type` (required): Type of color blindness ("protanopia", "deuteranopia", "tritanopia")

**Example:**
```
SimulateColorBlindness("#FF0000", "protanopia")
// Returns: "#B8B83F"
```

## Gradient Generation

### LinearGradient
Generate a smooth color gradient between two colors.

**Syntax:** `LinearGradient(color1, color2, steps)`

**Parameters:**
- `color1` (required): Start color (hex format)
- `color2` (required): End color (hex format)
- `steps` (required): Number of gradient steps

**Example:**
```
LinearGradient("#FF0000", "#00FF00", 5)
// Returns: ["#FF0000", "#BF4000", "#7F8000", "#3FBF00", "#00FF00"]
```

## Column Format

### ColorPreview
Display color swatches directly in table columns for visual reference.

**Usage:**
1. Select a column containing hex color codes
2. Apply the "ColorPreview" column format
3. Colors will display as visual swatches alongside the hex values

## Use Cases

### Design Systems
Create and maintain consistent color palettes for brand guidelines, ensuring accessibility compliance across all color combinations.

### Data Visualization
Generate harmonious color schemes for charts and graphs, with automatic accessibility checking for text overlays.

### Print Design
Convert colors between RGB and CMYK color spaces for accurate print reproduction.

### Accessibility Auditing
Systematically check color combinations across designs to ensure WCAG compliance and inclusive user experiences.

### Color Analysis
Analyze color relationships, generate color harmonies, and understand the psychological impact of color choices.

### Brand Development
Develop comprehensive brand color systems with multiple variations, tints, and shades while maintaining visual consistency.

## Advanced Features

### HSLuv Color Space
HSLuv provides perceptually uniform color manipulation, ensuring that adjustments to saturation and lightness appear consistent across all hues.

### HPLuv Color Space
HPLuv offers maximum chroma for each lightness level, enabling more vibrant color manipulations when saturation is a priority.

### WCAG Compliance
All accessibility functions are based on official WCAG 2.1 guidelines, providing reliable compliance checking for web and digital products.

### Color Blindness Awareness
Simulation functions help designers understand how their color choices affect users with different types of color vision, promoting inclusive design practices.

## Best Practices

### Color Space Selection
- Use HSLuv for perceptually uniform color adjustments
- Use HPLuv when maximum saturation is desired
- Use RGB for screen-based applications
- Use CMYK for print applications

### Accessibility Guidelines
- Maintain minimum contrast ratios of 4.5:1 for normal text (WCAG AA)
- Use 7:1 contrast ratio for enhanced accessibility (WCAG AAA)
- Test color combinations with color blindness simulation
- Provide alternative methods for color-coded information

### Color Harmony
- Use monochromatic schemes for subtle, sophisticated palettes
- Apply analogous schemes for natural, comfortable color combinations
- Implement triadic schemes for vibrant, balanced designs
- Consider tetradic schemes for rich, complex palettes

### Performance Considerations
- Cache color calculations when processing large datasets
- Use appropriate precision for color values based on output requirements
- Consider color space efficiency for specific use cases

## Limitations

- Color conversions are optimized for sRGB color space
- CMYK conversions are approximations suitable for general use
- Color blindness simulations use standard transformation matrices
- HSLuv and HPLuv are designed for perceptual uniformity within their respective constraints

## Version History

- **12.0.0**: Complete feature set with all color spaces, accessibility analysis, and advanced manipulation tools

## Author

Created by **Rami Isaac**  
GitHub: [github.com/ramiisaac](https://github.com/ramiisaac)

## License

ISC License
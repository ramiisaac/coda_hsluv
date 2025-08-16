import * as coda from "@codahq/packs-sdk";

export const RGBSchema = coda.makeObjectSchema({
  properties: {
    r: {
      type: coda.ValueType.Number,
      description: "Red (0-255)",
    },
    g: {
      type: coda.ValueType.Number,
      description: "Green (0-255)",
    },
    b: {
      type: coda.ValueType.Number,
      description: "Blue (0-255)",
    },
  },
  idProperty: "r",
});

export const HSLuvSchema = coda.makeObjectSchema({
  properties: {
    h: {
      type: coda.ValueType.Number,
      description: "Hue (0-360)",
    },
    s: {
      type: coda.ValueType.Number,
      description: "Saturation (0-100)",
    },
    l: {
      type: coda.ValueType.Number,
      description: "Lightness (0-100)",
    },
  },
  idProperty: "h",
});

export const HPLuvSchema = coda.makeObjectSchema({
  properties: {
    h: {
      type: coda.ValueType.Number,
      description: "Hue (0-360)",
    },
    p: {
      type: coda.ValueType.Number,
      description: "Percent (0-100)",
    },
    l: {
      type: coda.ValueType.Number,
      description: "Lightness (0-100)",
    },
  },
  idProperty: "h",
});

export const CMYKSchema = coda.makeObjectSchema({
  properties: {
    c: { type: coda.ValueType.Number, description: "Cyan (0-1)" },
    m: { type: coda.ValueType.Number, description: "Magenta (0-1)" },
    y: { type: coda.ValueType.Number, description: "Yellow (0-1)" },
    k: { type: coda.ValueType.Number, description: "Key/Black (0-1)" },
  },
});

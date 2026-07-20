export const getValueByPath = (obj: any, path: string): string | undefined => {
  if (!obj || !path) return undefined;
  const keys = path.split(".");
  let current: any = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current !== undefined ? String(current) : undefined;
};

export const decodeOptions = (optionsStr: string): Array<{ value: string; label: string }> => {
  if (!optionsStr) return [];
  try {
    const decoded = decodeURIComponent(optionsStr);
    return JSON.parse(decoded);
  } catch {
    return [];
  }
};

export const normalizeTemplate = (template: any): any => {
  if (!template) return template;

  if (template.content && template.content.templateContent) {
    return template.content.templateContent;
  }

  if (template.type === "doc") {
    return template;
  }

  return template;
};

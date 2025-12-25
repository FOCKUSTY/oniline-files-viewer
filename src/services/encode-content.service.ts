export const encodeContent = (content: string): string => {
  try {
    return encodeURIComponent(btoa(encodeURIComponent(content)));
  } catch {
    return "";
  }
};

export const decodeContent = (encoded: string): string => {
  try {
    return decodeURIComponent(atob(decodeURIComponent(encoded)));
  } catch {
    return "";
  }
};

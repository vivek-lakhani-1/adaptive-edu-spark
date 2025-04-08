
/// <reference types="vite/client" />

interface MathJaxObject {
  typeset: () => void;
  tex?: {
    inlineMath?: Array<Array<string>>;
    displayMath?: Array<Array<string>>;
    processEscapes?: boolean;
  };
  svg?: {
    fontCache?: string;
  };
}

interface Window {
  MathJax?: MathJaxObject;
}

// Type shim for canvas-confetti (v1.9.x does not ship TypeScript declarations)
declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    flat?: boolean;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: Array<'square' | 'circle' | 'star'>;
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    resize?: boolean;
    useWorker?: boolean;
  }

  type ConfettiFunction = (options?: Options) => Promise<null> | null;

  interface ConfettiObject extends ConfettiFunction {
    reset: () => void;
    create: (
      canvas: HTMLCanvasElement,
      globalOptions?: { resize?: boolean; useWorker?: boolean; disableForReducedMotion?: boolean }
    ) => ConfettiFunction;
  }

  const confetti: ConfettiObject;
  export default confetti;
}

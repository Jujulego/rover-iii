// Interface
export interface IAntColor<N extends string> {
  name: N;
  texture: URL;
  color: string;
  opacity: number;
}

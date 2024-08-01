declare module 'react-world-flags' {
    import { FC, CSSProperties } from 'react';
  
    interface FlagProps {
      code: string;
      style?: CSSProperties;
      className?: string;
      alt?: string;
    }
  
    const Flag: FC<FlagProps>;
  
    export default Flag;
  }
  
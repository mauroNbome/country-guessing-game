declare module 'react-modal' {
  import { Component, CSSProperties } from 'react';

  export interface Styles {
    content?: CSSProperties;
    overlay?: CSSProperties;
  }

  export interface Props {
    isOpen: boolean;
    onRequestClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
    style?: Styles;
    contentLabel?: string;
    ariaHideApp?: boolean;
    children?: React.ReactNode;
  }

  export default class Modal extends Component<Props> {}
}

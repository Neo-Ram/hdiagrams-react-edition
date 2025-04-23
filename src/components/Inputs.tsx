import { ReactNode, InputHTMLAttributes } from "react";
import "./Inputs.css";

type ButtonProps = {
  children: ReactNode;
  id?: string;
  onClick?: () => void;
};

type InputTextProps = InputHTMLAttributes<HTMLInputElement>;

type Button2Props = {
  children: ReactNode;
  onClick?: () => void;
};
type Button3Props = {
  children: ReactNode;
  onClick?: () => void;
};

type Button4Props = {
  children: ReactNode;
  onClick?: () => void;
};
type LabelProps = {
  children: ReactNode;
};

type H1Props = {
  children: ReactNode;
};
type H2Props = {
  children: ReactNode;
};
type PProps = {
  children: ReactNode;
};
export const Button1 = (props: ButtonProps) => {
  const { children, id, onClick } = props;
  return (
    <button className="button1" id={id} onClick={onClick}>
      {children}
    </button>
  );
};

export const Button2 = (props: Button2Props) => {
  const { children, onClick } = props;
  return (
    <button type="button" className="button2" onClick={onClick}>
      {children}
    </button>
  );
};

export const Button3 = (props: Button3Props) => {
  const { children, onClick } = props;
  return (
    <button className="button3" onClick={onClick}>
      <span className="button3-text">{children}</span>
    </button>
  );
};

export const Button4 = (props: Button4Props) => {
  const { children, onClick } = props;
  return (
    <button className="button4" onClick={onClick}>
      {children}
    </button>
  );
};
export const InputText = (props: InputTextProps) => {
  return <input className="form-control" {...props} />;
};

export const Label = (props: LabelProps) => {
  const { children } = props;
  return <label className="label"> {children}</label>;
};

export const H1 = (props: H1Props) => {
  const { children } = props;
  return <h1 className="h1">{children}</h1>;
};
export const H2 = (props: H2Props) => {
  const { children } = props;
  return <h2 className="h2">{children}</h2>;
};
export const P = (props: PProps) => {
  const { children } = props;
  return <p className="p">{children}</p>;
};

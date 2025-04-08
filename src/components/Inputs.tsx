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
};

const Button1 = (props: ButtonProps) => {
  const { children, id, onClick } = props;
  return (
    <button className="button1" id={id} onClick={onClick}>
      {children}
    </button>
  );
};
export default Button1;

export const Button2 = (props: Button2Props) => {
  const { children } = props;
  return (
    <button type="button" className="btn btn-outline-secondary ">
      {children}
    </button>
  );
};

export const InputText = (props: InputTextProps) => {
  return <input className="form-control" {...props} />;
};

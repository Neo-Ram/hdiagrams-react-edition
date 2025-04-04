import { ReactNode, InputHTMLAttributes } from "react";

type ButtonProps = {
  children: ReactNode;
};

type InputTextProps = InputHTMLAttributes<HTMLInputElement>;

const Button1 = (props: ButtonProps) => {
  const { children } = props;
  return <button>{children}</button>;
};
export default Button1;

export const InputText = (props: InputTextProps) => {
  return <input {...props} />;
};

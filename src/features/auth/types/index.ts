export interface Credentials {
  username: string;
  password: string;
}

export interface InputWithIconProps {
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export interface RememberMeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
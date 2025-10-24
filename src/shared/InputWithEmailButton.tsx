import IconSend from '@/assets/icon/icon-send.svg';
import Image from 'next/image';
import { useState } from 'react';
interface OptionalPropsName {
  onValueChange?: any;
  value?: string;
  placeholder: string;
  onPress?: any;
}

const InputWithEmailButton = ({
  onValueChange,
  value,
  placeholder,
  onPress,
}: OptionalPropsName) => {
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    onValueChange(value);
    validateEmail(value);
  };

  const validateEmail = (value: any) => {
    // Basic email validation using a regular expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(value));
  };

  const handleButtonClick = () => {
    onPress();
  };

  return (
    <div className="relative self-center">
      <input
        onChange={handleInputChange}
        value={value}
        type="text"
        className={`border ${
          isValid ? 'border-gray-300' : 'border-portal-primaryLiving'
        } block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500`}
        placeholder={placeholder}
        required
      />
      <button
        onClick={handleButtonClick}
        type="submit"
        className="hover:bg--portal-primaryLiving focus:ring--portal-primaryLiving absolute bottom-1.5 right-1.5 flex h-10 w-10 items-center justify-center rounded-lg bg-portal-primaryLiving text-sm font-medium text-white focus:outline-none focus:ring-4"
      >
        <Image alt="" src={IconSend} className="h-[22px] w-[22px]"></Image>
      </button>
    </div>
  );
};

export default InputWithEmailButton;

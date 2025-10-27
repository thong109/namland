'use client';

import EnglishIcon from '@/assets/icon/english-header.svg';
import KoreaIcon from '@/assets/icon/korea-header.svg';
import VietNameIcon from '@/assets/icon/vietnam-header.svg';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { FC, Fragment, useState } from 'react';

export const headerLanguage = [
  {
    id: 'Vietnamese',
    name: 'Vietnamese',
    description: 'Vietnamese',
    value: 'vi',
    icon: VietNameIcon,
  },
  {
    id: 'English',
    name: 'English',
    description: 'United State',
    value: 'en',
    icon: EnglishIcon,
  },
  {
    id: 'Korea',
    name: 'Korea',
    description: 'Korea',
    value: 'ko',
    icon: KoreaIcon,
  },
];

interface LangDropdownProps {
  panelClassName?: string;
  onChange?: (lang: string) => void;
}

const LangDropdownFlag: FC<LangDropdownProps> = ({
  panelClassName = 'z-10 w-screen max-w-[100px] px-4 mt-4 right-0 sm:px-0',
  onChange,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>('vi');

  const onSelectLang = (value: string) => {
    setSelectedLang(value);
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <div className="LangDropdown">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={` ${open ? '' : 'text-opacity-80'} group inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:text-neutral-300`}
            >
              {headerLanguage.map((item) => {
                return (
                  <div
                    className={`${selectedLang != item.value ? 'hidden' : ''} mx-1 self-center`}
                    key={item.id}
                  >
                    <Image src={item.icon} alt={item.description} className="w-5 object-contain" />
                  </div>
                );
              })}
              <ChevronDownIcon
                className={`${open ? '-rotate-180' : 'text-opacity-70'} ml-2 h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className={`absolute ${panelClassName}`}>
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-7 bg-white p-7 lg:grid-cols-1">
                    {headerLanguage.map((item, index) => (
                      <a
                        key={index + item.id}
                        // href={item.value}
                        onClick={() => {
                          onSelectLang(item.value);
                        }}
                        className={`${
                          selectedLang == item.value ? 'bg-neutral-100' : 'bg-trasparent'
                        } -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${'opacity-80'}`}
                      >
                        <div className="flex flex-row items-center justify-center">
                          <div className="mr-2">
                            <Image
                              src={item.icon}
                              alt={item.description}
                              className="w-5 object-contain"
                            ></Image>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.value}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
export default LangDropdownFlag;

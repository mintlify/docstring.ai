import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import {
  MenuIcon,
  XIcon,
  MailIcon,
} from '@heroicons/react/outline';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import Output from '../components/Output';
import { LanguagePrediction } from './api/detect';

const navigation = [
  { name: 'Documentation', href: 'https://nicedoc.io/mintlify/inferapp', current: false },
  { name: 'Code Search', href: 'https://www.mintlify.com/', current: false },
];

const footer = {
  main: [
    { name: 'Documentation', href: 'https://nicedoc.io/mintlify/inferapp' },
    { name: 'Code Search', href: 'https://www.mintlify.com/' },
  ],
  social: [
    {
      name: 'Contact Us',
      href: 'mailto:hi@mintlify.com',
      icon: function email(props: any) {
        return (
          <MailIcon className="h-6 w-6" {...props} />
        );
      },
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/mintlify',
      icon: function twitter(props: any) {
        return (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        );
      },
    },
    {
      name: 'GitHub',
      href: 'https://github.com/mintlify',
      icon: function github(props: any) {
        return (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        );
      },
    },
  ],
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [code, setCode] = useState('');
  const [outputDisplay, setOutputDisplay] = useState('');

  const codeOnChange = async (newCode: string) => {
    setCode(newCode);

    if (newCode.length < 40) {
      setOutputDisplay(`You need to add another ${40 - newCode.length} characters to detect`);
    } else {
      const detectedResponse = await axios.post('/api/detect', { code: newCode });
      const detected = detectedResponse.data as LanguagePrediction;
      const detectedLanguage = detected.language || '';
      setOutputDisplay(detectedLanguage);
    }
  };

  return (
    <div>
      <Disclosure as="div" className="relative pb-32 overflow-hidden">
        {({ open }: any) => (
          <>
            <nav
              className={classNames(
                open ? 'bg-sky-900' : 'bg-transparent',
                'relative z-10 border-b border-teal-500 border-opacity-25 lg:bg-transparent lg:border-none',
              )}
            >
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-sky-800">
                  <div className="px-2 flex items-center lg:px-0">
                    <div className="flex-shrink-0">
                      <div className="h-7 w-7">
                        <svg viewBox="0 0 141 141" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.4672 54.6072L34.4379 38.5328C33.5494 42.6428 32.858 46.9378 32.858 51.3214C32.858 57.7465 33.8393 64.3183 36.3867 70.4808C37.7727 74.4164 39.6401 78.3944 42.1274 82.1519L10.8786 113.401C9.19813 110.656 7.8153 107.841 6.82735 104.877L6.81229 104.832L6.79617 104.787C4.87361 99.4465 4.00367 93.8575 4.00001 88.2151C4.21919 76.4045 8.54284 64.6897 17.2843 55.788H17.2941L18.4672 54.6072Z" stroke="white" strokeWidth="8" />
                          <path d="M26.9728 129.593L58.1003 98.2659C61.7071 100.625 65.5846 102.667 69.8386 104.09C76.1369 106.351 82.6506 107.343 89.1113 107.343C93.4212 107.343 97.7931 106.884 102.2 105.721L86.0496 121.976L86.0404 121.985L85.583 122.443C76.3521 131.674 64.3186 136.21 52.2175 136.434C46.5752 136.43 40.9862 135.56 35.6458 133.638L35.6291 133.632L35.6123 133.626C32.6572 132.592 29.7356 131.267 26.9728 129.593Z" stroke="white" strokeWidth="8" />
                          <path d="M84.9806 44.1555L84.9517 44.1339L84.9225 44.1128C80.5289 40.9396 75.7466 38.1463 70.3607 36.3443C64.0624 34.0833 57.5487 33.0913 51.088 33.0913C48.8828 33.0913 46.6614 33.2115 44.4274 33.4846C46.6642 28.0962 50.0095 22.9946 54.4083 18.4328L54.8495 17.9915C64.1038 8.73728 76.3716 4 88.6458 4L110.107 4L136.434 4V30.3262V51.7878C136.434 64.0305 131.717 76.0876 122.42 85.6063C122.366 85.6611 122.315 85.7153 122.267 85.7685L122.026 86.0014C117.432 90.4366 112.29 93.8028 106.858 96.0437C107.158 93.8433 107.342 91.6063 107.342 89.3456C107.342 82.8754 106.347 76.3522 104.079 70.0453C102.335 65.0655 99.8209 60.0145 96.2571 55.4251C94.7351 53.3988 92.9816 51.3998 91.0077 49.4259C89.0247 47.4429 87.0164 45.6824 84.9806 44.1555Z" stroke="white" strokeWidth="8" />
                        </svg>
                      </div>
                    </div>
                    <div className="hidden lg:block lg:ml-6 lg:space-x-4">
                      <div className="flex">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current ? 'bg-black bg-opacity-25' : 'hover:bg-opacity-25 hover:bg-black',
                              'mr-2 rounded-md py-2 px-3 text-sm font-medium text-white',
                            )}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="p-2 rounded-md inline-flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block flex-shrink-0 h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block flex-shrink-0 h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="bg-sky-900 lg:hidden">
                <div className="pt-2 pb-3 px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-black bg-opacity-25' : 'hover:bg-sky-800',
                        'block rounded-md py-2 px-3 text-base font-medium text-white',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </Disclosure.Panel>
            </nav>
            <div
              aria-hidden="true"
              className={classNames(
                open ? 'bottom-0' : 'inset-y-0',
                'absolute inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden lg:inset-y-0',
              )}
            >
              <div className="absolute inset-0 flex">
                <div className="h-full w-1/2 bg-primary" />
                <div className="h-full w-1/2 bg-secondary" />
              </div>
              <div className="relative flex justify-center">
                <svg
                  className="flex-shrink-0"
                  width={1750}
                  height={308}
                  viewBox="0 0 1750 308"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M284.161 308H1465.84L875.001 182.413 284.161 308z" fill="#18e299" />
                  <path d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#18e299" />
                  <path d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#0c8c5e" />
                  <path d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z" fill="#0c8c5e" />
                </svg>
              </div>
            </div>
            <header className="relative py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-white">Detect any programming language</h1>
                <p className="mt-1 text-gray-300">Add some code to get started</p>
              </div>
            </header>
          </>
        )}
      </Disclosure>

      <Head>
        <title>Inferlang - Detect any programming language</title>
        <meta
          name="description"
          content="Inferlang can detect the programming language of a given source code. Powered by Guesslang and hosted by Mintlify, it supports more than 50 programming with 90+% accuracy"
        />
      </Head>

      <main className="relative -mt-32">
        <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
          <div className="rounded-lg overflow-hidden">
            <div className="grid sm:grid-cols-2 sm:gap-4">
              <div className="h-full">
                <CodeEditor
                  code={code}
                  setCode={codeOnChange}
                  placeholder="Type or paste code here"
                  language={outputDisplay}
                />
              </div>
              <div className="h-full mt-4 sm:m-0">
                <Output
                  output={outputDisplay}
                  isLoading={false}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="relative z-10 bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            {footer.main.map((item) => (
              <div key={item.name} className="px-5 py-2">
                <Link key={item.name} href={item.href} passHref>
                  <button type="button" className="text-base text-gray-500 hover:text-gray-900">
                    {item.name}
                  </button>
                </Link>
              </div>
            ))}
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            {footer.social.map((item) => (
              <Link key={item.name} href={item.href} passHref>
                <button type="button" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center text-base text-gray-400">&copy; 2021 Mintlify, Inc. Powered by GuessLang.</p>
        </div>
      </footer>
    </div>
  );
}

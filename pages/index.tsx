import { useState, Fragment } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {
  Menu, Transition, Disclosure, Switch,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import {
  MailIcon, PencilAltIcon,
} from '@heroicons/react/outline';
import { languages, Grammar } from 'prismjs';
import CodeEditor from '../components/CodeEditor';
import Output from '../components/Output';
import vscode from '../assets/vsc.svg';
import logo from '../assets/mintlify.svg';
import EXAMPLES from '../content/examples';
import 'react-toastify/dist/ReactToastify.css';

const ENDPOINT = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : 'https://api.mintlify.com';

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

type LanguageOption = {
  name: string;
  id: string;
  grammar: Grammar;
}

const languagesDropdown: LanguageOption[] = [
  { name: 'Auto-detect', id: 'auto', grammar: languages.plain },
  { name: 'JavaScript', id: 'javascript', grammar: languages.javascript },
  { name: 'TypeScript', id: 'typescript', grammar: languages.typescript },
  { name: 'Python', id: 'python', grammar: languages.python },
];

const formats = [
  { name: 'Auto-detect', id: 'Auto-detect' },
  { name: 'JSDoc', id: 'JSDoc' },
  { name: 'reST', id: 'reST' },
  { name: 'Google', id: 'Google' },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [code, setCode] = useState('');
  const [outputDisplay, setOutputDisplay] = useState('');
  const [lastExampleId, setLastExampleId] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languagesDropdown[0]);
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const onCodeChange = async (newCode: string) => {
    setCode(newCode);
    if (newCode.length < 30) return;

    const { data: { language } }: { data: { language: string } } = await axios.post('https://figstack.uc.r.appspot.com/infer', {
      code: newCode.trim(),
    });

    const languageToUse = languagesDropdown.find(
      (languageOption) => languageOption.name === language,
    );

    if (languageToUse) {
      setSelectedLanguage({
        ...languageToUse,
        name: `${language} (auto)`,
      });
      return;
    }

    setSelectedLanguage({
      name: `${language} (auto)`,
      id: language,
      grammar: languages.plain,
    });
  };

  const onGenerateExample = () => {
    const filteredExamples = EXAMPLES.filter((example) => example.id !== lastExampleId);
    const randomExample = filteredExamples[Math.floor(Math.random() * filteredExamples.length)];
    const foundLanguage = languagesDropdown.find(
      (languageOption) => languageOption.id === randomExample.languageId,
    );
    const foundFormat = formats.find(
      (format) => format.id === randomExample.format,
    );
    if (foundLanguage == null || foundFormat == null) return;

    setSelectedLanguage(foundLanguage);
    setSelectedFormat(foundFormat);
    setCode(randomExample.code);
    setLastExampleId(randomExample.id);
  };

  const onClickGenerate = async () => {
    setIsGenerating(true);
    setOutputDisplay('');

    try {
      const fingerprintID = window.localStorage.getItem('id');
      const { data: { docstring } }: { data: { docstring: string } } = await axios.post(`${ENDPOINT}/web/write`, {
        code,
        languageId: selectedLanguage.id,
        commented: commentsEnabled,
        userId: fingerprintID || 'web',
        docStyle: selectedFormat.id,
        context: code,
        source: 'web',
      });

      setOutputDisplay(docstring);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 'An enexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <Head>
        <title>DocstringAI - Automated Documentation Writer</title>
        <meta
          name="description"
          content="Hate writing documentation? Let docstring.ai write it for you ✍️"
        />
        <meta property="og:title" content="DocstringAI - Automated Documentation Write" />
        <meta property="og:image" content="https://res.cloudinary.com/mintlify/image/upload/v1642572331/thumbnail_glhmjx.jpg" />
        <meta property="og:description" content="Hate writing documentation? Let docstring.ai write it for you ✍️" />
        <meta property="og:url" content="https://www.docstring.ai" />
      </Head>
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
                <div className="relative h-16 flex items-center justify-between">
                  <div className="px-2 flex items-center lg:px-0">
                    <div className="mt-1 flex-shrink-0">
                      <Image height={48} width={48} src={logo} />
                    </div>
                  </div>
                  <Link href="https://marketplace.visualstudio.com/items?itemname=mintlify.document">
                    <button
                      type="button"
                      className="inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg shadow hover:bg-opacity-40"
                    >
                      <Image height={16} width={16} src={vscode} />
                      <p className="ml-2">Install on Visual Studio Code</p>
                    </button>
                  </Link>
                </div>
              </div>
            </nav>
            <div
              aria-hidden="true"
              className={classNames(
                open ? 'bottom-0' : 'inset-y-0',
                'absolute inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden lg:inset-y-0',
              )}
            >
              <div className="relative h-full gradient" />
            </div>
            <header className="relative py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-white">Documentation Writer</h1>
                <p className="mt-1 text-gray-200">Add some code to get started</p>
              </div>
            </header>
          </>
        )}
      </Disclosure>
      <main className="relative -mt-32 z-10">
        <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-8 lg:px-8">
          <div className="rounded-lg">
            <div className="grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-1">
              <div className="h-full">
                <CodeEditor
                  code={code}
                  setCode={onCodeChange}
                  placeholder="Type or paste code here"
                  languageGrammar={selectedLanguage.grammar}
                />
                <div className="w-full text-right px-1">
                  <button
                    className="mt-1 text-primary text-sm hover:opacity-80 duration-100"
                    type="button"
                    onClick={onGenerateExample}
                  >
                    Get example
                  </button>
                </div>
                <div className="hidden xl:block mt-2 w-full z-10">
                  <div className="grid gap-8 items-start justify-center">
                    <span className="relative px-4 py-4 rounded-lg leading-none flex items-center border border-gray-100 shadow-sm">
                      <span className="flex space-x-5">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Language</p>
                          <Menu as="div" className="relative inline-block text-left">
                            <div>
                              <Menu.Button className="inline-flex items-stretch w-40 rounded-md border border-gray-200 shadow-sm px-2 py-1 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300">
                                <div className="flex-1 text-left text-gray-700">
                                  {selectedLanguage.name}
                                </div>
                                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                              </Menu.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="origin-top-right w-40 absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                  {languagesDropdown.map((language) => (
                                    <Menu.Item key={language.id}>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedLanguage(language)}
                                        className={classNames(
                                          selectedLanguage.id === language.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                          'block px-4 py-2 text-sm w-full text-left hover:bg-gray-100',
                                        )}
                                      >
                                        {language.name}
                                      </button>
                                    </Menu.Item>
                                  ))}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Format</p>
                          <Menu as="div" className="relative inline-block text-left">
                            <div>
                              <Menu.Button className="inline-flex justify-center w-32 rounded-md border border-gray-200 shadow-sm px-2 py-1 bg-white text-sm hover:bg-gray-50 hover:border-gray-300">
                                <div className="flex-1 text-left text-gray-700">
                                  {selectedFormat.name}
                                </div>
                                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                              </Menu.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="origin-top-right w-32 absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {
                              formats.map((format) => (
                                <Menu.Item key={format.id}>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedFormat(format)}
                                    className={classNames(
                                      format.id === selectedFormat.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                      'block px-4 py-2 text-sm w-full text-left',
                                    )}
                                  >
                                    {format.name}
                                  </button>
                                </Menu.Item>
                              ))
                            }
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1 font-medium">Commented</p>
                          <div className="mt-2 flex">
                            <Switch
                              checked={commentsEnabled}
                              onChange={setCommentsEnabled}
                              className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer"
                            >
                              <span className="sr-only">Use setting</span>
                              <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md" />
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  commentsEnabled ? 'bg-primary' : 'bg-gray-200',
                                  'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
                                )}
                              />
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  commentsEnabled ? 'translate-x-5' : 'translate-x-0',
                                  'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200',
                                )}
                              />
                            </Switch>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="relative flex w-32 space-x-1 justify-center items-center px-4 py-2 text-sm rounded-md text-green-600 bg-green-500 bg-opacity-25 hover:bg-opacity-40 duration-200"
                          onClick={onClickGenerate}
                        >
                          {
                      isGenerating ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                      ) : (
                        <>
                          <div>
                            Write Docs
                          </div>
                          <div>
                            <PencilAltIcon className="h-4 w-4" />
                          </div>
                        </>
                      )
                    }
                        </button>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-full mt-4 sm:m-0">
                <Output
                  output={outputDisplay}
                  isLoading={isGenerating}
                  languageGrammar={selectedLanguage.grammar}
                />
              </div>
            </div>
          </div>
          <div className="block xl:hidden mt-8 w-full z-10">
            <div className="grid gap-8 items-start justify-center">
              <span className="relative px-4 py-4 rounded-lg leading-none flex items-center border border-gray-100 shadow-sm">
                <span className="grid grid-cols-2 gap-5 sm:flex sm:space-x-5">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Language</p>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex items-stretch w-40 rounded-md border border-gray-200 shadow-sm px-2 py-1 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300">
                          <div className="flex-1 text-left text-gray-700">
                            {selectedLanguage.name}
                          </div>
                          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right w-40 absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            {languagesDropdown.map((language) => (
                              <Menu.Item key={language.id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedLanguage(language)}
                                  className={classNames(
                                    selectedLanguage.id === language.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-sm w-full text-left hover:bg-gray-100',
                                  )}
                                >
                                  {language.name}
                                </button>
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Format</p>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex justify-center w-32 rounded-md border border-gray-200 shadow-sm px-2 py-1 bg-white text-sm hover:bg-gray-50 hover:border-gray-300">
                          <div className="flex-1 text-left text-gray-700">
                            {selectedFormat.name}
                          </div>
                          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right w-32 absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            {
                              formats.map((format) => (
                                <Menu.Item key={format.id}>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedFormat(format)}
                                    className={classNames(
                                      format.id === selectedFormat.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                      'block px-4 py-2 text-sm w-full text-left',
                                    )}
                                  >
                                    {format.name}
                                  </button>
                                </Menu.Item>
                              ))
                            }
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Commented</p>
                    <div className="mt-2 flex">
                      <Switch
                        checked={commentsEnabled}
                        onChange={setCommentsEnabled}
                        className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer"
                      >
                        <span className="sr-only">Use setting</span>
                        <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md" />
                        <span
                          aria-hidden="true"
                          className={classNames(
                            commentsEnabled ? 'bg-primary' : 'bg-gray-200',
                            'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
                          )}
                        />
                        <span
                          aria-hidden="true"
                          className={classNames(
                            commentsEnabled ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200',
                          )}
                        />
                      </Switch>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="relative flex w-32 space-x-1 justify-center items-center px-4 py-2 text-sm rounded-md text-green-600 bg-green-500 bg-opacity-25 hover:bg-opacity-40 duration-200"
                    onClick={onClickGenerate}
                  >
                    {
                      isGenerating ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                      ) : (
                        <>
                          <div>
                            Write Docs
                          </div>
                          <div>
                            <PencilAltIcon className="h-4 w-4" />
                          </div>
                        </>
                      )
                    }
                  </button>
                </span>
              </span>
            </div>
          </div>
        </div>
      </main>
      <footer className="relative mt-8 sm:mt-16 pb-8 bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden sm:px-6 lg:px-8">
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
          <p className="mt-8 text-center text-base text-gray-400">
            &copy;
            {' '}
            <Link href="https://mintlify.com">Mintlify</Link>
            {' '}
            2022.
            {' '}
            <Link href="mailto:hi@mintlify.com">Send Feedback</Link>
          </p>
        </div>
      </footer>
      <ToastContainer position="bottom-right" limit={1} autoClose={3000} />
      <Script>
        {`// Initialize the agent at application startup.
        fpPromise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.onload = resolve;
          script.onerror = reject;
          script.async = true;
          script.src = 'https://cdn.jsdelivr.net/npm/'
            + '@fingerprintjs/fingerprintjs-pro@3/dist/fp.min.js';
          document.head.appendChild(script);
        })
          .then(() => FingerprintJS.load({
            token: 'ztukxULTMxKRDyYP0GDc'
          }));

        // Get the visitor identifier when you need it.
        fpPromise
          .then(fp => fp.get())
          .then(result => window.localStorage.setItem('id', result.visitorId));`}
      </Script>
    </div>
  );
}

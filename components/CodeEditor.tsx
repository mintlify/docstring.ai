/* eslint-disable react/jsx-props-no-spreading */
import Editor from 'react-simple-code-editor';
import { highlight, languages, Grammar } from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-typescript';

type CodeEditorProps = {
  code: string;
  // eslint-disable-next-line no-unused-vars
  setCode: (code: string) => void;
  placeholder: string;
  language: string;
}

const hightlightWithLineNumbers = (
  input: string, grammar: Grammar, language: string, lineIncrement = 0,
) => highlight(input, grammar, language)
  .split('\n')
  .map((line, i) => `<span class='editorLineNumber'>${i + 1 + lineIncrement}</span>${line}`)
  .join('\n');

export default function CodeEditor({
  code, setCode, placeholder, language,
}: CodeEditorProps) {
  console.log(language);
  return (
    <Editor
      value={code}
      onValueChange={(codeUpdated) => setCode(codeUpdated)}
      highlight={(codeToBeHighlighted) => hightlightWithLineNumbers(
        codeToBeHighlighted, languages.typescript, 'TypeScript',
      )}
      padding={12}
      textareaId="codeArea"
      placeholder={placeholder}
      className="editor bg-gray-800 text-white border border-gray-300 rounded-lg text-sm"
      style={{
        boxSizing: 'border-box',
        fontFamily: '"Dank Mono", "Fira Code", monospace',
        minHeight: '12rem',
      }}
    />
  );
}

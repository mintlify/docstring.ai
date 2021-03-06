import { highlight, Grammar } from 'prismjs';
import Editor from 'react-simple-code-editor';
import { DuplicateIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify';

type OutputProps = {
  output: string;
  isLoading: boolean;
  languageGrammar: Grammar;
}

function Output(props: OutputProps) {
  const { output, isLoading, languageGrammar } = props;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="relative">
      <Editor
        value={output}
        onValueChange={() => {}}
        highlight={(codeToBeHighlighted) => highlight(
          codeToBeHighlighted, languageGrammar, 'TypeScript',
        )}
        padding={12}
        disabled
        textareaId="codeArea"
        className="bg-gray-100 output border-2 border-gray-200 rounded-lg p-4 pb-10 text-sm"
        style={{
          boxSizing: 'border-box',
          fontFamily: '"Dank Mono", "Fira Code", monospace',
          minHeight: '12rem',
          color: '#0D935B !important',
        }}
      />
      {output && (
        <button className="absolute right-3 bottom-3" type="button" onClick={copyToClipboard}>
          <DuplicateIcon className="h-6 w-6 text-gray-600 hover:text-gray-400" />
        </button>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Output;

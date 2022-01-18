![Tux, the Linux mascot](/assets/mintlify-green-smol.png)
# Inferlang for Developers

Auto-detect the programming language of any code
## API Endpoint

Use the Inferlang API to programmatically build language detection into your application

```bash
POST: https://inferlang.com/api/detect
```

| Request Body | |
| ----------- | ----------- |
| `code` (required)   | Code input you would like to identify the language for as a string |

| Returns | |
| ----------- | ----------- |
| `language`     | Name of the language detected |

## Running locally

You can run the Interlang app in your local machine

First, install the dependencies using

```bash
npm install
```

Then run the [Next.JS](https://nextjs.org/) application using

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

Inferlang is powered by and [GuessLang](https://github.com/yoeo/guesslang) and hosted by [Mintlify](https://mintlify.ccom). You can find out more at

- [GuessLang Documentation](https://guesslang.readthedocs.io/en/latest/) - Guesslang detects the programming language of a given source code. It supports more than 50 programming languages and detects the correct programming language with more than 90% accuracy.

- [Mintlify Signup](https://nextjs.org/learn) - The search engine in your codebase

You can check out [the Inferlang repository](https://github.com/mintlify/inferapp) - your feedback and contributions are welcome!
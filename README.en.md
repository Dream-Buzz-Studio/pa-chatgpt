# ChatGPT Web

<div style="font-size: 1.5rem;">
  <a href="./README.md">中文</a> |
  <a href="./README.en.md">English</a>
</div>
</br>

- [ChatGPT Web](#chatgpt-web)
	- [Introduction](#introduction)
	- [Prerequisites](#prerequisites)
		- [Node](#node)
		- [PNPM](#pnpm)
		- [Fill in the Keys](#fill-in-the-keys)
	- [Install Dependencies](#install-dependencies)
		- [Backend](#backend)
		- [Frontend](#frontend)
	- [Run in Test Environment](#run-in-test-environment)
		- [Backend Service](#backend-service)
		- [Frontend Webpage](#frontend-webpage)

## Introduction

Supports dual models, provides two unofficial `ChatGPT API` methods:

| Method                                        | Free?  | Reliability | Quality |
| --------------------------------------------- | ------ | ----------- | ------- |
| `ChatGPTAPI(gpt-3.5-turbo-0301)`                           | No     | Reliable    | Relatively clumsy |
| `ChatGPTUnofficialProxyAPI(Web accessToken)` | Yes    | Relatively unreliable | Smart |

Comparison:
1. `ChatGPTAPI` uses `gpt-3.5-turbo-0301` to simulate `ChatGPT` through the official `OpenAI` completion `API` (the most reliable method, but it is not free and does not use models specifically tuned for chat).
2. `ChatGPTUnofficialProxyAPI` accesses `ChatGPT`'s backend `API` via an unofficial proxy server to bypass `Cloudflare` (uses the real `ChatGPT`, is very lightweight, but depends on third-party servers and has rate limits).

[Details](https://github.com/Chanzhaoyu/chatgpt-web/issues/138)

Switching Methods:
1. Go to the `service/.env.example` file and copy the contents to the `service/.env` file.
2. For `OpenAI API Key`, fill in the `OPENAI_API_KEY` field [(Get apiKey)](https://platform.openai.com/overview).
3. For `Web API`, fill in the `OPENAI_ACCESS_TOKEN` field [(Get accessToken)](https://chat.openai.com/api/auth/session).
4. When both are present, `OpenAI API Key` takes precedence.

Reverse Proxy:

Available when using `ChatGPTUnofficialProxyAPI`.[Details](https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy)

```shell
# service/.env
API_REVERSE_PROXY=
```

Environment Variables:

For all parameter variables, check [here](#docker-parameter-example) or see:

```
/service/.env
```

## Prerequisites

### Node

`node` requires version `^16 || ^18` (`node >= 14` requires installation of [fetch polyfill](https://github.com/developit/unfetch#usage-as-a-polyfill)), and multiple local `node` versions can be managed using [nvm](https://github.com/nvm-sh/nvm).

```shell
node -v
```

### PNPM
If you have not installed `pnpm` before:
```shell
npm install pnpm -g
```

### Fill in the Keys

Get `Openai Api Key` or `accessToken` and fill in the local environment variables [jump](#introduction)

```
# service/.env file

# OpenAI API Key - https://platform.openai.com/overview
OPENAI_API_KEY=

# change this to an `accessToken` extracted from the ChatGPT site's `https://chat.openai.com/api/auth/session` response
OPENAI_ACCESS_TOKEN=
```

## Install Dependencies

> To make it easier for `backend developers` to understand, we did not use the front-end `workspace` mode, but stored it in different folders. If you only need to do secondary development of the front-end page, delete the `service` folder.

### Backend

Enter the `/service` folder and run the following command

```shell
pnpm install
```

### Frontend
Run the following command in the root directory
```shell
pnpm bootstrap
```

## Run in Test Environment
### Backend Service

Enter the `/service` folder and run the following command

```shell
pnpm start
```

### Frontend Webpage
Run the following command in the root directory
```shell
pnpm dev
```
modify `VITE_GLOB_API_URL` in `.env` at the root directory to your actual backend interface address.


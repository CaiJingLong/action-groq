# Groq Text Summarization Action

A GitHub Action that uses Groq API to summarize text content. It helps you
automate the summarization of documents, comments, issue descriptions, and other
text content.

[中文文档](#chinese-readme)

## Features

- Text summarization using Groq API
- Customizable model selection
- Configurable output length (up to 8192 tokens context window)
- Customizable system prompt
- Easy-to-use interface

## Usage

### Prerequisites

1. You need a Groq API key. Get it from
   [Groq Console](https://console.groq.com).
2. Set up the `GROQ_API_KEY` secret in your GitHub repository.

### Basic Usage

```yaml
name: Summarize Text
on:
  issues:
    types: [opened, edited]

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - name: Summarize Issue
        uses: CaiJingLong/action-groq@v1
        with:
          text: ${{ github.event.issue.body }}
          api_key: ${{ secrets.GROQ_API_KEY }}
```

### Full Configuration

```yaml
- uses: CaiJingLong/action-groq@v1
  with:
    # Text content to summarize (required)
    text: "Your long text content..."

    # Groq API Key (required)
    api_key: ${{ secrets.GROQ_API_KEY }}

    # Model to use (optional, default: llama-3.3-70b-versatile)
    model: "llama-3.3-70b-versatile"

    # Maximum number of tokens in the output (optional, default: 500)
    # Recommended range: 500-1000 for comprehensive summaries
    max_tokens: 500

    # Custom system prompt (optional)
    prompt: "You are a helpful assistant that summarizes text concisely and accurately. Please provide a clear and comprehensive summary of the following text."
```

## Input Parameters

| Parameter    | Required | Default              | Description                   |
| ------------ | -------- | -------------------- | ----------------------------- |
| `text`       | Yes      | -                    | Text content to summarize     |
| `api_key`    | Yes      | -                    | Groq API Key                  |
| `model`      | No       | `llama-3.3-70b-versatile` | Groq model to use (has a context window of 8192 tokens) |
| `max_tokens` | No       | `500`                | Maximum length of the summary. Recommended range: 500-1000 tokens for comprehensive summaries |
| `prompt`     | No       | See description      | Custom system prompt for the summarization. Default is a general summarization prompt. |

## Output Parameters

| Parameter | Description                           |
| --------- | ------------------------------------- |
| `summary` | Generated text summary                |
| `error`   | Error message if summarization failed |

## Examples

### Summarize Issue Content

```yaml
name: Summarize Issue
on:
  issues:
    types: [opened, edited]

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - name: Summarize Issue
        uses: CaiJingLong/action-groq@v1
        id: summary
        with:
          text: ${{ github.event.issue.body }}
          api_key: ${{ secrets.GROQ_API_KEY }}
          max_tokens: 100

      - name: Add Comment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## Summary\n\n' + '${{ steps.summary.outputs.summary }}'
            })
```

### Summarize Pull Request Description

```yaml
name: Summarize PR
on:
  pull_request:
    types: [opened, edited]

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - name: Summarize PR
        uses: CaiJingLong/action-groq@v1
        id: summary
        with:
          text: ${{ github.event.pull_request.body }}
          api_key: ${{ secrets.GROQ_API_KEY }}

      - name: Add Comment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## PR Summary\n\n' + '${{ steps.summary.outputs.summary }}'
            })
```

## License

MIT License - see [LICENSE](LICENSE) file

## Contributing

Issues and Pull Requests are welcome!

## Development

1. Clone the repository

```bash
git clone https://github.com/CaiJingLong/action-groq.git
cd action-groq
```

2. Install dependencies

```bash
pnpm install
```

3. Development and testing

```bash
# Run tests
pnpm test

# Build
pnpm run package
```

## Related Projects

- [Groq API](https://console.groq.com/docs/api)
- [GitHub Actions](https://docs.github.com/en/actions)

---

# <a name="chinese-readme"></a>中文文档

这个 GitHub Action 使用 Groq
API 来对文本内容进行智能总结。它���以帮助你自动化处理文档、评论、问题描述等文本内容的总结工作。

## 功能特点

- 使用 Groq API 进行文本总结
- 支持自定义模型选择
- 可配置输出长度（上下文窗口最大 8192 tokens）
- 可自定义系统提示词
- 简单易用的接口

## 使用方法

### 前置要求

1. 你需要一个 Groq API 密钥。可以从 [Groq Console](https://console.groq.com)
   获取。
2. 在你的 GitHub 仓库中设置 `GROQ_API_KEY` secret。

### 基础用法

```yaml
name: Summarize Text
on:
  issues:
    types: [opened, edited]

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - name: Summarize Issue
        uses: CaiJingLong/action-groq@v1
        with:
          text: ${{ github.event.issue.body }}
          api_key: ${{ secrets.GROQ_API_KEY }}
```

### 完整配置

```yaml
- uses: CaiJingLong/action-groq@v1
  with:
    # 需要总结的文本内容（必需）
    text: "你的长文本内容..."

    # Groq API 密钥（必需）
    api_key: ${{ secrets.GROQ_API_KEY }}

    # 使用的模型（可选，默认：llama-3.3-70b-versatile）
    model: "llama-3.3-70b-versatile"

    # 输出的最大 token 数（可选，默认：500）
    # 推荐范围：500-1000，以获得全面的总结
    max_tokens: 500

    # 自定义系统提示词（可选）
    prompt: "你是一个帮助用户总结文本的助手，请准确简洁地总结以下文本内容。"
```

## 输入参数

| 参数         | 必需 | 默认值               | 描述               |
| ------------ | ---- | -------------------- | ------------------ |
| `text`       | 是   | -                    | 需要总结的文本内容 |
| `api_key`    | 是   | -                    | Groq API 密钥      |
| `model`      | 否   | `llama-3.3-70b-versatile` | 使用的 Groq 模型（上下文窗口为 8192 tokens） |
| `max_tokens` | 否   | `500`                | 输出摘要的最大长度。推荐范围：500-1000 tokens，以获得全面的总结 |
| `prompt`     | 否   | 见说明               | 自定义系统提示词。默认为通用的总结提示词。 |

## 输出参数

| 参数      | 描述                             |
| --------- | -------------------------------- |
| `summary` | 生成的文本摘要                   |
| `error`   | 如果发生错误，这里会包含错误信息 |

## 使用示例

### 总结 Issue 内容

```yaml
name: Summarize Issue
on:
  issues:
    types: [opened, edited]

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - name: Summarize Issue
        uses: CaiJingLong/action-groq@v1
        id: summary
        with:
          text: ${{ github.event.issue.body }}
          api_key: ${{ secrets.GROQ_API_KEY }}
          max_tokens: 100

      - name: Add Comment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## 内容总结\n\n' + '${{ steps.summary.outputs.summary }}'
            })
```

### 总结 Pull Request 描述

```yaml
name: Summarize PR
on:
  pull_request:
    types: [opened, edited]

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - name: Summarize PR
        uses: CaiJingLong/action-groq@v1
        id: summary
        with:
          text: ${{ github.event.pull_request.body }}
          api_key: ${{ secrets.GROQ_API_KEY }}

      - name: Add Comment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## PR 总结\n\n' + '${{ steps.summary.outputs.summary }}'
            })
```

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

## 开发

1. 克隆仓库

```bash
git clone https://github.com/CaiJingLong/action-groq.git
cd action-groq
```

2. 安装依赖

```bash
pnpm install
```

3. 开发和测试

```bash
# 运行测试
pnpm test

# 构建
pnpm run package
```

## 相关项目

- [Groq API](https://console.groq.com/docs/api)
- [GitHub Actions](https://docs.github.com/en/actions)

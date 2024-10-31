
# BookWriter README

## Introduction

The **BookWriter** script is a Node.js application that uses OpenAI's language model to generate a book chapter by chapter. It interacts with the user to define the book's theme, incorporate user inputs for each chapter, and maintains narrative continuity by summarizing previous chapters.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **TypeScript** and **ts-node** (for running TypeScript files)
- **OpenAI API Key**

## Installation

### 1. Clone the Repository or Download the Script

First, clone this repository to your local machine or download the `book_writer.ts` script.

```bash
git clone <repository_url>
cd <repository_directory>
```

### 2. Install Dependencies

Install the necessary npm packages by running:

```bash
npm install
```

If you haven't installed TypeScript and `ts-node` globally, install them as development dependencies:

```bash
npm install typescript ts-node @types/node --save-dev
```

### 3. Set Up OpenAI API Key

You need an OpenAI API key to use the language model. Set up your API key as an environment variable:

For Unix-based systems (Linux/macOS):

```bash
export OPENAI_API_KEY='your-api-key-here'
```

For Windows Command Prompt:

```cmd
set OPENAI_API_KEY='your-api-key-here'
```

For Windows PowerShell:

```powershell
$env:OPENAI_API_KEY='your-api-key-here'
```

Alternatively, you can create a `.env` file in the root directory of your project and add:

```env
OPENAI_API_KEY='your-api-key-here'
```

Make sure to replace `'your-api-key-here'` with your actual OpenAI API key.

### 4. Verify Configuration

Ensure that the `@langchain/openai` package is installed. If not, install it using:

```bash
npm install @langchain/openai
```

## Running the Script

You can run the `book_writer.ts` script using `ts-node`:

```bash
ts-node book_writer.ts
```

If you prefer to compile the TypeScript file to JavaScript first, you can do so:

```bash
npx tsc book_writer.ts
node book_writer.js
```

## Using the Script

When you run the script, it will guide you through the process of generating a book. Here's what to expect:

### 1. Enter the Book Theme

The script will prompt you:

```
Enter the theme or genre of the book:
```

Type in your desired theme or genre, such as "Science Fiction Adventure" or "Mystery Thriller," and press **Enter**.

### 2. Chapter Generation Loop

The script enters a loop to generate chapters. For each chapter:

#### a. Provide Chapter Instructions (Optional)

You will be prompted:

```
Enter instructions or plot points for Chapter X (optional):
```

- **Optional Input:** You can provide specific instructions, plot points, character developments, or leave it blank for the model to generate the content based on the theme and previous chapters.
- **Examples:**
  - "Introduce a conflict between the protagonist and antagonist."
  - "The main character discovers a hidden ability."

#### b. Chapter Generation

The script generates the content of the chapter using the OpenAI model, considering:

- The book's theme.
- Summaries of previous chapters.
- Any instructions you've provided.

#### c. Saving the Chapter

The generated chapter is saved as a Markdown file in the `book_output/chapters` directory:

- **File Name:** `chapter_X.md` (where `X` is the chapter number)

#### d. Summarizing the Chapter

The script creates a concise summary of the chapter to maintain context for future chapters.

- The summary is saved in the `book_output/summaries` directory as `X.txt`.

#### e. Continue or Stop Writing

You will be asked:

```
Do you want to write the next chapter? (yes/no):
```

- **Type `yes` or `y`:** Continues to the next chapter.
- **Type `no` or `n`:** Ends the writing session.

### 3. Ending the Session

When you choose not to continue, the script will display:

```
Book writing session completed.
```

## Directory Structure

The script creates an output directory with the following structure:

```
book_output/
├── chapters/
│   ├── chapter_1.md
│   ├── chapter_2.md
│   └── ...
└── summaries/
    ├── 1.txt
    ├── 2.txt
    └── ...
```

- **`chapters/`:** Contains the full content of each chapter.
- **`summaries/`:** Contains summaries of each chapter for context in generating subsequent chapters.

## Configuration Options

You can adjust the model parameters by modifying the `BookWriter` class constructor in `book_writer.ts`:

```typescript
this.model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000,
});
```

- **`modelName`:** Specifies the OpenAI model to use.
- **`temperature`:** Controls the creativity of the output (0.0 to 1.0).
  - Lower values produce more deterministic outputs.
  - Higher values produce more creative outputs.
- **`maxTokens`:** The maximum number of tokens in the generated response.

## Tips for Best Results

- **Be Specific with Instructions:** Providing clear instructions or plot points can guide the model to produce content that aligns with your vision.
- **Review Generated Content:** Read each chapter to ensure it meets your expectations. You can manually edit the Markdown files if needed.
- **Monitor the Narrative:** Keep an eye on the story's coherence, especially as it progresses over multiple chapters.

## Troubleshooting

### 1. OpenAI Authentication Errors

If you encounter authentication errors:

- **Check Your API Key:** Ensure that your OpenAI API key is correctly set as an environment variable.
- **API Key Permissions:** Verify that your API key has the necessary permissions to access the models.

### 2. Module Not Found Errors

If the script cannot find certain modules:

- **Install Missing Packages:** Run `npm install` to install all dependencies.
- **Check Typings:** Ensure that `@types/node` is installed for TypeScript definitions.

### 3. Permissions Issues

If the script cannot read or write files:

- **Check Directory Permissions:** Ensure that you have read and write permissions for the project directory and subdirectories.
- **Run as Administrator:** On Windows, you might need to run the terminal as an administrator.

### 4. Model Response Errors

If the model returns unexpected responses or errors:

- **Adjust Model Parameters:** Try changing the `temperature` or `maxTokens` settings.
- **Review Prompts:** Ensure that the prompts provided to the model are well-structured.

## Customization and Enhancement

- **Extend the Script:** You can modify the script to include character tracking, world-building details, or other features.
- **Change Output Formats:** If you prefer a different file format, adjust the `saveChapter` method to save files with the desired extension.
- **Integrate a GUI:** For a more user-friendly experience, consider integrating a graphical user interface.

## Contributing

If you'd like to contribute to the project, feel free to submit pull requests or report issues on the repository's issue tracker.

## License

This project is licensed under the **MIT License**.

---

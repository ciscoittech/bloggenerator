import { ChatOpenAI } from '@langchain/openai';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const access = util.promisify(fs.access);
const readdir = util.promisify(fs.readdir);

class BookWriter {
  private model: ChatOpenAI;
  private outputDir: string;
  private chaptersDir: string;
  private summariesDir: string;
  private theme: string;
  private chapterNumber: number;

  constructor() {
    // Initialize the OpenAI model
    this.model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Set up directories
    this.outputDir = path.join(__dirname, 'book_output');
    this.chaptersDir = path.join(this.outputDir, 'chapters');
    this.summariesDir = path.join(this.outputDir, 'summaries');

    // Initialize book properties
    this.theme = '';
    this.chapterNumber = 1;
  }

  // Initialize directories and get book theme
  async initialize() {
    await this.ensureDirectoryExists(this.outputDir);
    await this.ensureDirectoryExists(this.chaptersDir);
    await this.ensureDirectoryExists(this.summariesDir);
    await this.getBookTheme();
  }

  // Ensure a directory exists
  async ensureDirectoryExists(dirPath: string) {
    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
    }
  }

  // Get the theme or genre of the book from the user
  async getBookTheme() {
    this.theme = await this.promptUser('Enter the theme or genre of the book: ');
  }

  // Load summaries of previous chapters
  async loadPreviousSummaries(): Promise<string> {
    let summaries = '';
    try {
      const summaryFiles = await readdir(this.summariesDir);
      summaryFiles.sort();

      for (const file of summaryFiles) {
        const summaryPath = path.join(this.summariesDir, file);
        const summaryContent = await readFile(summaryPath, 'utf-8');
        summaries += `Chapter ${file.replace('.txt', '')} Summary:\n${summaryContent}\n\n`;
      }
    } catch (error) {
      console.error('Error loading summaries:', error);
    }
    return summaries;
  }

  // Generate a chapter based on the theme and previous summaries
  async generateChapter(): Promise<string> {
    const previousSummaries = await this.loadPreviousSummaries();
    const chapterInstructions = await this.promptUser(
      `Enter instructions or plot points for Chapter ${this.chapterNumber} (optional): `
    );

    const prompt = `
You are writing Chapter ${this.chapterNumber} of a novel with the theme "${this.theme}".

Previous Chapters Summary:
${previousSummaries}

Instructions for this chapter:
${chapterInstructions}

Please write the content of Chapter ${this.chapterNumber}, ensuring it continues the story coherently.
`;

    try {
      const response = await this.model.invoke(prompt);

      if (typeof response.content === 'string') {
        return response.content.trim();
      } else {
        throw new Error('Unexpected response content type.');
      }
    } catch (error) {
      console.error('Error generating chapter content:', error);
      throw error;
    }
  }

  // Summarize a chapter to include in the context for future chapters
  async summarizeChapter(chapterContent: string): Promise<string> {
    const prompt = `
Please provide a concise summary of the following chapter:

${chapterContent}
`;

    try {
      const response = await this.model.invoke(prompt);

      if (typeof response.content === 'string') {
        return response.content.trim();
      } else {
        throw new Error('Unexpected response content type.');
      }
    } catch (error) {
      console.error('Error summarizing chapter:', error);
      throw error;
    }
  }

  // Save chapter content to a file
  async saveChapter(content: string) {
    const fileName = `chapter_${this.chapterNumber}.md`;
    const filePath = path.join(this.chaptersDir, fileName);
    try {
      await writeFile(filePath, content, 'utf-8');
      console.log(`Chapter ${this.chapterNumber} saved to ${filePath}`);
    } catch (error) {
      console.error(`Error saving Chapter ${this.chapterNumber}:`, error);
      throw error;
    }
  }

  // Save chapter summary to a file
  async saveSummary(summary: string) {
    const fileName = `${this.chapterNumber}.txt`;
    const filePath = path.join(this.summariesDir, fileName);
    try {
      await writeFile(filePath, summary, 'utf-8');
      console.log(`Summary for Chapter ${this.chapterNumber} saved to ${filePath}`);
    } catch (error) {
      console.error(`Error saving summary for Chapter ${this.chapterNumber}:`, error);
      throw error;
    }
  }

  // Prompt the user for input
  async promptUser(query: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question(query, (input) => {
        rl.close();
        resolve(input);
      });
    });

    return answer;
  }

  // Main loop to write chapters
  async writeBook() {
    let continueWriting = true;

    while (continueWriting) {
      // Generate and save the chapter
      const chapterContent = await this.generateChapter();
      await this.saveChapter(chapterContent);

      // Summarize and save the chapter summary
      const chapterSummary = await this.summarizeChapter(chapterContent);
      await this.saveSummary(chapterSummary);

      // Ask the user if they want to continue
      const userResponse = await this.promptUser('Do you want to write the next chapter? (yes/no): ');
      continueWriting = userResponse.toLowerCase().startsWith('y');
      this.chapterNumber += 1;
    }
  }
}

// Execute the BookWriter
(async () => {
  try {
    const bookWriter = new BookWriter();
    await bookWriter.initialize();
    await bookWriter.writeBook();
    console.log('Book writing session completed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();

import { CronJob } from 'cron';
import { Gemini, GEMINI_EMBEDDING_MODEL, GEMINI_MODEL, GeminiEmbedding } from "@llamaindex/google";
import {
    Settings,
    VectorStoreIndex,
} from "llamaindex";
import { fetchPoolOHLCVData } from '../lib/extract';
import { JSONReader } from '@llamaindex/readers/json';
import { createWeeklyAnalysis } from '../lib/weeklyDb';

export const initWeeklyAnalysisJob = (): CronJob => {
    const job = new CronJob(
       '5 0 * * *', // Cron expression for 00:05 (5 minutes after midnight) every day
       // '*/5 * * * *', // Cron expression for every 5 minutes
        async function () {
            if (!process.env.GOOGLE_API_KEY) {
                throw new Error("Please set the GOOGLE_API_KEY environment variable.");
            }
            const data = await fetchPoolOHLCVData("0xe61db569e231b3f5530168aa2c9d50246525b6d6","day", 1, 7);
            const gemini = new Gemini({
                model: GEMINI_MODEL.GEMINI_2_0_FLASH,
            });
            const embedModel = new GeminiEmbedding({
                model: GEMINI_EMBEDDING_MODEL.EMBEDDING_001,
            });
            // Configure LlamaIndex to use Gemini
            Settings.llm = gemini;
            Settings.embedModel = embedModel;
            const prompt = "Analyze the latest market data and provide key insights on price movements, trends, and potential trading opportunities, and write a report like a financial report.";

            const jsonlBuffer = new TextEncoder().encode(JSON.stringify(data));
            const reader = new JSONReader({ isJsonLines: true });
            const document = await reader.loadDataAsContent(jsonlBuffer);
            const index = await VectorStoreIndex.fromDocuments(document);
            // Query the index
            const queryEngine = index.asQueryEngine();
            const { message } = await queryEngine.query({
                query: prompt,
            });
            // Output response with sources
            console.log({ message: message.content.toString() });
            await createWeeklyAnalysis(message.content.toString(), prompt);
            console.log(`Cron job Weekly Analysis executed at: ${new Date()}`);
        },
        null, // onComplete
        true, // start immediately
        'UTC' // timezone
    );

    return job;
};
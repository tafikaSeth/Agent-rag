import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});

const loader = new PDFLoader("./seth.pdf");
const docs = await loader.load();

const prompt = ChatPromptTemplate.fromTemplate(
  `En te basant uniquement sur le contexte fourni, réponds précisément à la question de l'utilisateur.
Contexte : {context}
Question : {input}
Réponse :`
);

const chain = await createStuffDocumentsChain({
  llm,
  prompt,
});

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question requise' });

  try {
    const ragResponse = await chain.invoke({
      context: [...docs],
      input: question
    });

    res.json({ answer: ragResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
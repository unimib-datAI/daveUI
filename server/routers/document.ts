import { DOCUMENTS } from "@/documents";
import path from "path";
import { promises as fs } from 'fs'
import { z } from "zod";
import { createProtectedRouter } from "../context";
import { TRPCError } from "@trpc/server";
import { Annotation } from "@/hooks/use-ner";

export type Document = {
  id: string;
  title: string;
  content: string;
  annotations: Annotation[]
};

export type Candidate = {
  wikipedia_id: number;
  title: string;
  url: string;
  score: number;
  norm_score: number;
}

export type AdditionalAnnotationProps = {
  top_title?: string,
  top_wikipedia_id?: number,
  top_url?: string;
  candidates?: Candidate;
};

export type NERAnnotation = Annotation<AdditionalAnnotationProps>;


const getDocumentById = async (id: string): Promise<Document> => {
  const document = DOCUMENTS[id];
  if (!document) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Document with id '${id}' not found.`
    })
  }
  const documentPath = path.join(process.cwd(), '_files', document.content);
  const content = await fs.readFile(documentPath, 'utf-8');
  const documentAnnotationPath = path.join(process.cwd(), '_files', document.annotation);
  const annotations = JSON.parse(await fs.readFile(documentAnnotationPath, 'utf8'));

  return { ...document, content, annotations };
}

export type GetAllDocuments = {
  id: string;
  title: string;
  preview: string;
}[]

const getDocuments = async (): Promise<GetAllDocuments> => {
  return Promise.all(Object.keys(DOCUMENTS).map(async (key) => {
    const document = DOCUMENTS[key];
    const documentPath = path.join(process.cwd(), '_files', document.content);
    const content = await fs.readFile(documentPath, 'utf-8');
    const preview = content.slice(0, 600);
    return {
      id: document.id,
      title: document.title,
      preview
    }
  }));
}

export const documents = createProtectedRouter()
  .query('getDocument', {
    input: z
      .object({
        id: z.string(),
      }),
    resolve: ({ input }) => {
      const { id } = input;
      return getDocumentById(id);
    },
  })
  .query('getAllDocuments', {
    resolve: () => {
      return getDocuments();
    },
  })
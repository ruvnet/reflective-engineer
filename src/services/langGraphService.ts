import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation, messagesStateReducer } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { createOpenRouterClient } from "./settingsService";
import { ChatOpenAI } from "@langchain/openai";

// Define the graph state
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
  }),
});

export class LangGraphService {
  private app: any;
  private checkpointer: MemorySaver;

  constructor(apiKey: string, modelId: string) {
    // Initialize OpenRouter as the LLM provider
    const client = createOpenRouterClient(apiKey);
    const model = new ChatOpenAI({
      modelName: modelId,
      temperature: 0,
      client,
    });

    // Initialize memory
    this.checkpointer = new MemorySaver();

    // Define the workflow
    const workflow = new StateGraph(StateAnnotation)
      .addNode("agent", this.callModel(model))
      .addEdge("__start__", "agent");

    // Compile the graph
    this.app = workflow.compile({ checkpointer: this.checkpointer });
  }

  private callModel(model: ChatOpenAI) {
    return async (state: typeof StateAnnotation.State) => {
      const messages = state.messages;
      const response = await model.invoke(messages);
      return { messages: [response] };
    };
  }

  public async processPrompt(prompt: string, threadId?: string) {
    try {
      const finalState = await this.app.invoke(
        { 
          messages: [new HumanMessage(prompt)] 
        },
        { 
          configurable: { thread_id: threadId || crypto.randomUUID() } 
        }
      );

      return finalState.messages[finalState.messages.length - 1].content;
    } catch (error) {
      console.error("Error processing prompt with LangGraph:", error);
      throw error;
    }
  }
}

// Export a factory function to create new instances
export const createLangGraphService = (apiKey: string, modelId: string) => {
  return new LangGraphService(apiKey, modelId);
};

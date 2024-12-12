import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { ToolNode } from "@langchain/langgraph/prebuilt";

// Define the base state annotation for all agents
export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
  }),
});

export class LangChainService {
  private model: ChatAnthropic;
  private checkpointer: MemorySaver;

  constructor(apiKey: string, modelId: string) {
    this.model = new ChatAnthropic({
      apiKey,
      modelName: modelId,
      temperature: 0
    });
    this.checkpointer = new MemorySaver();
  }

  async createAgentGraph(tools: any[] = []) {
    const toolNode = new ToolNode(tools);
    this.model = this.model.bindTools(tools);

    // Define the agent's decision function
    const shouldContinue = (state: typeof StateAnnotation.State) => {
      const messages = state.messages;
      const lastMessage = messages[messages.length - 1] as AIMessage;
      return lastMessage.tool_calls?.length ? "tools" : "__end__";
    };

    // Define the model call function
    const callModel = async (state: typeof StateAnnotation.State) => {
      const messages = state.messages;
      const response = await this.model.invoke(messages);
      return { messages: [response] };
    };

    // Create and compile the graph
    const workflow = new StateGraph(StateAnnotation)
      .addNode("agent", callModel)
      .addNode("tools", toolNode)
      .addEdge("__start__", "agent")
      .addConditionalEdges("agent", shouldContinue)
      .addEdge("tools", "agent");

    return workflow.compile({ checkpointer: this.checkpointer });
  }

  async runAgent(input: string, threadId: string) {
    const graph = await this.createAgentGraph();
    return await graph.invoke(
      { messages: [new HumanMessage(input)] },
      { configurable: { thread_id: threadId }}
    );
  }
}

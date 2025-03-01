export type Message = {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  timestamp: Date;
};

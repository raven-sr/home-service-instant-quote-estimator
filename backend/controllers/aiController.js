
const EstimationRequest = require("../models/EstimationRequest");
const groq = require("../config/groq");

// Reusable Groq AI function
async function askGroq(messages, instructions) {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("GROQ_API_KEY is missing.");
    error.statusCode = 503;
    throw error;
  }

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content: instructions,
      },
      ...messages,
    ],

    temperature: 0.5,
    max_tokens: 800,
  });

  const reply = response.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("Groq returned an empty response.");
  }

  return reply;
}

// Homeowner chatbot
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const request = await EstimationRequest.findOne({
      _id: req.params.id,
      homeowner: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Estimation request not found.",
      });
    }

    const instructions = `
You are an expert home-service project assistant.

The current project type is ${request.serviceType}.

Help homeowners with roofing and painting projects.

Your responsibilities:
1. Understand the homeowner's requirements.
2. Ask relevant follow-up questions.
3. Collect property and project details.
4. Explain visible property conditions when image
   information is supplied.
5. Help collect the information needed for an estimate.

Important rules:
- Never invent measurements or dimensions.
- Never invent material quantities or prices.
- Never claim to know hidden structural damage.
- Do not generate a final quotation without
  verified measurements and configured pricing.
- Keep responses clear and conversational.
`;

    // Get the latest conversation history
    const history = request.conversation
      .slice(-12)
      .map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: item.text,
      }));

    // Send history and the latest message to Groq
    const reply = await askGroq(
      [
        ...history,
        {
          role: "user",
          content: message.trim(),
        },
      ],
      instructions
    );

    // Save conversation in MongoDB
    request.conversation.push(
      { role: "user", text: message.trim() },
      { role: "assistant", text: reply }
    );

    await request.save();

    return res.status(200).json({
      success: true,
      reply,
      conversation: request.conversation,
    });

  } catch (error) {
    console.error("Groq Chat Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to process your message.",
    });
  }
};

// Export helper for other controllers if needed
exports.askGroq = askGroq;

import React, { useState } from "react";
import OpenAI from "openai";
import Markdown from "react-markdown";

const openai = new OpenAI({
  apiKey:" ",
  dangerouslyAllowBrowser: true,
});

const App = () => {
  const [recipe, setRecipe] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedRecipe("");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a detailed recipe generator. You will either be provided with a name of a dish or ingredients. If you are provided with a name of a dish generate a recipe of that dish. If you are provided with set of ingredients that user has handy with them, then help them cook something delicious out of those ingredients.",
        },
        {
          role: "user",
          content: recipe,
        },
      ],
      store: true,
    });
    console.log(completion.choices[0].message.content);
    setGeneratedRecipe(completion.choices[0].message.content);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <h1 className="text-5xl font-extrabold text-white mb-8 animate-bounce">
        Flavour Fushion<br />
       <center> <span className="text-sm text-gray-500 text-align-center">AI-powered recipe generator</span></center>
      </h1>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <input
          type="text"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          placeholder="Enter ingredients"
          className="w-full p-4 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleGenerate}
          className={`w-full bg-blue-500 text-white p-4 rounded hover:bg-blue-600 cursor-pointer transition duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
      {generatedRecipe && (
        <div className="mt-8 p-6 bg-white shadow-lg rounded-lg max-w-2xl w-full">
          <Markdown className="prose">{generatedRecipe}</Markdown>
        </div>
      )}
    </div>
  );
};

export default App;

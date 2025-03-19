import React, { useState } from "react";
import OpenAI from "openai";
import Markdown from "react-markdown";

const openai = new OpenAI({
  apiKey:process.env.REACT_APP_OPENAI_API_KEY,
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
            "You are a detailed recipe generator. You will either be provided with a name of a dish or ingredients. If you are provided with a name of a dish generate a recipe of that dish. If you are provided with set of ingredients that user has handy with them, then help them cook something delicious out of those ingredients. Output should have a section for named ingredients and it should contain the list of ingredients required as well as the amazon, walmart or any other online store link to buy that ingredient. Output should also have a section for instructions which should contain the step by step instructions to cook the dish. The output should be in markdown format. Do not generate any kind of tables. And for links make them italic in markdown format.",
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('bg2.jpg')" }}>
      <h1 className="text-5xl font-extrabold text-white mb-8 text-center">
        Flavour Fusion
        <span className="block text-sm mt-2">AI-powered recipe generator</span>
      </h1>
      <div className="w-full max-w-md bg-opacity-80 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <input
          type="text"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          placeholder="Enter ingredients or dish name"
          className="w-full p-4 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-200"
        />
        <button
          onClick={handleGenerate}
          className={`w-full bg-gradient-to-r from-black to-pink-500 text-white p-4 rounded-full hover:from-pink-500 hover:to-black cursor-pointer transition duration-300 transform hover:scale-105 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
      {generatedRecipe && (
        <div className="mt-8 p-6 bg-transparent text-zinc-200 bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg max-w-2xl w-full overflow-y-auto h-80 dark-scrollbar"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <Markdown className="prose" components={{
            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" style={{color: "cyan"}} />
          }}>
            {generatedRecipe}
          </Markdown>
        </div>
      )}
    </div>
  );
};

export default App;

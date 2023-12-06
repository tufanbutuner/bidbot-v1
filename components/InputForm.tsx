import { useState } from "react";
import Input from "./Input";

export default function InputForm({ onSubmit, disabled }: any) {
  const [input1, setInput1] = useState(
    "You work for Transform UK. As a smart, commercially aware professional, who is passionate about helping clients and enjoys solving difficult problems, you write in an active voice with empathy and enthusiasm to distil difficult and technical ideas into simple terms. You have been asked to write 100 words to answer the question using only the context below."
  );
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [wordsToInclude, setWordsToInclude] = useState("");
  const [wordsToExclude, setWordsToExclude] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case "input-1":
        setInput1(value);
        break;
      case "input-2":
        setInput2(value);
        break;
      case "input-3":
        setInput3(value);
        break;
      case "promote":
        setWordsToInclude(value);
        break;
      case "exclude":
        setWordsToExclude(value);
        break;
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({
      input1,
      input2,
      input3,
      wordsToInclude: wordsToInclude.split(",").map((word) => word.trim()),
      wordsToExclude: wordsToExclude.split(",").map((word) => word.trim()),
    });
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow w-full">
      <form
        action="/api/embeddings"
        className="input-container"
        onSubmit={handleSubmit}
      >
        <div className="input-block">
          <Input
            isTextarea
            label="Prompt Basis"
            tooltipText='This text forms the basis of the prompt, it sets the guidelines, style and format and asks the LLM to "role play" to answer the question. You may change it from the default to try different approaches.'
            name="input-1"
            placeholder="Prompt context"
            value={input1}
            onChange={handleInputChange}
          />

          <Input
            label="Promoted words"
            tooltipText="Enter words that you wish to include, separated by commas, e.g. 'agile, transformation, discovery'."
            type="text"
            name="promote"
            placeholder="Enter words that you wish to include, separated by commas, e.g. 'agile, transformation, discovery'."
            value={wordsToInclude}
            onChange={handleInputChange}
          />

          <Input
            label="Excluded words"
            tooltipText="Enter words that you wish to exclude, separated by commas, e.g. 'track record, intranet, delivery'."
            type="text"
            name="exclude"
            placeholder="Enter words that you wish to exclude, separated by commas, e.g. 'track record, intranet, delivery'."
            defaultValue={wordsToExclude}
            onChange={handleInputChange}
          />

          <Input
            label="Context Documents (25 or less for best results)"
            tooltipText="The LLM will only answer based on these documents and these are the documents most similar to your question. So consider changing the question if you want different context documents."
            type="number"
            name="input-2"
            placeholder="Context Documents (25 or less for best results)"
            min={2}
            max={25}
            value={input2}
            onChange={handleInputChange}
            required
          />

          <Input
            isTextarea
            label="Prompt Question"
            tooltipText="This is the question you wish to create your 100 worder around, this will also determine which context documents the system retrieves."
            name="input-3"
            placeholder="Prompt Question"
            value={input3}
            onChange={handleInputChange}
            required
          />

          <button className="submit-button" type="submit" disabled={disabled}>
            <p>Submit</p>
          </button>
        </div>
      </form>
    </div>
  );
}

// DocumentDisplay.js
import ReactMarkdown from "react-markdown";

interface DocumentMetadata {
  Question: string;
  Title: string;
  bodycontentid: string;
  lastmoddate: string;
  text: string;
}

export default function DocumentDisplay({ documents, answer, loading }: any) {
  return (
    <div className="output-container">
      <div className="chat-container">
        <strong>Answer</strong>
        {loading ? (
          <div className="loading-indicator">
            <p>Thinking...</p>
          </div>
        ) : (
          answer.text && (
            <div className="answer-container">
              <ReactMarkdown>{answer.text}</ReactMarkdown>
              <div className="answer-metadata-container">
                <p className="answer-metadata">
                  Word count: {answer.wordCount}
                </p>
                <p className="answer-metadata">
                  Character count: {answer.characterCount}
                </p>
                <p className="answer-metadata">
                  Token amount: {answer.tokenAmount}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <div className="chat-container">
        {answer.documentsUsed > 0 ? (
          <strong>Context documents used: {answer.documentsUsed}</strong>
        ) : (
          <strong> Documents used</strong>
        )}
        {loading ? (
          <div className="loading-indicator">
            <p>Thinking...</p>
          </div>
        ) : documents.metadata && documents.metadata.length > 0 ? (
          documents.metadata.map((doc: DocumentMetadata, index: number) => (
            <div key={index} className="document-answer-container">
              <div className="answer-metadata-container">
                <span className="answer-metadata">
                  Similarity Score: {documents.score[index].toFixed(2)}
                </span>
                <span className="answer-metadata">
                  Tokens: {documents.tokens[index]}
                </span>
              </div>
              <h5>{doc.Question}</h5>
              <p>{doc.Title}</p>
              <p>{doc.text}</p>
            </div>
          ))
        ) : (
          <p>No documents available.</p>
        )}
      </div>
    </div>
  );
}

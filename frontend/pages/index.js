import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [model, setModel] = useState('gpt-4'); // Default model
  const [file, setFile] = useState(null); // State for file upload

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('message', input); // Ensure this is not empty
      formData.append('model', model); // Ensure this is valid
      if (file) {
        formData.append('file', file); // Append the file if it exists
      }

      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        body: formData, // Send form data
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.message);
      setInput(''); // Clear input after sending
      setFile(null); // Clear file after sending
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat with AI</title>
        <meta name="description" content="Chat with an AI assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Chat with AI
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputContainer}>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)} // Update model state
              className={styles.inputField}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-32k">GPT-4 32k</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="davinci">Davinci</option>
              <option value="curie">Curie</option>
              <option value="claude">Claude</option>
            </select>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className={styles.inputField}
              required // Make input required
            />
            <input
              type="file"
              accept=".pdf,image/*" // Allow PDF and image files
              onChange={handleFileChange}
              className={styles.uploadButton}
            />
            <button type="submit" className={styles.button}>Send</button>
          </div>
        </form>

        {response && (
          <div className={styles.response}>
            <h2>AI Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Powered by Mahesh</p>
      </footer>
    </div>
  );
}

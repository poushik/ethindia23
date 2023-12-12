import { useState } from 'react';

export default function CreateGatedRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-gated-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { 
              title: 'Kalvi',
              tokenType: 'ERC721',
              chain: 'ARBITRUM',
              contractAddress: ['0x2B259cD40DDE4feF333F96Ce11d326ffd191Cad8']
          },
        ),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Create Room'}
      </button>
      {result && (
        <p>Room created successfully with ID: {result.data.roomId}</p>
      )}
    </div>
  );
}
  
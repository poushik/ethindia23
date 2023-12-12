import { useState } from 'react';

export default function CreateRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'FilterApp', hostWallets: ['0xE15420f66Fd4285E5Ee3036A39CE086913bF370c'] }),
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

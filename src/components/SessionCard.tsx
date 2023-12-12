import { useRouter } from 'next/router';
import { Poppins } from 'next/font/google'
import styles from './SessionCard.module.css'
import Image from 'next/image';
import { Session } from '@/types';

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

interface SessionCardProps {
    session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const router = useRouter();

  return (
    <div className={`${styles.sessionId} ${poppins.className}`}>
      <Image
        className={styles.simg}
        src={session.image || 'https://ipfs.io/ipfs/QmaSHs4gkn3rSGv73eCNduqHN9WTFoWWLjabXFbpD3Yh6P/0.png'}
        alt={session.title || 'Filter Access NFT'}
        width={220}
        height={220}
        priority
      />
      <p>{session.title}</p>
      <h6>0.001 ETH</h6>
    </div>
  );
}
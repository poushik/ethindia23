import { useRouter } from 'next/router';
import { Poppins } from 'next/font/google'
import styles from './SessionCard.module.css'
import Image from 'next/image';
import { Session } from '@/types';

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

export default function UpcomingSessionCard({ session }: any) {
  const router = useRouter();
  return (
    <div className={`${styles.upcomingsessioncard} ${poppins.className}`}>
      <Image
        className={styles.uscimg}
        src={session.rawMetadata?.image || 'https://ipfs.io/ipfs/QmaSHs4gkn3rSGv73eCNduqHN9WTFoWWLjabXFbpD3Yh6P/0.png'}
        alt={session.title || 'Filter Access NFT'}
        width={320}
        height={400}
        priority
      />
      <div className={styles.uscicont}>
        <p>{session.title}</p>
        <h6>0.001 ETH</h6>
      </div>
    </div>
  );
}
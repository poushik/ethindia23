import { Poppins } from 'next/font/google'
import styles from './Nav.module.css'
import { ConnectKitButton } from "Connect"
import Link from 'next/link'

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

export default function Nav() {
  return (
    <div className={`${styles.nav} ${poppins.className}`}>
        <div className={styles.navcontent}>
            <h1><Link href="/"></Link></h1>
            {/* <h1><a href="/">Filter Connect</a></h1> */}
            {/* <button>Connect</button> */}
            <div className={styles.navbutton}>
              <ConnectKitButton theme='rounded'/>
            </div>
        </div>
    </div>
  )
}

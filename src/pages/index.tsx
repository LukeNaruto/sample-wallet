import Link from 'next/link';

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <Link href="/sample-wallet">sample-wallet</Link>
        </li>
        <li>
          <Link href="/noah-token">noah-token</Link>
        </li>
      </ul>
    </>
  )
}

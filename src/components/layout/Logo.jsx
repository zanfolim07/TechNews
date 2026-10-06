import { Link } from 'react-router'

export function Logo({ clara = false, aoClicar = () => {} }) {
  return (
    <Link
      to="/"
      className={`logo ${clara ? 'logo--clara' : ''}`}
      aria-label="Tech News, página inicial"
      onClick={aoClicar}
    >
      <span className="logo__nome">Tech news</span>
    </Link>
  )
}

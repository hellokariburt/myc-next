import { ReactQueryProvider } from '../ReactQueryProvider';

export default function MicsLayout({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}

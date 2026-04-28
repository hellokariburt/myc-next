import type { Metadata } from 'next';
import SubmitMicForm from '@/components/submit/SubmitMicForm';

export const metadata: Metadata = {
  title: 'Submit an Open Mic | OpenMYC',
  description:
    'Know about an open mic in NYC that is not listed? Submit it to OpenMYC and help fellow comedians find new stages.',
  openGraph: {
    title: 'Submit an Open Mic | OpenMYC',
    description: 'Help fellow comedians find new stages. Submit an NYC open mic to OpenMYC.',
    url: 'https://findopenmyc.com/submit',
  },
};

export default function SubmitPage() {
  return <SubmitMicForm />;
}

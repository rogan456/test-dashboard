import Link from 'next/link';
import BlueCard from './BlueCard';

const cards = [
  { href: '/activities', title: 'Total Activities', value: 1250 },
  { href: '/trainings', title: 'Total trainings', value: 50 },
  { href: '/programs', title: 'Total programs', value: 200 },
  { href: '/events', title: 'Total events', value: 200 },
];

export default function GenStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map(card => (
        <Link href={card.href} key={card.href} className="h-full">
          <BlueCard title={card.title} value={card.value} />
        </Link>
      ))}
    </div>
  );
}
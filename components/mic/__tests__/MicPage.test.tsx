import { render, screen } from '@testing-library/react';
import MicPage from '../MicPage';
import { MicDetail } from '@/lib/types/mic';

// Mock tabler icons to avoid SVG rendering issues in tests
jest.mock('@tabler/icons-react', () => ({
  IconExternalLink: () => <span data-testid="icon-link" />,
  IconMapPin: () => <span data-testid="icon-pin" />,
  IconBrandInstagram: () => <span data-testid="icon-ig" />,
  IconMail: () => <span data-testid="icon-mail" />,
  IconClock: () => <span data-testid="icon-clock" />,
  IconCalendar: () => <span data-testid="icon-calendar" />,
  IconCurrencyDollar: () => <span data-testid="icon-dollar" />,
}));

const fullMic: MicDetail = {
  id: 36,
  borough: 'manhattan',
  confirmed: '2024-01-15',
  day: 'sunday',
  name: 'Test Open Mic',
  start_time: '1970-01-01T14:00:00.000Z',
  end_time: null,
  instagram: '@testmic',
  website: 'https://testmic.com',
  email_address: 'test@mic.com',
  venue_type: 'Bar',
  stage_time: '5 min',
  other_rules: null,
  neighborhood: 'East Village',
  phone_number: null,
  notes: null,
  mic_address: {
    venue: 'Test Venue',
    street_name: '123 Main St',
    unit_number: 5,
    latitude: '40.7',
    longitude: '-73.9',
  },
  mic_cost: { cost_amount: 'Free' },
  mic_occurrence: { schedule: 'Weekly' },
  signup_instructions: { instructions: 'Sign up at the door' },
  host_mics: [
    { mic_host: { first_host: 'Jane Doe', email: 'jane@host.com', instagram: '@janehost' } },
  ],
};

describe('MicPage', () => {
  it('renders full mic data', () => {
    render(<MicPage mic={fullMic} />);

    expect(screen.getByText('Test Open Mic')).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
    expect(screen.getByText('East Village')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
    expect(screen.getByText('2:00pm')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Get Directions')).toBeInTheDocument();
    expect(screen.getByText('Sign up at the door')).toBeInTheDocument();
    expect(screen.getByText('Visit site')).toBeInTheDocument();
  });

  it('renders without optional fields', () => {
    const minimalMic: MicDetail = {
      ...fullMic,
      neighborhood: null,
      instagram: null,
      website: null,
      email_address: null,
      mic_occurrence: null,
      signup_instructions: null,
      confirmed: null,
      host_mics: [],
      mic_address: {
        venue: 'Bare Venue',
        street_name: null,
        unit_number: 0,
        latitude: null,
        longitude: null,
      },
    };

    render(<MicPage mic={minimalMic} />);

    expect(screen.getByText('Test Open Mic')).toBeInTheDocument();
    expect(screen.getByText('Bare Venue')).toBeInTheDocument();
    // No directions button when no lat/lng
    expect(screen.queryByText('Get Directions')).not.toBeInTheDocument();
    // No instagram, website, email sections
    expect(screen.queryByText('Visit site')).not.toBeInTheDocument();
    expect(screen.queryByText('@testmic')).not.toBeInTheDocument();
    // No neighborhood
    expect(screen.queryByText('East Village')).not.toBeInTheDocument();
    // No verified badge
    expect(screen.queryByText(/Verified/)).not.toBeInTheDocument();
  });

  it('renders unit number only when > 0', () => {
    const { container, rerender } = render(<MicPage mic={fullMic} />);
    expect(container.textContent).toContain('5');

    const noUnitMic: MicDetail = {
      ...fullMic,
      mic_address: { ...fullMic.mic_address!, unit_number: 0 },
    };
    rerender(<MicPage mic={noUnitMic} />);
    // unit_number 0 should not appear — only street and borough render
    expect(screen.getByText('123 Main St,')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows Free when cost_amount is null', () => {
    const noCostMic: MicDetail = {
      ...fullMic,
      mic_cost: null,
    };
    render(<MicPage mic={noCostMic} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows cost amount for paid mics', () => {
    const paidMic: MicDetail = {
      ...fullMic,
      mic_cost: { cost_amount: '$5' },
    };
    render(<MicPage mic={paidMic} />);
    expect(screen.getByText('$5')).toBeInTheDocument();
  });

  it('does not render directions when street_name is null', () => {
    const noStreetMic: MicDetail = {
      ...fullMic,
      mic_address: { ...fullMic.mic_address!, street_name: null },
    };
    render(<MicPage mic={noStreetMic} />);
    expect(screen.queryByText('Get Directions')).not.toBeInTheDocument();
  });

  it('filters out invalid website URLs', () => {
    const badUrlMic: MicDetail = {
      ...fullMic,
      website: 'not-a-url',
    };
    render(<MicPage mic={badUrlMic} />);
    expect(screen.queryByText('Visit site')).not.toBeInTheDocument();
  });
});

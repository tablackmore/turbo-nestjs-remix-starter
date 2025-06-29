import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { title: 'Theme Demo - Clean CSS Custom Property System' },
    { name: 'description', content: 'Showcase of our clean theme override system' },
  ];
};

export default function ThemeDemo() {
  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-7xl mx-auto space-y-12'>
        {/* Navigation */}
        <div className='flex justify-between items-center'>
          <Link to='/' className='text-blue-600 hover:text-blue-800 underline'>
            ← Back to Items Demo
          </Link>
          <a
            href='http://localhost:3001/api-docs'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 underline'
          >
            📚 API Documentation
          </a>
        </div>

        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-display font-bold text-foreground'>Clean Theme System</h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Showcasing our CSS custom property theme that overrides semantic components with
            mood-based colors while keeping the UI library generic and reusable.
          </p>
        </div>

        {/* Semantic Components with Mood Theme */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Semantic Components (Auto-Themed)
          </h2>
          <p className='text-muted-foreground'>
            These components use semantic variants but get mood-based colors through CSS custom
            properties.
          </p>

          <Card>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='space-y-3'>
                <h3 className='font-medium text-card-foreground'>Primary Actions</h3>
                <p className='text-sm text-muted-foreground'>Energetic coral for main CTAs</p>
                <Button variant='primary' size='md'>
                  Book Now
                </Button>
                <Button variant='primary' size='sm'>
                  Get Started
                </Button>
              </div>

              <div className='space-y-3'>
                <h3 className='font-medium text-card-foreground'>Secondary Actions</h3>
                <p className='text-sm text-muted-foreground'>Calm mocha for secondary buttons</p>
                <Button variant='secondary' size='md'>
                  Learn More
                </Button>
                <Button variant='secondary' size='sm'>
                  View Details
                </Button>
              </div>

              <div className='space-y-3'>
                <h3 className='font-medium text-card-foreground'>Success Actions</h3>
                <p className='text-sm text-muted-foreground'>Earthy moss for positive actions</p>
                <Button variant='success' size='md'>
                  Save Changes
                </Button>
                <Button variant='success' size='sm'>
                  Confirm
                </Button>
              </div>

              <div className='space-y-3'>
                <h3 className='font-medium text-card-foreground'>Destructive Actions</h3>
                <p className='text-sm text-muted-foreground'>
                  Ruby red for attention-grabbing actions
                </p>
                <Button variant='destructive' size='md'>
                  Delete Account
                </Button>
                <Button variant='destructive' size='sm'>
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Direct Mood Theme Classes */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>Direct Mood Theme Classes</h2>
          <p className='text-muted-foreground'>
            Apply mood themes directly to any element with utility classes.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='theme-calm p-6 rounded-lg'>
              <h3 className='text-lg font-semibold mb-2'>Calm & Grounding</h3>
              <p className='text-sm opacity-90'>
                Perfect for footers, modals, and content areas that need a stable, trustworthy feel.
              </p>
              <Button
                variant='outline'
                className='mt-4 border-white/20 text-white hover:bg-white/10'
              >
                Learn More
              </Button>
            </div>

            <div className='theme-elegant p-6 rounded-lg'>
              <h3 className='text-lg font-semibold mb-2'>Elegant & Deep</h3>
              <p className='text-sm opacity-90'>
                Ideal for headers, overlays, and premium content that demands sophistication.
              </p>
              <Button
                variant='outline'
                className='mt-4 border-white/20 text-white hover:bg-white/10'
              >
                Explore
              </Button>
            </div>

            <div className='theme-playful p-6 rounded-lg'>
              <h3 className='text-lg font-semibold mb-2'>Playful Pastel</h3>
              <p className='text-sm opacity-90'>
                Great for forms, hover states, and friendly interactive elements.
              </p>
              <Button variant='outline' className='mt-4 border-current hover:bg-black/5'>
                Try It
              </Button>
            </div>

            <div className='theme-energetic p-6 rounded-lg'>
              <h3 className='text-lg font-semibold mb-2'>Energetic Pop</h3>
              <p className='text-sm opacity-90'>
                Perfect for CTAs, highlights, and elements that need immediate attention.
              </p>
              <Button
                variant='outline'
                className='mt-4 border-white/20 text-white hover:bg-white/10'
              >
                Take Action
              </Button>
            </div>

            <div className='theme-luxe p-6 rounded-lg'>
              <h3 className='text-lg font-semibold mb-2'>Tactile & Luxe</h3>
              <p className='text-sm opacity-90'>
                Excellent for premium features, separators, and high-end product sections.
              </p>
              <Button
                variant='outline'
                className='mt-4 border-white/20 text-white hover:bg-white/10'
              >
                Upgrade
              </Button>
            </div>
          </div>
        </section>

        {/* Component-Specific Mood Overrides */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Component-Specific Mood Overrides
          </h2>
          <p className='text-muted-foreground'>
            Override individual components with specific mood themes while preserving their semantic
            behavior.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='mood-card-calm'>
              <h3 className='text-lg font-semibold mb-3'>Calm Card</h3>
              <p className='text-sm mb-4 opacity-90'>
                This card uses the calm mood override while maintaining all Card component
                functionality.
              </p>
              <Button variant='outline' className='border-white/20 text-white hover:bg-white/10'>
                Read More
              </Button>
            </Card>

            <Card className='mood-card-elegant'>
              <h3 className='text-lg font-semibold mb-3'>Elegant Card</h3>
              <p className='text-sm mb-4 opacity-90'>
                Sophisticated styling for premium content while using the same Card component.
              </p>
              <Button variant='outline' className='border-white/20 text-white hover:bg-white/10'>
                Discover
              </Button>
            </Card>

            <Card className='mood-card-luxe'>
              <h3 className='text-lg font-semibold mb-3'>Luxe Card</h3>
              <p className='text-sm mb-4 opacity-90'>
                High-end brass styling with chrome accents for luxury experiences.
              </p>
              <Button variant='outline' className='border-white/20 text-white hover:bg-white/10'>
                Experience
              </Button>
            </Card>
          </div>
        </section>

        {/* Mixed Usage Example */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>Real-World Example</h2>
          <p className='text-muted-foreground'>
            A practical example showing how different mood themes work together in a cohesive
            design.
          </p>

          <Card className='mood-card-elegant'>
            <div className='space-y-6'>
              <div>
                <h3 className='text-2xl font-bold mb-2'>Premium Membership</h3>
                <p className='opacity-90'>
                  Unlock exclusive features and content with our premium tier.
                </p>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between py-2'>
                  <span>Advanced Analytics</span>
                  <span className='text-sm opacity-75'>✓</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Priority Support</span>
                  <span className='text-sm opacity-75'>✓</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Custom Integrations</span>
                  <span className='text-sm opacity-75'>✓</span>
                </div>
              </div>

              <div className='flex gap-3 pt-4'>
                <Button variant='primary' className='flex-1'>
                  Upgrade Now
                </Button>
                <Button variant='outline' className='border-white/20 text-white hover:bg-white/10'>
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Architecture Benefits */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>Architecture Benefits</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <h3 className='text-lg font-semibold mb-3 text-success'>✓ Clean Separation</h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• UI library stays generic and reusable</li>
                <li>• Web app defines its own theme</li>
                <li>• No coupling between components and colors</li>
                <li>• Easy to maintain and update</li>
              </ul>
            </Card>

            <Card>
              <h3 className='text-lg font-semibold mb-3 text-success'>✓ Flexibility</h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Override any semantic color instantly</li>
                <li>• Apply mood themes to specific components</li>
                <li>• Dark mode support built-in</li>
                <li>• Runtime theme switching possible</li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

import ClientReviews from '../../../../components/HTML/ClientReviews';
import { testimonials } from '../data';
import Icon from '../shared/Icon';
import SectionHeader from '../shared/SectionHeader';

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="container">
        <SectionHeader className="testimonials-header" label="Client Experiences" title="What Executives Say" />
        </div>
       <ClientReviews/>
     
    </section>
  );
}

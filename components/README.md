# Component Guide

Each reusable component follows the BEM-inspired naming from the template.

- **Header + Nav**: Use the `.site-header`, `.site-header__brand`, `.primary-nav`, and `.nav-toggle` blocks. This keeps the sticky header responsive and provides visible focus states.
- **Hero Section**: The `.hero` block wraps a `.hero__content` grid with `.hero__title`, `.hero__subtitle`, and `.hero__actions`. Buttons use `.btn` utilities (`.btn--primary`, `.btn--ghost`).
- **Section + Card Blocks**: Shared section styles include `.section` and `.section__title`. Cards extend `.feature-card` with title and body classes to maintain consistent padding.
- **Testimonial Cards**: `.testimonial`, `.testimonial__quote`, and `.testimonial__author` present balanced cards for qualitative feedback.
- **Forms**: `.form-field`, `.form-field__label`, `.form-field__input`, `.form-field__textarea`, and `.form-field__select` compose the contact form layout. Use `.form-status` for validation messaging.
- **Accordion / FAQ**: Use `.accordion`, `.accordion__item`, `.accordion__trigger`, and `.accordion__content` for collapsible details.

Drop new component partials into this folder if the site evolves to a templating layer.

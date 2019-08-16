import { storiesOf } from '@storybook/svelte'
import { action } from '@storybook/addon-actions'

import Book from './Book.svelte'

storiesOf('Book', module)
  .add('with text', () => ({
    Component: Book,
    props: { text: 'Book First pass' }
  }))

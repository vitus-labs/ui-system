import React from 'react'
import { Element } from '@vitus-labs/elements'
import rocketstyle from '../../'

export default rocketstyle({
  dimensions: {
    gaps: 'gap',
    paddings: 'padding',
  },
  useBooleans: true,
})({ name: 'Button', component: Element })
  .attrs({
    tag: 'button',
    label: 'This is a label',
  })
  .theme({
    bgColor: '#007bff',
    color: '#fff',
  })
  .styles(
    (css) => css`
      border: 1px solid transparent;
      ${'' /* padding: 0 0.75rem; */}

      height: 80px;
      font-size: 1rem;
      border-radius: 0.25rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        flex: 1 0 auto;
      }

      ${({ $rocketstyle: t }) => css`
        padding-left: ${t.paddingX}px;
        margin-left: ${t.marginX}px;
        color: ${t.color};
        background-color: ${t.bgColor};
        border-color: ${t.bgColor};

        &:hover {
          color: ${t.color};
          background-color: #0069d9;
          border-color: #0062cc;
        }
      `};
    `
  )
  .paddings((t) => ({
    paddingxl: {
      paddingX: 50,
    },
  }))
  .gaps((t) => ({
    gapxl: {
      marginX: 50,
    },
  }))

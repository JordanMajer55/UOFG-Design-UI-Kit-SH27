import { useEffect, useState } from 'react';
import { getButton, ButtonVariantToken } from '../api/designSystemClient';

interface ButtonProps {
  label: string;
  variant?: 'primary'; // future: 'secondary', 'tertiary'
}

export const Button = ({ label, variant = 'primary' }: ButtonProps) => {
  const [style, setStyle] = useState<ButtonVariantToken | null>(null);

  useEffect(() => {
    getButton()
      .then((data) => setStyle(data.button[variant]))
      .catch((err: unknown) => {
        if (err instanceof Error) console.error('Error fetching button token:', err.message);
        else console.error('Unknown error fetching button token:', err);
      });
  }, [variant]);

  if (!style) return <button>Loading...</button>;

  const padding = `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`;

  return (
    <button
      style={{
        backgroundColor: style.backgroundColor,
        borderRadius: `${style.borderRadius}px`,
        width: `${style.width}px`,
        height: `${style.height}px`,
        padding,
        fontFamily: style.typography.fontFamily,
        fontWeight: style.typography.fontWeight,
        fontSize: `${style.typography.fontSize}px`,
        lineHeight: `${style.typography.lineHeight}px`,
        letterSpacing: `${style.typography.letterSpacing}px`,
        border: 'none',
        color: '#fff', // default text color
      }}
    >
      {label}
    </button>
  );
};

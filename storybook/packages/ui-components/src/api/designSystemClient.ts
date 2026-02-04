// Typography tokens
export interface TypographyToken {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

// Padding tokens
export interface PaddingToken {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Button variant token
export interface ButtonVariantToken {
  backgroundColor: string;
  borderRadius: number;
  width: number;
  height: number;
  padding: PaddingToken;
  typography: TypographyToken;
}

// Full response shape
export interface ButtonTokenResponse {
  button: {
    primary: ButtonVariantToken;
    // future-proofing:
    // secondary?: ButtonVariantToken;
    // tertiary?: ButtonVariantToken;
  };
}

export async function getButton(): Promise<ButtonTokenResponse> {
  const response = await fetch('http://localhost:3000/button');

  if (!response.ok) {
    throw new Error('Failed to fetch button token from API');
  }

  return (await response.json()) as ButtonTokenResponse;
}

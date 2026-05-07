/* SVG logo components for AI tool brands used in the hero floating icons */

export function CursorLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#000000" />
      <path d="M8 8L24 16L16 18L14 24L8 8Z" fill="white" />
    </svg>
  );
}

export function CopilotLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#24292e" />
      {/* GitHub Octocat simplified */}
      <path
        d="M16 6C10.477 6 6 10.477 6 16c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.86-.01-1.69-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0116 9.69c.85.004 1.7.115 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0026 16c0-5.523-4.477-10-10-10z"
        fill="white"
      />
    </svg>
  );
}

export function ClaudeLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#D4A574" />
      <path
        d="M18.5 8L12 24h3l1.5-4h5l1.5 4h3L20.5 8h-2zm1 4.5L21.5 18h-4l2-5.5z"
        fill="white"
      />
    </svg>
  );
}

export function ChatGPTLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#10A37F" />
      <path
        d="M16 7c-2.8 0-5.2 1.5-6.5 3.8-.3.5-.5 1-.6 1.5-.1.3-.1.5-.1.8 0 .2 0 .4.1.6.2 1 .7 1.8 1.4 2.5l4.7 4.7c.4.4 1 .4 1.4 0l4.7-4.7c.7-.7 1.2-1.5 1.4-2.5.1-.2.1-.4.1-.6 0-.3 0-.5-.1-.8-.1-.5-.3-1-.6-1.5C20.2 8.5 17.8 7 16 7z"
        fill="white"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="3" fill="white" />
      <path d="M16 19v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function OpenAILogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#412991" />
      <path
        d="M22.2 13.8c.3-1.1.1-2.3-.5-3.3-.9-1.6-2.8-2.4-4.6-2.1-.8-1-2-1.6-3.3-1.6-1.9 0-3.5 1.2-4.1 2.9-1.1.3-2 1-2.6 2-.9 1.6-.7 3.6.5 5 .3 1.1.1 2.3.5 3.3.9 1.6 2.8 2.4 4.6 2.1.8 1 2 1.6 3.3 1.6 1.9 0 3.5-1.2 4.1-2.9 1.1-.3 2-1 2.6-2 .9-1.6.7-3.6-.5-5z"
        fill="white"
      />
    </svg>
  );
}

export function GeminiLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#4285F4" />
      <path
        d="M16 7C16 7 22 12.5 22 16C22 19.5 22 25 16 25C10 25 10 19.5 10 16C10 12.5 16 7 16 7Z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M16 7C16 7 22 12.5 22 16C22 19.5 16 25 16 25"
        fill="#34A853"
        opacity="0.7"
      />
    </svg>
  );
}

export function WindsurfLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#0EA5E9" />
      <path
        d="M8 20C10 16 14 14 16 14C18 14 20 16 22 14C24 12 24 10 24 10"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 24C10 20 14 18 16 18C18 18 20 20 22 18C24 16 24 14 24 14"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

export function AnthropicLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#191919" />
      <path d="M18.5 8L12 24h3l1.5-4h5l1.5 4h3L20.5 8h-2zm1 4.5L21.5 18h-4l2-5.5z" fill="#D4A574" />
    </svg>
  );
}

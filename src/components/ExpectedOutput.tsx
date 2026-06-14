type ExpectedOutputProps = {
  children?: string
}

export function ExpectedOutput({ children = 'Expected output' }: ExpectedOutputProps) {
  return <p className="bloom-expected-output">{children}</p>
}

import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <SignIn
      afterSignInUrl={"/seller/:username/dashboard"}
      redirectUrl={"/seller/:username/dashboard"}
    />
  )
}
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <SignUp
      afterSignInUrl={"/seller/:username/dashboard"}
      redirectUrl={"/seller/:username/dashboard"}
    />
  )
}
import RegistrationFlow from '../components/RegistrationFlow.jsx'

function PersonalRegister() {
  return (
    <RegistrationFlow
      roleValue="individual"
      roleLabel="Individual"
      accentColor="teal"
      badgeText="Individual registration"
      heading="Create an individual account"
      description="Verify your email with an OTP, then complete your account details to start tracking valuations."
    />
  )
}

export default PersonalRegister

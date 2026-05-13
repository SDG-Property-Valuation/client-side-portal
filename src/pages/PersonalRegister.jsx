import RegistrationFlow from '../components/RegistrationFlow.jsx'

function PersonalRegister() {
  return (
    <RegistrationFlow
      roleValue="client"
      roleLabel="Customer"
      accentColor="teal"
      badgeText="Customer registration"
      heading="Create a customer account"
      description="Verify your email with an OTP, then complete your account details to start tracking valuations."
    />
  )
}

export default PersonalRegister

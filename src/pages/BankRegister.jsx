import RegistrationFlow from '../components/RegistrationFlow.jsx'

function BankRegister() {
  return (
    <RegistrationFlow
      roleValue="banker"
      roleLabel="Banker"
      accentColor="orange"
      badgeText="Banker registration"
      heading="Create a banker account"
      description="Verify your work email with an OTP, then complete your institution details to access the portal."
    />
  )
}

export default BankRegister

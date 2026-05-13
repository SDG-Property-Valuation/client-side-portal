import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { normalizeAuthRole, resolveAuthRole } from '../auth/authUtils.js'

const getDisplayValue = (value) => {
  if (value === null || value === undefined) {
    return '--'
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || '--'
}

const formatDateTime = (value) => {
  if (!value) {
    return '--'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate)
}

const formatRoleLabel = (role) => {
  const normalizedRole = normalizeAuthRole(role)

  if (normalizedRole === 'client') {
    return 'Customer'
  }

  if (normalizedRole === 'banker') {
    return 'Bank user'
  }

  return getDisplayValue(role)
}

function Settings() {
  const { authRole, user } = useAuth()
  const [emailAlertEnabled, setEmailAlertEnabled] = useState(true)
  const [invoiceAlertEnabled, setInvoiceAlertEnabled] = useState(true)

  const resolvedRole = useMemo(() => resolveAuthRole(user?.role, authRole), [authRole, user?.role])
  const profile = user

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="gray" variant="subtle" w="fit-content">
          Account settings
        </Badge>
        <Heading>Settings</Heading>
        <Text color="gray.700">
          Review the details stored for your current account.
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <Stack spacing={6}>
          {!profile || !resolvedRole ? (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              Account details are not available. Please log in again.
            </Alert>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <FormControl>
                  <FormLabel>{resolvedRole === 'banker' ? 'Employee name' : 'Full name'}</FormLabel>
                  <Input value={getDisplayValue(profile.fullname || profile.bankEmployeeName)} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={getDisplayValue(profile.email)} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone number</FormLabel>
                  <Input value={getDisplayValue(profile.phoneNumber)} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>{resolvedRole === 'banker' ? 'Institution' : 'Relationship to property'}</FormLabel>
                  <Input
                    value={getDisplayValue(
                      resolvedRole === 'banker' ? profile.institutionName : profile.relationshipToProperty,
                    )}
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{resolvedRole === 'banker' ? 'Designation' : 'Preferred contact'}</FormLabel>
                  <Input
                    value={getDisplayValue(
                      resolvedRole === 'banker' ? profile.designation : profile.preferredContact,
                    )}
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input value={formatRoleLabel(profile.role)} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>{resolvedRole === 'banker' ? 'Branch' : 'City'}</FormLabel>
                  <Input
                    value={getDisplayValue(
                      resolvedRole === 'banker' ? profile.branch : profile.city,
                    )}
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{resolvedRole === 'banker' ? 'State' : 'State'}</FormLabel>
                  <Input value={getDisplayValue(profile.state)} isReadOnly />
                </FormControl>
                {resolvedRole === 'client' ? (
                  <FormControl>
                    <FormLabel>Confirmation status</FormLabel>
                    <Input value={profile.confirmation ? 'Confirmed' : 'Pending'} isReadOnly />
                  </FormControl>
                ) : null}
                <FormControl>
                  <FormLabel>Account created</FormLabel>
                  <Input value={formatDateTime(profile.createdAt)} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Last updated</FormLabel>
                  <Input value={formatDateTime(profile.updatedAt)} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Account ID</FormLabel>
                  <Input value={getDisplayValue(profile._id)} isReadOnly />
                </FormControl>
              </SimpleGrid>

              <Box pt={2}>
                <Text fontWeight="600" mb={4}>
                  Notification preferences
                </Text>
                <Stack spacing={4}>
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb="0">Email alert when report is ready</FormLabel>
                    <Switch
                      colorScheme="teal"
                      isChecked={emailAlertEnabled}
                      onChange={(event) => setEmailAlertEnabled(event.target.checked)}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb="0">Email alert for invoice reminders</FormLabel>
                    <Switch
                      colorScheme="teal"
                      isChecked={invoiceAlertEnabled}
                      onChange={(event) => setInvoiceAlertEnabled(event.target.checked)}
                    />
                  </FormControl>
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}

export default Settings

import {
  Badge,
  Box,
  Button,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Heading,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'

const readFirstValue = (...candidates) => {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return null
}

const formatRoleLabel = (authRole) => {
  if (authRole === 'banker') {
    return 'Bank account'
  }

  if (authRole === 'client') {
    return 'Individual account'
  }

  return 'Saved account'
}

function WelcomeBack({ redirectTo = '/workspace/reports', isCheckingSession = false }) {
  const { authRole, logout, user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const displayName =
    readFirstValue(
      user?.fullName,
      user?.name,
      fullName,
      user?.companyName,
      user?.bankName,
      user?.email,
    ) || 'Saved account'
  const contactEmail = readFirstValue(user?.email, user?.bankEmail, user?.contactEmail)
  const roleLabel = formatRoleLabel(authRole)

  const handleUseAnotherAccount = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          {isCheckingSession ? 'Checking session' : 'Session ready'}
        </Badge>
        <Heading>
          {isCheckingSession ? 'Checking your saved session' : `Welcome back, ${displayName}`}
        </Heading>
        <Text color="gray.700">
          {isCheckingSession
            ? 'Hold on while we confirm your saved account and restore access to the workspace.'
            : 'You are already logged in. Open your workspace or switch to another account.'}
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Account
            </Text>
            {isCheckingSession ? (
              <SkeletonText noOfLines={2} spacing={3} skeletonHeight="4" />
            ) : (
              <Stack spacing={1}>
                <Text fontWeight="600">{displayName}</Text>
                {contactEmail ? <Text color="gray.600">{contactEmail}</Text> : null}
              </Stack>
            )}
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Role
            </Text>
            {isCheckingSession ? (
              <Skeleton h="24px" borderRadius="md" maxW="160px" />
            ) : (
              <Text fontWeight="600">{roleLabel}</Text>
            )}
          </Box>
        </SimpleGrid>

        <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} mt={8}>
          {isCheckingSession ? (
            <>
              <Skeleton h="44px" borderRadius="md" flex="1" />
              <Skeleton h="44px" borderRadius="md" flex="1" />
            </>
          ) : (
            <>
              <Button as={RouterLink} to={redirectTo} colorScheme="teal" size="lg">
                Open workspace
              </Button>
              <Button
                variant="outline"
                colorScheme="gray"
                size="lg"
                onClick={handleUseAnotherAccount}
                isLoading={isLoggingOut}
              >
                Use another account
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}

export default WelcomeBack

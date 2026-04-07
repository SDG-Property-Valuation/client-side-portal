import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiBriefcase, FiFileText, FiLogIn, FiShield, FiUser } from 'react-icons/fi'
import { useAuth } from '../auth/AuthProvider.jsx'

function Landing() {
  const { authRole, isAuthenticated, isAuthLoading, user } = useAuth()
  const hasSavedSession = Boolean(user && authRole)
  const shouldShowWorkspaceCard = isAuthenticated || hasSavedSession

  const actionCards = [
    ...(shouldShowWorkspaceCard
      ? [
          {
            title: isAuthLoading ? 'Checking your session' : 'Open Workspace',
            description: isAuthLoading
              ? 'We found a saved account and are confirming your access now.'
              : 'Continue to your reports, requested inspections, invoices, and settings.',
            to: '/workspace/reports',
            icon: FiLogIn,
            color: 'teal',
            action: isAuthLoading ? 'Checking session' : 'Open workspace',
            isDisabled: isAuthLoading,
          },
        ]
      : []),
    {
      title: 'Register as Personal',
      description: 'Owners, brokers, and other users can create an account in minutes.',
      to: '/register/personal',
      icon: FiUser,
      color: 'teal',
      action: 'Individual signup',
    },
    {
      title: 'Register as Bank',
      description: 'Register your bank team and manage valuation requests in one place.',
      to: '/register/bank',
      icon: FiBriefcase,
      color: 'orange',
      action: 'Bank signup',
    },
    {
      title: 'Direct Valuation',
      description: 'Share property details now, even without an account.',
      to: '/valuation',
      icon: FiFileText,
      color: 'blue',
      action: 'Start valuation',
    },
  ]

  const stats = [
    {
      label: 'Avg signup time',
      value: '2 mins',
      help: 'Signup for individual or bank',
    },
    {
      label: 'Turnaround goal',
      value: '24 hrs',
      help: 'From request to report',
    },
    {
      label: 'Tracking coverage',
      value: '100%',
      help: 'Every step is recorded',
    },
  ]

  return (
    <Stack spacing={{ base: 10, md: 16 }}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 14 }}>
        <Stack spacing={6}>
          <Badge
            colorScheme="teal"
            variant="subtle"
            w="fit-content"
            px={3}
            py={1}
            borderRadius="full"
          >
            Property valuation portal
          </Badge>
          <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1.1">
            Register, log in, and share property details in one place.
          </Heading>
          <Text fontSize="lg" color="gray.700">
            This portal helps individuals and banks share property details and request valuations quickly.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
            {stats.map((stat) => (
              <Stat
                key={stat.label}
                px={4}
                py={3}
                bg="whiteAlpha.900"
                borderRadius="16px"
                boxShadow="0 12px 24px rgba(18, 54, 53, 0.1)"
              >
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                <StatHelpText color="gray.500">{stat.help}</StatHelpText>
              </Stat>
            ))}
          </SimpleGrid>
        </Stack>

        <Stack spacing={4}>
          {actionCards.map((card) => (
            <Box
              key={card.title}
              bg="whiteAlpha.900"
              borderRadius="24px"
              p={6}
              boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
            >
              <Flex gap={4} align="flex-start">
                <Flex
                  align="center"
                  justify="center"
                  w="52px"
                  h="52px"
                  borderRadius="18px"
                  bg={`${card.color}.500`}
                  color="white"
                  flexShrink={0}
                >
                  <Icon as={card.icon} fontSize="22px" />
                </Flex>
                <Box>
                  <Heading size="md" mb={2}>
                    {card.title}
                  </Heading>
                  <Text color="gray.600" mb={4}>
                    {card.description}
                  </Text>
                  {card.isDisabled ? (
                    <Button colorScheme={card.color} isDisabled>
                      {card.action}
                    </Button>
                  ) : (
                    <Button as={RouterLink} to={card.to} colorScheme={card.color}>
                      {card.action}
                    </Button>
                  )}
                </Box>
              </Flex>
            </Box>
          ))}
        </Stack>
      </SimpleGrid>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 10 }}
        boxShadow="0 20px 60px rgba(18, 54, 53, 0.15)"
      >
        <HStack spacing={3} mb={6}>
          <Icon as={FiShield} color="teal.500" fontSize="22px" />
          <Heading size="md">How it works</Heading>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box>
            <Text fontWeight="600" mb={2}>
              1. Choose a path
            </Text>
            <Text color="gray.600">
              Sign up as an individual, sign up as a bank user, or start direct valuation.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="600" mb={2}>
              2. Share details
            </Text>
            <Text color="gray.600">
              Enter property address, registration number, and reason for valuation.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="600" mb={2}>
              3. Track outcomes
            </Text>
            <Text color="gray.600">
              Get inspection updates and final reports in your account.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Stack>
  )
}

export default Landing

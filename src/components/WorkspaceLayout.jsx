import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaRupeeSign } from 'react-icons/fa'
import {
  FiClipboard,
  FiCreditCard,
  FiFileText,
  FiHome,
  FiList,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi'
import { Link as RouterLink, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'

const workspaceNavItems = [
  { label: 'Reports', to: '/workspace/reports', icon: FiFileText },
  {
    label: 'Inspection Requests',
    to: '/workspace/requested-inspections',
    icon: FiList,
  },
  { label: 'New Valuation Request', to: '/workspace/new-evaluation', icon: FiClipboard },
  { label: 'Invoices', to: '/workspace/invoices', icon: FiCreditCard },
  { label: 'Settings', to: '/workspace/settings', icon: FiSettings },
]

const WorkspaceNavItem = ({ to, icon, children }) => (
  <Box
    as={NavLink}
    to={to}
    display="flex"
    alignItems="center"
    gap={3}
    px={4}
    py={2.5}
    borderRadius="12px"
    fontWeight="600"
    fontSize="sm"
    color="gray.600"
    transition="all 0.2s ease"
    _hover={{ bg: 'blackAlpha.50', color: 'gray.900' }}
    _activeLink={{
      bg: 'brand.500',
      color: 'white',
      boxShadow: '0 12px 20px rgba(39, 152, 145, 0.35)',
    }}
  >
    <Icon as={icon} fontSize="18px" />
    <Text fontSize="sm">{children}</Text>
  </Box>
)

function WorkspaceLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
    navigate('/login', { replace: true })
  }

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset="0"
        bgGradient="linear(to-br, #f7f2e8, #e7f2f1 55%, #f6efe2)"
        zIndex="0"
      />
      <Box
        position="absolute"
        inset="0"
        opacity="0.8"
        zIndex="0"
        backgroundImage="linear-gradient(120deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 45%), radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 55%), linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px)"
        backgroundSize="100%, 100%, 28px 28px, 28px 28px"
        backgroundPosition="0 0, 0 0, -1px -1px, -1px -1px"
      />

      <Box
        as="header"
        position="relative"
        zIndex="2"
        bg="whiteAlpha.900"
        borderBottom="1px solid"
        borderColor="blackAlpha.200"
        boxShadow="0 14px 32px rgba(18, 54, 53, 0.08)"
      >
        <Container maxW="7xl" py={4}>
          <Stack spacing={4}>
            <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
              <HStack
                spacing={3}
                as={RouterLink}
                to="/workspace/reports"
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
              >
                <Flex
                  align="center"
                  justify="center"
                  w="44px"
                  h="44px"
                  borderRadius="16px"
                  bg="brand.500"
                  color="white"
                  boxShadow="0 12px 20px rgba(39, 152, 145, 0.35)"
                >
                  <Icon as={FaRupeeSign} fontSize="20px" />
                </Flex>
                <Box>
                  <Heading size="md">ValuLink Portal</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Your workspace
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={2}>
                <Button as={RouterLink} to="/" size="sm" variant="outline" leftIcon={<FiHome />}>
                  Home
                </Button>
                <Button
                  size="sm"
                  colorScheme="teal"
                  leftIcon={<FiLogOut />}
                  onClick={handleLogout}
                  isLoading={isLoggingOut}
                >
                  Log out
                </Button>
              </HStack>
            </Flex>

            <Flex gap={2} wrap="wrap">
              {workspaceNavItems.map((item) => (
                <WorkspaceNavItem key={item.to} to={item.to} icon={item.icon}>
                  {item.label}
                </WorkspaceNavItem>
              ))}
            </Flex>
          </Stack>
        </Container>
      </Box>

      <Box position="relative" zIndex="1">
        <Container maxW="full" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 6, md: 10 }}>
          <Stack spacing={6}>
            <Box>
              <Outlet />
            </Box>

            <Divider borderColor="blackAlpha.200" />

            <Text color="gray.600" pb={2}>
              Your property details are handled securely.
            </Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default WorkspaceLayout

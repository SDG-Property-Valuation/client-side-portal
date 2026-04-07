import { Box, Button, Container, Divider, Flex, Heading, HStack, Icon, Stack, Text } from '@chakra-ui/react'
import { FiBriefcase, FiFileText, FiHelpCircle, FiHome, FiLogIn, FiShield, FiUser } from 'react-icons/fi'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'

function PortalLayout() {
  const { pathname } = useLocation()
  const isHomePage = pathname === '/'
  const isDirectValuationPage = pathname === '/valuation'
  const isLoginPage = pathname === '/login'

  const publicNavLinksByPath = {
    '/': [],
    '/valuation': [
      { label: 'Home', to: '/', icon: FiHome },
      { label: 'Personal Register', to: '/register/personal', icon: FiUser },
    ],
    '/login': [
      { label: 'Home', to: '/', icon: FiHome },
      { label: 'Direct Valuation', to: '/valuation', icon: FiFileText },
      { label: 'Bank Register', to: '/register/bank', icon: FiBriefcase },
    ],
    '/register/personal': [
      { label: 'Home', to: '/', icon: FiHome },
      { label: 'Direct Valuation', to: '/valuation', icon: FiFileText },
      { label: 'Bank Register', to: '/register/bank', icon: FiBriefcase },
    ],
    '/register/bank': [
      { label: 'Home', to: '/', icon: FiHome },
      { label: 'Direct Valuation', to: '/valuation', icon: FiFileText },
      { label: 'Personal Register', to: '/register/personal', icon: FiUser },
    ],
  }

  const navLinks = publicNavLinksByPath[pathname] ?? [
    { label: 'Home', to: '/', icon: FiHome },
    { label: 'Direct Valuation', to: '/valuation', icon: FiFileText },
  ]

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
      <Box position="relative" zIndex="1">
        <Container maxW="7xl" py={{ base: 6, md: 10 }}>
          <Stack spacing={6}>
            <Box
              as="header"
              bg="whiteAlpha.900"
              border="1px solid"
              borderColor="blackAlpha.200"
              borderRadius="20px"
              px={{ base: 4, md: 6 }}
              py={{ base: 3, md: 4 }}
              boxShadow="0 14px 32px rgba(18, 54, 53, 0.08)"
            >
              <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                <HStack
                  spacing={3}
                  as={RouterLink}
                  to="/"
                  textDecoration="none"
                  _hover={{ textDecoration: 'none' }}
                >
                  <Flex
                    align="center"
                    justify="center"
                    w="44px"
                    h="44px"
                    borderRadius="14px"
                    bg="brand.600"
                    color="white"
                    fontWeight="700"
                    letterSpacing="0.04em"
                  >
                    SDG
                  </Flex>
                  <Box>
                    <Heading size="sm">SDG Group</Heading>
                    <Text fontSize="xs" color="gray.600">
                      Valuation portal
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={2} flexWrap="wrap">
                  {isHomePage
                    ? null
                    : navLinks.map((item) => (
                        <Button
                          key={item.to}
                          as={RouterLink}
                          to={item.to}
                          variant="ghost"
                          size="sm"
                          leftIcon={<Icon as={item.icon} />}
                        >
                          {item.label}
                        </Button>
                      ))}
                  {isLoginPage ? null : (
                    <Button
                      as={RouterLink}
                      to="/login"
                      size="sm"
                      colorScheme={isDirectValuationPage ? 'blue' : 'teal'}
                      leftIcon={<FiLogIn />}
                    >
                      Login
                    </Button>
                  )}
                </HStack>
              </Flex>
            </Box>

            <Box>
              <Outlet />
            </Box>

            <Divider borderColor="blackAlpha.200" />

            <Flex align="center" justify="space-between" wrap="wrap" gap={4} pb={2}>
              <HStack spacing={3}>
                <Icon as={FiShield} color="teal.500" />
                <Text color="gray.600">Your property details are handled securely.</Text>
              </HStack>
              <HStack spacing={4}>
                <HStack spacing={2}>
                  <Icon as={FiHelpCircle} color="teal.500" />
                  <Text fontSize="sm" color="gray.600">
                    Need help? support@valulink.io
                  </Text>
                </HStack>
                <Button
                  as={RouterLink}
                  to="/register/bank"
                  variant="ghost"
                  colorScheme="teal"
                  leftIcon={<FiBriefcase />}
                >
                  Bank signup
                </Button>
              </HStack>
            </Flex>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default PortalLayout

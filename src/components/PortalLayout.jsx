import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FaRupeeSign } from 'react-icons/fa'
import {
  FiBriefcase,
  FiClipboard,
  FiFileText,
  FiHelpCircle,
  FiShield,
} from 'react-icons/fi'
import { Link as RouterLink, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/LanguageProvider.jsx'

const navSections = [
  {
    titleKey: 'nav.section.valuation',
    items: [
      { labelKey: 'nav.directValuation', to: '/valuation', icon: FiClipboard },
      { labelKey: 'nav.reports', to: '/reports', icon: FiFileText },
    ],
  },
]

const navItems = navSections.flatMap((section) => section.items)

const NavItem = ({ to, icon, children, end }) => (
  <Box
    as={NavLink}
    to={to}
    end={end}
    display="flex"
    alignItems="center"
    gap={3}
    px={3}
    py={2.5}
    borderRadius="12px"
    fontWeight="600"
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

function PortalLayout() {
  const { language, setLanguage, t } = useI18n()
  const location = useLocation()
  const isReportRoute =
    location.pathname === '/reports' || location.pathname.startsWith('/reports/')
  const showSidebar = isReportRoute
  const contentMaxW = showSidebar ? '6xl' : '7xl'

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

      <Flex position="relative" zIndex="1" minH="100vh">
        {showSidebar ? (
          <Box
            as="aside"
            display={{ base: 'none', lg: 'flex' }}
            flexDirection="column"
            w="280px"
            p={6}
            bg="whiteAlpha.900"
            borderRight="1px solid"
            borderColor="blackAlpha.200"
            boxShadow="0 18px 40px rgba(18, 54, 53, 0.08)"
          >
            <HStack
              spacing={3}
              mb={8}
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
                borderRadius="16px"
                bg="brand.500"
                color="white"
                boxShadow="0 12px 20px rgba(39, 152, 145, 0.35)"
              >
                <Icon as={FaRupeeSign} fontSize="20px" />
              </Flex>
              <Box>
                <Heading size="md">{t('brand.name')}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {t('brand.subtitle')}
                </Text>
              </Box>
            </HStack>

            <Stack spacing={6} flex="1">
              {navSections.map((section) => (
                <Box key={section.titleKey}>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.2em"
                    color="gray.500"
                    mb={3}
                  >
                    {t(section.titleKey)}
                  </Text>
                  <Stack spacing={1}>
                    {section.items.map((item) => (
                      <NavItem key={item.to} to={item.to} icon={item.icon} end={item.end}>
                        {t(item.labelKey)}
                      </NavItem>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Box mt={6}>
              <Divider borderColor="blackAlpha.200" mb={4} />
              <Stack spacing={4}>
                <HStack spacing={3}>
                  <Icon as={FiHelpCircle} color="teal.500" />
                  <Text fontSize="sm" color="gray.600">
                    {t('help.support')}
                  </Text>
                </HStack>
                <Button
                  as={RouterLink}
                  to="/valuation"
                  size="sm"
                  colorScheme="teal"
                  leftIcon={<FiClipboard />}
                >
                  {t('button.newValuation')}
                </Button>
              </Stack>
            </Box>
          </Box>
        ) : null}

        <Box flex="1">
          <Container maxW={contentMaxW} py={{ base: 6, md: 10 }}>
            <Stack spacing={6}>
              <Box
                bg="whiteAlpha.900"
                borderRadius="24px"
                p={{ base: 5, md: 6 }}
                boxShadow="0 18px 40px rgba(18, 54, 53, 0.12)"
                display={{ base: 'block', lg: 'none' }}
              >
                <Stack spacing={4}>
                  <Flex align="center" justify="space-between" gap={4} wrap="wrap">
                    <HStack spacing={3}>
                      <Flex
                        align="center"
                        justify="center"
                        w="40px"
                        h="40px"
                        borderRadius="14px"
                        bg="brand.500"
                        color="white"
                      >
                        <Icon as={FaRupeeSign} fontSize="18px" />
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('brand.name')}</Heading>
                        <Text fontSize="xs" color="gray.600">
                          {t('brand.subtitle')}
                        </Text>
                      </Box>
                    </HStack>
                    <HStack spacing={2}>
                      <Button as={RouterLink} to="/login" size="sm" variant="outline" colorScheme="teal">
                        {t('nav.login')}
                      </Button>
                      <Button as={RouterLink} to="/valuation" size="sm" colorScheme="teal">
                        {t('button.newValuation')}
                      </Button>
                    </HStack>
                  </Flex>
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.2em">
                      {t('language.label')}
                    </Text>
                    <Select
                      size="sm"
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      maxW="160px"
                      aria-label={t('language.label')}
                      bg="white"
                    >
                      <option value="en">{t('language.english')}</option>
                      <option value="mr">{t('language.marathi')}</option>
                    </Select>
                  </HStack>
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                    {navItems.map((item) => (
                      <NavItem key={item.to} to={item.to} icon={item.icon} end={item.end}>
                        {t(item.labelKey)}
                      </NavItem>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Box>

              <Box
                bg="whiteAlpha.900"
                borderRadius="24px"
                p={{ base: 6, md: 8 }}
                boxShadow="0 18px 40px rgba(18, 54, 53, 0.12)"
                display={{ base: 'none', lg: 'block' }}
              >
                <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="gray.500">
                      {t('workspace.label')}
                    </Text>
                    <Heading size="md">{t('workspace.title')}</Heading>
                    <Text color="gray.600">
                      {t('workspace.subtitle')}
                    </Text>
                  </Stack>
                  <HStack spacing={2}>
                    <Badge colorScheme="teal" variant="subtle">
                      {t('badge.clientBank')}
                    </Badge>
                    <Stack spacing={1} minW="150px">
                      <Text
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.2em"
                        color="gray.500"
                      >
                        {t('language.label')}
                      </Text>
                      <Select
                        size="sm"
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                        aria-label={t('language.label')}
                        bg="white"
                      >
                        <option value="en">{t('language.english')}</option>
                        <option value="mr">{t('language.marathi')}</option>
                      </Select>
                    </Stack>
                    <Button as={RouterLink} to="/login" size="sm" variant="ghost" colorScheme="teal">
                      {t('nav.login')}
                    </Button>
                    <Button as={RouterLink} to="/reports" size="sm" variant="outline" colorScheme="teal">
                      {t('button.viewReports')}
                    </Button>
                    <Button as={RouterLink} to="/valuation" size="sm" colorScheme="teal">
                      {t('button.newValuation')}
                    </Button>
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
                  <Text color="gray.600">
                    {t('footer.secure')}
                  </Text>
                </HStack>
                <HStack spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/register/bank"
                    variant="ghost"
                    colorScheme="teal"
                    leftIcon={<FiBriefcase />}
                  >
                    {t('button.bankOnboarding')}
                  </Button>
                </HStack>
              </Flex>
            </Stack>
          </Container>
        </Box>
      </Flex>
    </Box>
  )
}

export default PortalLayout

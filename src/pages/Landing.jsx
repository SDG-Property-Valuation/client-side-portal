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
import { FiBriefcase, FiCheckCircle, FiFileText, FiShield, FiUser } from 'react-icons/fi'
import { useI18n } from '../i18n/LanguageProvider.jsx'

function Landing() {
  const { t } = useI18n()
  const actionCards = [
    {
      title: t('landing.card.personal.title'),
      description: t('landing.card.personal.description'),
      to: '/register/personal',
      icon: FiUser,
      color: 'teal',
      action: t('landing.card.personal.action'),
    },
    {
      title: t('landing.card.bank.title'),
      description: t('landing.card.bank.description'),
      to: '/register/bank',
      icon: FiBriefcase,
      color: 'orange',
      action: t('landing.card.bank.action'),
    },
    {
      title: t('landing.card.direct.title'),
      description: t('landing.card.direct.description'),
      to: '/valuation',
      icon: FiFileText,
      color: 'blue',
      action: t('landing.card.direct.action'),
    },
  ]

  const stats = [
    {
      label: t('landing.stats.onboarding.label'),
      value: t('landing.stats.onboarding.value'),
      help: t('landing.stats.onboarding.help'),
    },
    {
      label: t('landing.stats.turnaround.label'),
      value: t('landing.stats.turnaround.value'),
      help: t('landing.stats.turnaround.help'),
    },
    {
      label: t('landing.stats.audit.label'),
      value: t('landing.stats.audit.value'),
      help: t('landing.stats.audit.help'),
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
            {t('landing.badge')}
          </Badge>
          <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1.1">
            {t('landing.heading')}
          </Heading>
          <Text fontSize="lg" color="gray.700">
            {t('landing.subheading')}
          </Text>
          <HStack spacing={3} flexWrap="wrap">
            <Button
              as={RouterLink}
              to="/register/personal"
              size="lg"
              colorScheme="teal"
              leftIcon={<FiCheckCircle />}
            >
              {t('landing.registerPersonal')}
            </Button>
            <Button as={RouterLink} to="/register/bank" size="lg" variant="outline">
              {t('landing.registerBank')}
            </Button>
          </HStack>
          <Text color="gray.600">
            {t('landing.loginPrompt')}{' '}
            <Button as={RouterLink} to="/login" variant="link" colorScheme="teal">
              {t('landing.loginLink')}
            </Button>
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
                  <Button as={RouterLink} to={card.to} colorScheme={card.color}>
                    {card.action}
                  </Button>
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
          <Heading size="md">{t('landing.how.title')}</Heading>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box>
            <Text fontWeight="600" mb={2}>
              {t('landing.how.step1.title')}
            </Text>
            <Text color="gray.600">
              {t('landing.how.step1.body')}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="600" mb={2}>
              {t('landing.how.step2.title')}
            </Text>
            <Text color="gray.600">
              {t('landing.how.step2.body')}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="600" mb={2}>
              {t('landing.how.step3.title')}
            </Text>
            <Text color="gray.600">
              {t('landing.how.step3.body')}
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Stack>
  )
}

export default Landing

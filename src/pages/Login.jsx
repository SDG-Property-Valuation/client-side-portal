import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiBriefcase, FiLock, FiUser } from 'react-icons/fi'
import { useI18n } from '../i18n/LanguageProvider.jsx'

function Login() {
  const { t } = useI18n()

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          {t('login.badge')}
        </Badge>
        <Heading>{t('login.heading')}</Heading>
        <Text color="gray.700">
          {t('login.subheading')}
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
          <TabList>
            <Tab>{t('login.tab.personal')}</Tab>
            <Tab>{t('login.tab.bank')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('login.label.personalId')}</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiUser color="#94a3b8" />
                    </InputLeftElement>
                    <Input placeholder={t('login.placeholder.personalId')} />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t('login.label.password')}</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiLock color="#94a3b8" />
                    </InputLeftElement>
                    <Input type="password" placeholder={t('login.placeholder.password')} />
                  </InputGroup>
                </FormControl>
                <Button colorScheme="teal" size="lg">
                  {t('login.button.personal')}
                </Button>
              </Stack>
            </TabPanel>
            <TabPanel px={0}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('login.label.bankId')}</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiBriefcase color="#94a3b8" />
                    </InputLeftElement>
                    <Input placeholder={t('login.placeholder.bankId')} />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t('login.label.password')}</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiLock color="#94a3b8" />
                    </InputLeftElement>
                    <Input type="password" placeholder={t('login.placeholder.password')} />
                  </InputGroup>
                </FormControl>
                <Button colorScheme="orange" size="lg">
                  {t('login.button.bank')}
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Stack spacing={2} mt={6}>
          <Text color="gray.600">
            {t('login.prompt.registerPersonal')}{' '}
            <Button as={RouterLink} to="/register/personal" variant="link" colorScheme="teal">
              {t('login.link.registerPersonal')}
            </Button>
          </Text>
          <Text color="gray.600">
            {t('login.prompt.registerBank')}{' '}
            <Button as={RouterLink} to="/register/bank" variant="link" colorScheme="orange">
              {t('login.link.registerBank')}
            </Button>
          </Text>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Login

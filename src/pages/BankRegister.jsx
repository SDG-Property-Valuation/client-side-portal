import {
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiBriefcase, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import { useI18n } from '../i18n/LanguageProvider.jsx'

function BankRegister() {
  const { t } = useI18n()

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="orange" variant="subtle" w="fit-content">
          {t('bank.badge')}
        </Badge>
        <Heading>{t('bank.heading')}</Heading>
        <Text color="gray.700">
          {t('bank.subheading')}
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired>
            <FormLabel>{t('bank.label.institutionName')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiBriefcase color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('bank.placeholder.institutionName')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('bank.label.branchRegion')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMapPin color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('bank.placeholder.branchRegion')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('bank.label.primaryContact')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('bank.placeholder.primaryContact')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('bank.label.role')}</FormLabel>
            <Select placeholder={t('bank.placeholder.role')}>
              <option value="loan-officer">{t('bank.option.role.loanOfficer')}</option>
              <option value="credit-analyst">{t('bank.option.role.creditAnalyst')}</option>
              <option value="branch-manager">{t('bank.option.role.branchManager')}</option>
              <option value="relationship-manager">
                {t('bank.option.role.relationshipManager')}
              </option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('bank.label.email')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMail color="#94a3b8" />
              </InputLeftElement>
              <Input type="email" placeholder={t('bank.placeholder.email')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('bank.label.phone')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiPhone color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('bank.placeholder.phone')} />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>{t('bank.label.registrationId')}</FormLabel>
            <Input placeholder={t('bank.placeholder.registrationId')} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('bank.label.monthlyRequests')}</FormLabel>
            <Select placeholder={t('bank.placeholder.monthlyRequests')}>
              <option value="1-10">{t('bank.option.volume.1-10')}</option>
              <option value="11-50">{t('bank.option.volume.11-50')}</option>
              <option value="51-100">{t('bank.option.volume.51-100')}</option>
              <option value="100+">{t('bank.option.volume.100plus')}</option>
            </Select>
          </FormControl>
        </SimpleGrid>

        <Stack spacing={4} mt={6}>
          <Checkbox colorScheme="orange">
            {t('bank.confirmation')}
          </Checkbox>
          <Button colorScheme="orange" size="lg">
            {t('bank.submit')}
          </Button>
          <Button as={RouterLink} to="/login" variant="link" colorScheme="orange">
            {t('bank.loginLink')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default BankRegister
